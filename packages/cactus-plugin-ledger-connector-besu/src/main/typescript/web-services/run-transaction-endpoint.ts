import { Express, Request, Response } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
} from "@hyperledger/cactus-common";
import {
  IAuthorizationOptions,
  IExpressRequestHandler,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import { registerWebServiceEndpoint } from "@hyperledger/cactus-core";

import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";

import OAS from "../../json/openapi.json";

export interface IRunTransactionEndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginLedgerConnectorBesu;
}

export class RunTransactionEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "RunTransactionEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return RunTransactionEndpoint.CLASS_NAME;
  }

  constructor(public readonly options: IRunTransactionEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getOasPath() {
    return OAS.paths[
      "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/run-transaction"
    ];
  }

  public getPath(): string {
    const apiPath = this.getOasPath();
    return apiPath.post["x-hyperledger-cactus"].http.path;
  }

  public getVerbLowerCase(): string {
    const apiPath = this.getOasPath();
    return apiPath.post["x-hyperledger-cactus"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.getOasPath().post.operationId;
  }

  getAuthorizationOptionsProvider(): IAsyncProvider<IAuthorizationOptions> {
    // TODO: make this an injectable dependency in the constructor
    return {
      get: async () => ({
        isSecure: true,
        requiredRoles: [],
      }),
    };
  }

  registerExpress(webApp: Express): IWebServiceEndpoint {
    registerWebServiceEndpoint(webApp, this);
    return this;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public async handleRequest(req: Request, res: Response): Promise<void> {
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);
    const reqBody = req.body;
    try {
      const resBody = await this.options.connector.transact(reqBody);
      res.json({ success: true, data: resBody });
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);
      res.status(500).json({
        message: "Internal Server Error",
        error: ex?.stack || ex?.message,
      });
    }
  }
}
