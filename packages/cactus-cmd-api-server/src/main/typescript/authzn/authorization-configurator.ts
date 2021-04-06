import express, { Request } from "express";
import { Optional } from "typescript-optional";
import passport, { Strategy } from "passport";

import {
  Strategy as OAuth2PassportStrategy,
  VerifyCallback,
  StrategyOptionsWithRequest,
} from "passport-oauth2";

import { Strategy as OidcPassportStrategy } from "passport-openid-oauth20";

import {
  Strategy as Saml2PassportStrategy,
  VerifiedCallback,
  Profile as Saml2Profile,
  SamlConfig,
} from "passport-saml";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import { PluginRegistry } from "@hyperledger/cactus-core";

import { AuthorizationProtocol } from "../config/authorization-protocol";
import { ICactusApiServerOptions } from "../config/config-service";
import { Authorizer } from "./authorizer";
import { IAuthorizationConfig } from "./i-authorization-config";

export const K_WARN_NO_AUTHORIZATION_PROTOCOL =
  "The API server configuration specified no authorization protocol. Do not use this in production!";

export interface IAuthorizationConfiguratorOptions {
  logLevel?: LogLevelDesc;
  pluginRegistry: PluginRegistry;
  apiServerOptions: ICactusApiServerOptions;
}

export class AuthorizationConfigurator {
  public static readonly CLASS_NAME = "AuthorizationConfigurator";

  private readonly log: Logger;
  private readonly pluginRegistry: PluginRegistry;
  private readonly config: ICactusApiServerOptions;

  public get className(): string {
    return AuthorizationConfigurator.CLASS_NAME;
  }

  constructor(public readonly opts: IAuthorizationConfiguratorOptions) {
    const fnTag = `${this.className}#constructor()`;

    Checks.truthy(opts, `${fnTag} arg options`);
    Checks.truthy(opts.apiServerOptions, `${fnTag} options.apiServerOptions`);
    Checks.truthy(opts.pluginRegistry, `${fnTag} options.pluginRegistry`);
    Checks.truthy(
      opts.pluginRegistry instanceof PluginRegistry,
      `${fnTag} options.registry instanceof PluginRegistry`,
    );

    this.config = opts.apiServerOptions;
    this.pluginRegistry = opts.pluginRegistry;

    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.log.debug(`Instantiated ${this.className} OK`);
  }

  /**
   * Hooks up the Express web application with authorization as per the API
   * server configuration.
   * It is assumed by this method that the plugin registry has already been
   * initialized and now is containing the list of plugins that can be filtered
   * down to the list of plugins that also expose web services.
   */
  async configureAuthzProtocol(): Promise<Optional<Authorizer>> {
    // const fnTag = `${this.className}#configureAuthorizationProtocol()`;
    const { authorizationProtocol, authorizationConfigJson } = this.config;
    const { log, pluginRegistry } = this;

    this.log.info(`Configuring authorization: ${authorizationProtocol} ...`);

    const strategyMaybe = await this.instantiatePassportStrategy(
      authorizationProtocol,
      authorizationConfigJson,
    );

    if (strategyMaybe.isPresent()) {
      const strategy = strategyMaybe.get();
      passport.use(authorizationProtocol, strategy);
      const logLevel = this.opts.logLevel;
      const authorizer = new Authorizer({
        logLevel,
        strategy,
        authorizationProtocol,
        pluginRegistry,
      });
      return Optional.ofNonNull(authorizer);
    } else {
      log.warn(K_WARN_NO_AUTHORIZATION_PROTOCOL);
      return Optional.empty();
    }
  }

  // private parseAuthzOptions(authorizationConfigJson: string): unknown {
  //   const fnTag = `${this.className}#parseAuthZOptions()`;
  //   try {
  //     return JSON.parse(authorizationConfigJson);
  //   } catch (ex) {
  //     const msg =
  //       `${fnTag} Unable to deserialize JSON string ` +
  //       ` containing authorization options. ` +
  //       `Is this a valid JSON string? => ${authorizationConfigJson}`;
  //     throw new Error(msg);
  //   }
  // }

  private async instantiatePassportStrategy(
    authorizationProtocol: string,
    authorizationConfigJson: IAuthorizationConfig,
  ): Promise<Optional<Strategy>> {
    const fnTag = `${this.className}#instantiatePassportStrategy()`;

    switch (authorizationProtocol) {
      case AuthorizationProtocol.NONE: {
        this.log.warn(`Do not use AuthorizationProtocol.NONE in production!`);
        return Optional.empty();
      }
      case AuthorizationProtocol.OPENIDCONNECT: {
        // {
        //   authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
        //   tokenURL: "https://www.googleapis.com/oauth2/v4/token",
        //   userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        //   clientID: GOOGLE_CLIENT_ID,
        //   clientSecret: GOOGLE_CLIENT_SECRET,
        //   callbackURL: "https://www.example.net/auth/google/callback"
        // },
        const strategy = new OidcPassportStrategy(
          authorizationConfigJson.passportStrategyOptions,
          (
            accessToken: string,
            refreshToken: string,
            profile: Record<string, unknown>,
            done: VerifyCallback,
          ) => {
            // FIXME delete this once testing is done, do not ever log creds...
            this.log.debug(`OAuth2Strategy:accessToken=${accessToken}`);
            this.log.debug(`OAuth2Strategy:refreshToken=${refreshToken}`);
            this.log.debug(`OAuth2Strategy:profile=%o`, profile);
            const user = {};
            // FIXME how do we verify users?
            done(null, user);
          },
        );
        return Optional.ofNonNull(strategy);
      }
      case AuthorizationProtocol.OAUTH2: {
        // {
        //   authorizationURL: 'https://www.example.com/oauth2/authorize',
        //   tokenURL: 'https://www.example.com/oauth2/token',
        //   clientID: EXAMPLE_CLIENT_ID,
        //   clientSecret: EXAMPLE_CLIENT_SECRET,
        //   callbackURL: "http://localhost:3000/auth/example/callback"
        // }
        const strategy = new OAuth2PassportStrategy(
          authorizationConfigJson.passportStrategyOptions as StrategyOptionsWithRequest,
          (
            req: Request,
            accessToken: string,
            refreshToken: string,
            profile: Record<string, unknown>,
            done: VerifyCallback,
          ) => {
            // FIXME delete this once testing is done, do not ever log creds...
            this.log.debug(`OAuth2Strategy:accessToken=${accessToken}`);
            this.log.debug(`OAuth2Strategy:refreshToken=${refreshToken}`);
            this.log.debug(`OAuth2Strategy:profile=%o`, profile);
            const user = {};
            // FIXME how do we verify users?
            done(null, user);
          },
        );
        return Optional.ofNonNull(strategy);
      }
      case AuthorizationProtocol.SAML2: {
        // {
        //   path: '/login/callback',
        //   entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        //   issuer: 'passport-saml'
        // }
        const strategy = new Saml2PassportStrategy(
          authorizationConfigJson.passportStrategyOptions as SamlConfig,
          (
            req: express.Request,
            profile: Saml2Profile | null | undefined,
            done: VerifiedCallback,
          ) => {
            this.log.debug(`Saml2Strategy:profile=%o`, profile);
            const user = {};
            // FIXME how do we verify users?
            done(null, user);
          },
        );
        return Optional.ofNonNull(strategy);
      }
      default: {
        const acceptedCsv = Object.values(AuthorizationProtocol).join(",");
        const msg =
          `${fnTag} Unknown authz protocol: ${authorizationProtocol} ` +
          `Accepted values: ${acceptedCsv}`;
        throw new Error(msg);
      }
    }
  }
}
