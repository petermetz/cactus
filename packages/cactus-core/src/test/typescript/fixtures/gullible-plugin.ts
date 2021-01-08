import {
  ICactusPlugin,
  PluginAspect,
} from "@hyperledger/cactus-core-api/src/main/typescript/public-api";

export class GulliblePlugin implements ICactusPlugin {
  public getInstanceId(): string {
    throw new Error("Method not implemented.");
  }

  public privateKeyHex: string = "a-very-private-private-key";

  public publicKeyHex: string = "a-very-important-public-key-for-validation";

  public getPackageName(): string {
    return "@hpyerledger/cactus-gullible-plugin-read-only-proxies-test";
  }

  public getAspect(): PluginAspect {
    return PluginAspect.LEDGER_CONNECTOR; // it is not, but it does not matter
  }
}
