// tslint:disable-next-line: no-var-requires
const tap = require("tap");
import axios, { AxiosPromise, AxiosInstance } from "axios";
import {
  QuorumTestLedger,
  IQuorumGenesisOptions,
  IAccount,
} from "@hyperledger-labs/bif-test-tooling";
import HelloWorldContractJson from "../../../../solidity/hello-world-contract/HelloWorld.json";
import { Logger, LoggerProvider } from "@hyperledger-labs/bif-common";
import {
  Web3EthContract,
  IQuorumDeployContractOptions,
  PluginLedgerConnectorQuorum,
  PluginFactoryLedgerConnector,
} from "@hyperledger-labs/bif-plugin-ledger-connector-quorum";
import {
  ApiServer,
  ConfigService,
  IBifApiServerOptions,
} from "@hyperledger-labs/bif-cmd-api-server";
import { ICactusPlugin } from "@hyperledger-labs/bif-core-api";
import { PluginKVStorageMemory } from "@hyperledger-labs/bif-plugin-kv-storage-memory";
import { DefaultApi, Configuration } from "@hyperledger-labs/bif-sdk";

const log: Logger = LoggerProvider.getOrCreate({
  label: "test-deploy-contract-via-web-service",
  level: "trace",
});

tap.test(
  "pulls up API server and deploys contract via REST API",
  async (assert: any) => {
    // 1. Instantiate a ledger object
    const quorumTestLedger = new QuorumTestLedger({
      containerImageVersion: "1.0.0",
    });
    assert.tearDown(() => quorumTestLedger.stop());
    assert.tearDown(() => quorumTestLedger.destroy());
    // 2. Start the actual ledger
    await quorumTestLedger.start();

    // 3. Gather parameteres needed to run an embedded ApiServer which can connect to/interact with said ledger
    const rpcApiHttpHost = await quorumTestLedger.getRpcApiHttpHost();

    const configService = new ConfigService();
    const bifApiServerOptions: IBifApiServerOptions = configService.newExampleConfig();
    bifApiServerOptions.configFile = "";
    bifApiServerOptions.apiCorsDomainCsv = "*";
    bifApiServerOptions.apiPort = 0;
    const config = configService.newExampleConfigConvict(bifApiServerOptions);
    const plugins: ICactusPlugin[] = [];

    const kvStoragePlugin = new PluginKVStorageMemory({ backend: new Map() });
    plugins.push(kvStoragePlugin);

    const ledgerConnectorQuorum = new PluginLedgerConnectorQuorum({
      rpcApiHttpHost,
    });
    plugins.push(ledgerConnectorQuorum);

    const apiServer = new ApiServer({ config, plugins });
    assert.tearDown(() => apiServer.shutdown());

    // 4. Start the API server which now is connected to the quorum ledger
    const out = await apiServer.start();
    log.debug(`ApiServer.started OK:`, out);

    // 5. Find a high net worth account in the genesis object of the quorum ledger
    const quorumGenesisOptions: IQuorumGenesisOptions = await quorumTestLedger.getGenesisJsObject();
    assert.ok(quorumGenesisOptions);
    assert.ok(quorumGenesisOptions.alloc);

    const highNetWorthAccounts: string[] = Object.keys(
      quorumGenesisOptions.alloc
    ).filter((address: string) => {
      const anAccount: IAccount = quorumGenesisOptions.alloc[address];
      const balance: number = parseInt(anAccount.balance, 10);
      return balance > 10e7;
    });
    const [firstHighNetWorthAccount] = highNetWorthAccounts;

    // 6. Instantiate the SDK dynamically with whatever port the API server ended up bound to (port 0)
    const httpServer = apiServer.getHttpServerApi();
    const addressInfo: any = httpServer?.address();
    log.debug(`AddressInfo: `, addressInfo);
    const CACTUS_API_HOST = `http://${addressInfo.address}:${addressInfo.port}`;

    const configuration = new Configuration({ basePath: CACTUS_API_HOST });
    const api = new DefaultApi(configuration);

    // 7. Issue an API call to the API server via the SDK verifying that the SDK and the API server both work
    const response = await api.apiV1ConsortiumPost({
      configurationEndpoint: "domain-and-an-http-endpoint",
      id: "asdf",
      name: "asdf",
      bifNodes: [
        {
          host: "BIF-NODE-HOST-1",
          publicKey: "FAKE-PUBLIC-KEY",
        },
      ],
    });
    assert.ok(response);
    assert.ok(response.status > 199 && response.status < 300);

    // 8. Assemble request to invoke the deploy contract method of the quorum ledger connector plugin via the REST API
    const bodyObject = {
      ethAccountUnlockPassword: "",
      fromAddress: firstHighNetWorthAccount,
      contractJsonArtifact: HelloWorldContractJson,
    };
    const pluginId = ledgerConnectorQuorum.getId();
    const url = `${CACTUS_API_HOST}/api/v1/plugins/${pluginId}/contract/deploy`;
    // 9. Deploy smart contract by issuing REST API call
    // TODO: Make this part of the SDK so that manual request assembly is not required. Should plugins have their own SDK?
    const response2 = await axios.post(url, bodyObject, {});
    assert.ok(response2, "Response for contract deployment is truthy");
    assert.ok(
      response2.status > 199 && response.status < 300,
      "Response status code for contract deployment is 2xx"
    );
    assert.end();
  }
);
