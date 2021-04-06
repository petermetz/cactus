import test, { Test } from "tape-promise/tape";
import { v4 as uuidv4 } from "uuid";
import { JWK } from "jose";

import {
  ApiServer,
  ConfigService,
  isHealthcheckResponse,
} from "../../../main/typescript/public-api";
import { DefaultApi as ApiServerApi } from "../../../main/typescript/public-api";
import {
  KeycloakContainer,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import {
  ConsortiumDatabase,
  PluginImportType,
} from "@hyperledger/cactus-core-api";
import { AuthorizationProtocol } from "../../../main/typescript/config/authorization-protocol";
import { IAuthorizationConfig } from "../../../main/typescript/authzn/i-authorization-config";

const testCase = "deploys contract via .json file";
const logLevel: LogLevelDesc = "TRACE";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: __filename,
});

test("BEFORE " + testCase, async (t: Test) => {
  const pruning = pruneDockerAllIfGithubAction({ logLevel });
  await t.doesNotReject(pruning, "Pruning didnt throw OK");
  t.end();
});

test(testCase, async (t: Test) => {
  try {
    const keycloak = new KeycloakContainer({ logLevel });
    await keycloak.start();

    test.onFinish(async () => {
      await keycloak.stop();
      await keycloak.destroy();
    });

    const user = await keycloak.createTestUser({
      username: "roszik_mihaly",
    });
    t.ok(user, "Keycloak test user truthy OK");
    t.comment(JSON.stringify(user));

    // Adding a new plugin to update the prometheus metric K_CACTUS_API_SERVER_TOTAL_PLUGIN_IMPORTS
    const keyPair = await JWK.generate("EC", "secp256k1", { use: "sig" }, true);
    const keyPairPem = keyPair.toPEM(true);
    const db: ConsortiumDatabase = {
      cactusNode: [],
      consortium: [],
      consortiumMember: [],
      ledger: [],
      pluginInstance: [],
    };

    // const passportStrategyOptions = await keycloak.getOauth2Options();
    const passportStrategyOptions = await keycloak.getOauth2Options();
    t.ok(passportStrategyOptions, "oauth2 config truthy OK");

    const authorizationConfig: IAuthorizationConfig = {
      allowedNonSecurePathPatterns: [],
      passportStrategyOptions,
    };

    const configService = new ConfigService();
    const apiSrvOpts = configService.newExampleConfig();
    apiSrvOpts.authorizationProtocol = AuthorizationProtocol.OAUTH2;
    apiSrvOpts.authorizationConfigJson = authorizationConfig;
    apiSrvOpts.configFile = "";
    apiSrvOpts.apiCorsDomainCsv = "*";
    apiSrvOpts.apiPort = 0;
    apiSrvOpts.cockpitPort = 0;
    apiSrvOpts.apiTlsEnabled = false;
    apiSrvOpts.plugins = [
      {
        packageName: "@hyperledger/cactus-plugin-keychain-memory",
        type: PluginImportType.LOCAL,
        options: {
          instanceId: uuidv4(),
          keychainId: uuidv4(),
          logLevel,
        },
      },
      {
        packageName: "@hyperledger/cactus-plugin-consortium-manual",
        type: PluginImportType.LOCAL,
        options: {
          instanceId: uuidv4(),
          keyPairPem: keyPairPem,
          consortiumDatabase: db,
        },
      },
    ];
    const config = configService.newExampleConfigConvict(apiSrvOpts);

    const apiServer = new ApiServer({
      config: config.getProperties(),
    });
    test.onFinish(async () => await apiServer.shutdown());

    const startResponse = apiServer.start();
    await t.doesNotReject(
      startResponse,
      "failed to start API server with dynamic plugin imports configured for it...",
    );
    t.ok(startResponse, "startResponse truthy OK");

    const addressInfoApi = (await startResponse).addressInfoApi;
    const protocol = apiSrvOpts.apiTlsEnabled ? "https" : "http";
    const { address, port } = addressInfoApi;
    const apiHost = `${protocol}://${address}:${port}`;

    const kcAdminClient = await keycloak.createAdminClient();
    const accessToken = await kcAdminClient.getAccessToken();
    t.comment(`Keycloak AccessToken=${accessToken}`);
    const baseOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const apiClient = new ApiServerApi({ basePath: apiHost, baseOptions });
    const resHc = await apiClient.getHealthCheck();
    t.ok(resHc, "healthcheck response truthy OK");
    t.equal(resHc.status, 200, "healthcheck response status === 200 OK");
    t.equal(typeof resHc.data, "object", "typeof resHc.data is 'object' OK");
    t.ok(resHc.data.createdAt, "resHc.data.createdAt truthy OK");
    t.ok(resHc.data.memoryUsage, "resHc.data.memoryUsage truthy OK");
    t.ok(resHc.data.memoryUsage.rss, "resHc.data.memoryUsage.rss truthy OK");
    t.ok(resHc.data.success, "resHc.data.success truthy OK");
    t.true(isHealthcheckResponse(resHc.data), "isHealthcheckResponse OK");
    t.end();
  } catch (ex) {
    log.error(ex);
    t.fail("Exception thrown during test execution, see above for details!");
    throw ex;
  }
});

test("AFTER " + testCase, async (t: Test) => {
  const pruning = pruneDockerAllIfGithubAction({ logLevel });
  await t.doesNotReject(pruning, "Pruning didnt throw OK");
  t.end();
});
