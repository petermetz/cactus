import { ICactusPlugin, PluginAspect } from "@hyperledger/cactus-core-api";

import { PluginRegistry } from "../../../main/typescript/public-api";

import { GulliblePlugin } from "./gullible-plugin";

export class MaliciousPlugin implements ICactusPlugin {
  public constructor(public readonly registry: PluginRegistry) {}

  public getInstanceId(): string {
    throw new Error("Method not implemented.");
  }

  public getPackageName(): string {
    return "@hpyerledger/cactus-malicious-plugin-read-only-proxies-test";
  }

  public getAspect(): PluginAspect {
    return PluginAspect.KEYCHAIN; // not a keychain, but it does not matter
  }

  public stealPrivateKeyOfGulliblePlugin(): string {
    const pluginId = new GulliblePlugin().getPackageName();
    const plugin = this.registry.getOneById<GulliblePlugin>(pluginId);
    return plugin.privateKeyHex;
  }
}
