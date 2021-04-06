import express, { NextFunction, Request, Response } from "express";
import passport, { Strategy } from "passport";
import HttpStatus from "http-status-codes";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  IExpressRequestHandler,
  IPluginWebService,
  isIPluginWebService,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";

import { AuthorizationProtocol } from "../config/authorization-protocol";

export interface IAuthorizerOptions {
  logLevel?: LogLevelDesc;
  pluginRegistry: PluginRegistry;
  strategy: Strategy;
  authorizationProtocol: AuthorizationProtocol;
}

export class Authorizer {
  public static readonly CLASS_NAME = "Authorizer";

  private readonly log: Logger;
  private readonly authorizationProtocol: AuthorizationProtocol;
  private readonly strategy: Strategy;
  private readonly plugins: IPluginWebService[];

  private nonSecureEndpoints: IWebServiceEndpoint[] = [];
  private initialized = false;
  private _passportAuthorizer: express.RequestHandler | undefined;

  public get className(): string {
    return Authorizer.CLASS_NAME;
  }

  public get isInitialized(): boolean {
    return this.initialized;
  }

  public get passportAuthorizer(): express.RequestHandler {
    const fnTag = `${this.className}#getPassportAuthorizer()`;
    if (this._passportAuthorizer) {
      return this._passportAuthorizer;
    } else {
      throw new Error(`${fnTag} InvalidState: Authorizer not initialized.`);
    }
  }

  constructor(public readonly opts: IAuthorizerOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg opts`);
    Checks.truthy(opts.pluginRegistry, `${fnTag} opts.pluginRegistry`);
    Checks.truthy(opts.strategy, `${fnTag} opts.strategy`);
    Checks.truthy(
      opts.pluginRegistry instanceof PluginRegistry,
      `${fnTag} opts.pluginRegistry instanceof PluginRegistry`,
    );
    Checks.truthy(opts.strategy, `${fnTag} opts.strategy`);
    Checks.truthy(
      opts.authorizationProtocol,
      `${fnTag} opts.authorizationProtocol`,
    );
    Checks.truthy(
      Object.values(AuthorizationProtocol).includes(opts.authorizationProtocol),
      `${fnTag} opts.authorizationProtocol`,
    );

    this.authorizationProtocol = opts.authorizationProtocol;
    this.strategy = opts.strategy;

    this.plugins = opts.pluginRegistry
      .getPlugins()
      .filter((p) => isIPluginWebService(p)) as IPluginWebService[];

    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.log.debug(`Instantiated ${this.className} OK`);
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public async initOnce(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    const { log, authorizationProtocol } = this;
    log.debug(`Initializing ${this.className}...`);

    const endpoints = await this.getEndpoints();
    this.nonSecureEndpoints = await this.collectNonSecureEndpoints(endpoints);

    passport.use(this.strategy);
    this._passportAuthorizer = passport.authenticate(authorizationProtocol);

    log.debug(`Initialized ${this.className} OK`);
    this.initialized = true;
  }

  public async getEndpoints(): Promise<IWebServiceEndpoint[]> {
    const { plugins } = this;
    const promises = plugins.map((p) => p.getOrCreateWebServices());
    const endpoints = await Promise.all(promises);
    return endpoints.flat();
  }

  public getNonSecureEndpoints(): IWebServiceEndpoint[] {
    const fnTag = `${this.className}#getNonSecureEndpoints()`;
    if (this.isInitialized) {
      return this.nonSecureEndpoints;
    } else {
      throw new Error(`${fnTag} Need to call #initOnce() at least once.`);
    }
  }

  private async collectNonSecureEndpoints(
    endpoints: IWebServiceEndpoint[],
  ): Promise<IWebServiceEndpoint[]> {
    const fnTag = `${this.className}#collectNonSecureEndpoints()`;
    Checks.truthy(Array.isArray(endpoints), `${fnTag} isArray(endpoints)`);

    const nonSecureEndpoints = [];

    for (const ep of endpoints) {
      const authzOptionsProvider = await ep.getAuthorizationOptionsProvider();
      const { isSecure } = await authzOptionsProvider.get();
      if (!isSecure) {
        nonSecureEndpoints.push(ep);
      }
    }
    return nonSecureEndpoints;
  }

  /**
   * Checks if the endpoint declares itself as non-secure, calls the
   * authorizer otherwise.
   *
   * Checks if endpoint is on the allow list for being non-secure and if not
   * then crashes if the endpoint has declared itself as non-secure.
   * Meaning that we'll need explicit confirmation from ops personnel that
   * the non-secure enpoints are that way for a reason and not just due to
   * a mistake done by someone who wrote the code and declared them as such.
   *
   * @param req The ExpressJS request object to process.
   * @param res The ExpressJS response object to use when responding to `req`.
   * @param next The ExpressJS next function to signal when we are done.
   */
  async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const tag = `${req?.method?.toUpperCase()} ${req.url}`;
    try {
      this.log.debug(`${tag} Authorization commencing...`);

      const isNonSecure = this.nonSecureEndpoints.some(
        (e) => e.getPath() === req.path && req.method === e.getVerbLowerCase(),
      );
      if (isNonSecure) {
        this.log.debug(`${tag} non-secure endpoint, waving requests through`);
        // just wave it through
        next();
      } else {
        // check if the request is authorized
        this.log.debug(`${tag} secure endpoint, checking authorization...`);
        await this.checkAuthorization(req, res, next);
        this.log.debug(`${tag} secure endpoint, authorization finished...`);
      }
    } catch (ex) {
      this.log.error(`Failed to check request authorization for ${tag}:`, ex);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      // FIXME do not include callstacks
      res.json({ error: ex });
    }
  }

  private async checkAuthorization(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Error | null | "router"> {
    return new Promise<Error | null | "router">((resolve) => {
      this.passportAuthorizer(req, res, (err: Error | null | "router") => {
        if (err) {
          this.log.debug(`Authorization failed for request ${req.url}`, err);
          resolve(err);
        } else {
          this.log.debug(`Authorization OK for request ${req.url}`, err);
          resolve(null);
        }
        next(err);
      });
    });
  }
}
