import type { AddressInfo } from "net";
import http from "http";
import test, { Test } from "tape-promise/tape";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import bodyParser from "body-parser";
import Web3 from "web3";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { isOpenApiSpecValidationError } from "@hyperledger/cactus-core";
import { expressOpenApiValidatorErrorFormatter } from "@hyperledger/cactus-core";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import {
  BesuTestLedger,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";
import {
  LogLevelDesc,
  IListenOptions,
  Servers,
} from "@hyperledger/cactus-common";
import {
  Web3SigningCredentialType,
  PluginLedgerConnectorBesu,
  PluginFactoryLedgerConnector,
  ReceiptType,
  DefaultApi as BesuApi,
  RunTransactionRequest,
  // BesuTransactionConfig,
} from "../../../../main/typescript/public-api";
import HelloWorldContractJson from "../../../solidity/hello-world-contract/HelloWorld.json";
import { PluginImportType } from "@hyperledger/cactus-core-api";

const testCase = "open api spec validation";
const logLevel: LogLevelDesc = "TRACE";

test("BEFORE " + testCase, async (t: Test) => {
  const pruning = pruneDockerAllIfGithubAction({ logLevel });
  await t.doesNotReject(pruning, "Pruning didnt throw OK");
  t.end();
});

test(testCase, async (t: Test) => {
  const besuTestLedger = new BesuTestLedger();
  await besuTestLedger.start();

  test.onFinish(async () => {
    await besuTestLedger.stop();
    await besuTestLedger.destroy();
  });

  const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();

  /**
   * Constant defining the standard 'dev' Besu genesis.json contents.
   *
   * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
   */
  const firstHighNetWorthAccount = "627306090abaB3A6e1400e9345bC60c78a8BEf57";
  const besuKeyPair = {
    privateKey:
      "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  };

  const web3 = new Web3(rpcApiHttpHost);
  const testEthAccount = web3.eth.accounts.create(uuidv4());
  const testEthAccount2 = web3.eth.accounts.create(uuidv4());

  const keychainEntryKey = uuidv4();
  const keychainEntryValue = testEthAccount.privateKey;
  const keychainPlugin = new PluginKeychainMemory({
    instanceId: uuidv4(),
    keychainId: uuidv4(),
    // pre-provision keychain with mock backend holding the private key of the
    // test account that we'll reference while sending requests with the
    // signing credential pointing to this keychain entry.
    backend: new Map([[keychainEntryKey, keychainEntryValue]]),
    logLevel,
  });
  keychainPlugin.set(
    HelloWorldContractJson.contractName,
    HelloWorldContractJson,
  );
  const factory = new PluginFactoryLedgerConnector({
    pluginImportType: PluginImportType.LOCAL,
  });
  const connector: PluginLedgerConnectorBesu = await factory.create({
    rpcApiHttpHost,
    logLevel,
    instanceId: uuidv4(),
    pluginRegistry: new PluginRegistry({ plugins: [keychainPlugin] }),
  });

  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  const server = http.createServer(expressApp);
  const listenOptions: IListenOptions = {
    hostname: "localhost",
    port: 4000,
    server,
  };
  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
  test.onFinish(async () => await Servers.shutdown(server));
  const { address, port } = addressInfo;
  const apiHost = `http://${address}:${port}`;
  t.comment(
    `Metrics URL: ${apiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-prometheus-exporter-metrics`,
  );

  const apiClient = new BesuApi({ basePath: apiHost });

  await connector.getOrCreateWebServices();
  await connector.registerWebServices(expressApp);
  expressApp.use(expressOpenApiValidatorErrorFormatter);

  await connector.transact({
    web3SigningCredential: {
      ethAccount: firstHighNetWorthAccount,
      secret: besuKeyPair.privateKey,
      type: Web3SigningCredentialType.PRIVATEKEYHEX,
    },
    consistencyStrategy: {
      blockConfirmations: 0,
      receiptType: ReceiptType.NODETXPOOLACK,
    },
    transactionConfig: {
      from: firstHighNetWorthAccount,
      to: testEthAccount.address,
      value: 10e9,
      gas: 1000000,
    },
  });

  const balance = await web3.eth.getBalance(testEthAccount.address);
  t.ok(balance, "Retrieved balance of test account OK");
  t.equals(parseInt(balance, 10), 10e9, "Balance of test account is OK");

  const { rawTransaction } = await web3.eth.accounts.signTransaction(
    {
      from: testEthAccount.address,
      to: testEthAccount2.address,
      value: 10e6,
      gas: 1000000,
    },
    testEthAccount.privateKey,
  );

  /*  try {
    await apiClient.apiV1BesuRunTransaction({
      consistencyStrategy:{ blockConfirmations: 0, receiptType: ReceiptType.NODETXPOOLACK},
      transactionConfig:{rawTransaction},
      web3SigningCredential:{ type: Web3SigningCredentialType.NONE }
    } as RunTransactionRequest);
    } catch (ex) {
    t.true(ex.response.status >= 400, "Status code gte 400 OK");
    t.true(ex.response.status < 500, "Status code lt 500 OK");
    }*/

  // To throw error on the test case change the below
  try {
    await apiClient.apiV1BesuRunTransaction({
      consistencyStrategy: {
        blockConfirmations: 0,
        receiptType: ReceiptType.NODETXPOOLACK,
      },
      // transactionConfig: (null as unknown) as BesuTransactionConfig,
      transactionConfig: { rawTransaction },
      web3SigningCredential: { type: Web3SigningCredentialType.NONE },
      something: { that: "the request should not contain", ha: ["ha", "ha"] },
    } as RunTransactionRequest);
    t.comment(`HTTP Status code received in response: ${status}`);
    t.fail("Invalid request sent to endpoint was accepted by the back-end");
  } catch (ex) {
    t.ok(ex, "Exception thrown by API client truthy OK");
    t.ok(ex.response, "Exception.response thrown by API client truthy OK");
    t.ok(ex.response.status, "ex.response.status truthy OK");
    const { status, data } = ex.response;
    t.ok(data, "ex.response.data truthy OK");
    t.true(
      isOpenApiSpecValidationError(data),
      "ex.response.data is Express OpenAPI Validator error",
    );
    const { errors, message } = data;
    t.ok(errors, "ex.response.data.errors truthy OK");
    t.ok(message, "ex.response.data.message truthy OK");
    const msgGood = message.includes("should NOT have additional properties");
    t.true(msgGood, "ex.response.data.message looks correct OK");
    t.true(Array.isArray(errors), "ex.response.data.errors isArray true OK");
    t.true(errors.length > 0, "ex.response.data.errors.length > 0 true OK");
    const [firstEx] = errors;
    t.ok(firstEx, "ex.response.data.errors[0] truthy OK");
    t.ok(firstEx.path, "ex.response.data.errors[0].path truthy OK");
    t.ok(firstEx.message, "ex.response.data.errors[0].message truthy OK");
    t.ok(firstEx.errorCode, "ex.response.data.errors[0].errorCode truthy OK");
    t.comment(`HTTP Status code received in ex.response: ${status}`);
    t.true(status >= 400 && status < 500, "Status code = 4xx ");
  }

  t.end();
});
