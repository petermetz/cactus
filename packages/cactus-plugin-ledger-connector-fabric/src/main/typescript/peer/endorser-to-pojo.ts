import type { Endorser as FabricEndorser } from "fabric-common";
import {
  Endorser,
  EndorserConnectOptions,
} from "../generated/openapi/typescript-axios";

export function endorserToPojo(fabricEndorser: FabricEndorser): Endorser {
  const endorserRaw = JSON.parse(JSON.stringify(fabricEndorser));

  const options: EndorserConnectOptions = {
    clientCert: endorserRaw.options.clientCert,
    hostnameOverride: endorserRaw.options.hostnameOverride,
    pem: endorserRaw.options.pem,
    requestTimeout: endorserRaw.options.requestTimeout,
    ssl_target_name_override: endorserRaw.options.ssl_target_name_override,
    url: endorserRaw.options.url,
  };

  const endorser: Endorser = {
    chaincodes: endorserRaw.chaincodes,
    name: fabricEndorser.name,
    options,
  };

  return endorser;
}
