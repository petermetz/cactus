import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import { IAsyncProvider } from "@hyperledger/cactus-common";
import {
  IAuthorizationOptions,
  isIAuthorizationOptions,
} from "@hyperledger/cactus-core-api";

export interface IAuthorizationOptionsProviderOptions {
  logLevel?: LogLevelDesc;
  authorizationOptions: IAuthorizationOptions;
}

export class AuthorizationOptionsProvider
  implements IAsyncProvider<IAuthorizationOptions> {
  public static readonly CLASS_NAME = "AuthorizationOptionsProvider";

  private readonly authorizationOptions: IAuthorizationOptions;
  private readonly log: Logger;

  public static of(
    authorizationOptions: IAuthorizationOptions,
    logLevel?: LogLevelDesc,
  ): AuthorizationOptionsProvider {
    return new AuthorizationOptionsProvider({
      logLevel,
      authorizationOptions,
    });
  }

  public get className() {
    return AuthorizationOptionsProvider.CLASS_NAME;
  }

  constructor(public readonly options: IAuthorizationOptionsProviderOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    this.authorizationOptions = options.authorizationOptions;
    Checks.truthy(
      isIAuthorizationOptions(this.authorizationOptions),
      `${fnTag} authorizationOptions invalid format`,
    );

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.log.debug(`Created instance of ${this.className} OK`);
  }

  async get(): Promise<IAuthorizationOptions> {
    return this.authorizationOptions;
  }
}
