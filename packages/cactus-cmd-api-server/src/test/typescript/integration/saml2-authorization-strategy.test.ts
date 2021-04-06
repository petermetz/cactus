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
import {
  LoggerProvider,
  LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";
import {
  ConsortiumDatabase,
  PluginImportType,
} from "@hyperledger/cactus-core-api";
import { AuthorizationProtocol } from "../../../main/typescript/config/authorization-protocol";
import { IAuthorizationConfig } from "../../../main/typescript/authzn/i-authorization-config";
import { AddressInfo } from "net";

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

// TODO - implement the method at:
// packages/cactus-test-tooling/src/main/typescript/keycloak/keycloak-container.ts#getSaml2Options()
// Until then, this has to be skipped unfortunately because the SAML2 config
// cannot be obtained without the method referenced above.
test(testCase, async (t: Test) => {
  try {
    const keycloak = new KeycloakContainer({ logLevel, adminPassword: "a" });
    await keycloak.start();

    test.onFinish(async () => {
      await keycloak.stop();
      await keycloak.destroy();
    });

    const httpServerApi = await Servers.startOnPreferredPort(9191, "0.0.0.0");
    const { address, port } = httpServerApi.address() as AddressInfo;
    const apiHost = `http://${address}:${port}`;

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

    // const defaultRealm = await keycloak.getDefaultRealm();
    const apiBaseUrl = await keycloak.getApiBaseUrl("localhost");
    // const realm = defaultRealm.realm;
    // const realmBaseUrl = `${apiBaseUrl}/realms/${realm}`;

    const samlClientId = "org:hyperledger:cactus:testing:cactus-saml-client";
    // const samlClientBaseUrl = `${realmBaseUrl}/${samlClientId}/`;
    const samlClientBaseUrl = `/`;

    const clientRep = {
      clientId: samlClientId,
      name: "Cactus SAML 2 Client",
      description: "A test client.",
      surrogateAuthRequired: false,
      enabled: true,
      alwaysDisplayInConsole: false,
      clientAuthenticatorType: "client-secret",
      baseUrl: samlClientBaseUrl,
      adminUrl: samlClientBaseUrl,
      redirectUris: ["/*"],
      webOrigins: [],
      notBefore: 0,
      bearerOnly: false,
      consentRequired: false,
      standardFlowEnabled: true,
      implicitFlowEnabled: false,
      directAccessGrantsEnabled: false,
      serviceAccountsEnabled: false,
      publicClient: false,
      frontchannelLogout: true,
      protocol: "saml",
      attributes: {
        "saml.assertion.signature": "false",
        "saml.force.post.binding": "false",
        "saml.multivalued.roles": "false",
        "saml.encrypt": "false",
        "saml.server.signature": "true",
        "saml.server.signature.keyinfo.ext": "false",
        "exclude.session.state.from.auth.response": "false",
        "saml.signing.certificate":
          "MIICszCCAZsCBgF4uCAuQjANBgkqhkiG9w0BAQsFADAdMRswGQYDVQQDDBJjYWN0dXMtc2FtbC1jbGllbnQwHhcNMjEwNDA5MTkzMjAwWhcNMzEwNDA5MTkzMzQwWjAdMRswGQYDVQQDDBJjYWN0dXMtc2FtbC1jbGllbnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCHlbKfwgE21mfS/VG0Kr7j9a9sKBqCWAmD57c8z5du48xZ7JD8+0f6VEFxr+n4PjQBSUjN4wDTgjxuZ67PyxNSMZvJeJDxE1+2661dE8+yr5uJYT29xUX9OzsrVcliEDuTzIYn8Xiv7ERDP9pUpKYMtTz18cy5ND7pqpulOP8F7CY+Q3RxeqQWZiZLainvyEWmkQDehlmAMBHTMoXOGE4SzSGS4teqh2KyVz/+X2l/vFjmrcMlTPicYaXe4iMTt4O5iZ3qJ8PHqBCM1CvHIMIA6HQ1cOkQYbpXqQdajcFaPOU9rk5Hkyl4f5eS97ouoe4JhL5ZF3jtZCq3ZQ7QM79TAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAIdD1ZavmOr8rCuLufSSxSRcukxcvY/wbdNS3hIBAmO4R77xCJRupYM06E2n1lq2F9vGpvFKXo9zA+2YQIjbAtp7DHs1dHLbMezR2U/8ySZO4JBEFxTwSUwRzGPf2wQGkAW48BTaGYlA9ujfemBavA2sFVtPZXqElXxLaV2TuWmR+wfZkQ1it/WTBvoBopvjqn1pnLmdYB5nhjGaI4CTH1HBa2NXUweJ2vOvtmXHW1T9hME9NaEek03wGatSyrdVdHIimfH/ldKlGntEmfxhPGjnGHLTeZiLckA673tDuqs8FkM06Lm5IF1cDRzQMcxHYOovIW8RCAKQtCaTWlivSJ4=",
        "saml.signature.algorithm": "RSA_SHA256",
        saml_force_name_id_format: "false",
        "saml.client.signature": "false",
        "tls.client.certificate.bound.access.tokens": "false",
        "saml.authnstatement": "true",
        "display.on.consent.screen": "false",
        "saml.signing.private.key":
          "MIIEogIBAAKCAQEAh5Wyn8IBNtZn0v1RtCq+4/WvbCgaglgJg+e3PM+XbuPMWeyQ/PtH+lRBca/p+D40AUlIzeMA04I8bmeuz8sTUjGbyXiQ8RNftuutXRPPsq+biWE9vcVF/Ts7K1XJYhA7k8yGJ/F4r+xEQz/aVKSmDLU89fHMuTQ+6aqbpTj/BewmPkN0cXqkFmYmS2op78hFppEA3oZZgDAR0zKFzhhOEs0hkuLXqodislc//l9pf7xY5q3DJUz4nGGl3uIjE7eDuYmd6ifDx6gQjNQrxyDCAOh0NXDpEGG6V6kHWo3BWjzlPa5OR5MpeH+Xkve6LqHuCYS+WRd47WQqt2UO0DO/UwIDAQABAoIBAF9cTGvMuanmFtPw01xSjDws+pqpgiuW2+poORqOL0YQ9hNxLXChE7jfNcBOJ9MvfMhC0O/t7xDUEsjcJ7mCbS5sMdP79oV4SOOQ0zgZzQUyOcTgHdqxO06mMDGEfsV4AU8slFbXoTiqhkB+UoMh4qAhgKTC0miYdH9IPXxxn/x7Wzhbcy2BDjSWVpUt6MoyHu0xs7guh1B/DyRKt0BRqdaguRpwkVIfH2DF2u09XnK2yQNyHX9eJ5cRgHXzd6xsDAhVB4dBLUL0d8FOA1FaN8inHObpjIfLBagMHAkqb+0v6gYEU3oDkGaF+tO5gap5zusycRyWqsS76DZbQOBbBCECgYEAvSzn6jzCmPOob7zzkrXH2JNHloiveV7yiM4W04gxC+b5fY3c65dPbci65qIPXdNCqa80b+fEhDNhOMiMVy/wz4iyT9x4al2y7swjNPQvyHYogl+t+xeva3t/8TiX1m5fNEQFTAFx7cgONxpJ/7/TcoIQjmFsg0UqIqPfrzQzyVkCgYEAt3qZgzPoIWigv626kfuupQo4KPSwkVZEQeaVvVd7WJASKBKy1m7xnTqI7F2LQz7Kar9QtcTTwoYqHbbjAtzQLR5c666IPG7eYRccWazd10fo2IgMmWPEN36XGNX7J4nRofgUuTG68JEvAChpio7/7SqyWwxznQJ2Ua+N6JHnTIsCgYAKemhGEyN8MVLNDZw4LhVpq461idCeWmH4reGZydtdm2eKSsdHzVO68vlXOPa87aytlWTEJgQ+hlIGQSV01tTxydKGleGdkp8MlwYEMtpKsjDAN+h9FezDeU224LmYSPjA/luEwDe9Qe13o98haVCe8RFVsZO/GZ+h143WOH/90QKBgH1q4pCa5KwhlvAvUv8C6WiLScRFLoTKUTIy6lxY9kmdgau+zFxjzejJ4FqhvtYij77UM9lsR8wKZbOWFisYwXx16tJ3pUyaBIydfZWW4rWLxBBvPx2C4teEQsiJTHrEbHWo3JGS+tQCifwzo6FBCpQVwYEXS9ghnLtNo1U8lrztAoGAAiQQyO01cUS/ABykRL0RSmVo2mgL0Ldd14YLioDm0SsTptb0sGmRAHTW/wEdU45KST82Upx7QZbeBlzxcNnwQxhLbyWRl92lTBIi6p62W+o4vraFB2D3DBoaGzbG/Ks7Q8eYaGIC26ru9NdeMO9vjZiLXqRCVIsb/MzaEz85dks=",
        saml_name_id_format: "username",
        "saml.onetimeuse.condition": "false",
        saml_signature_canonicalization_method:
          "http://www.w3.org/2001/10/xml-exc-c14n#",
      },
      authenticationFlowBindingOverrides: {},
      fullScopeAllowed: true,
      nodeReRegistrationTimeout: -1,
      defaultClientScopes: [
        "web-origins",
        "role_list",
        "profile",
        "roles",
        "email",
      ],
      optionalClientScopes: [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt",
      ],
      access: {
        view: true,
        configure: true,
        manage: true,
      },
    };

    const kcAdminClient = await keycloak.createAdminClient();
    const createdClient = await kcAdminClient.clients.create(clientRep);
    t.ok(createdClient, "Keycloak SAML 2 client created truthy OK");

    const callbackUrl = `${apiBaseUrl}/auth/saml/login/callback`;
    const passportStrategyOpts = await keycloak.getSaml2Options(
      samlClientId,
      callbackUrl,
    );
    t.ok(passportStrategyOpts, "SAML2 config truthy OK");

    const authorizationConfig: IAuthorizationConfig = {
      allowedNonSecurePathPatterns: [],
      passportStrategyOptions: passportStrategyOpts,
    };

    const configService = new ConfigService();
    const apiSrvOpts = configService.newExampleConfig();
    apiSrvOpts.logLevel = logLevel;
    apiSrvOpts.authorizationProtocol = AuthorizationProtocol.SAML2;
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
      httpServerApi,
      config: config.getProperties(),
    });
    test.onFinish(async () => await apiServer.shutdown());

    const startResponse = apiServer.start();
    await t.doesNotReject(
      startResponse,
      "failed to start API server with dynamic plugin imports configured for it...",
    );
    t.ok(startResponse, "startResponse truthy OK");

    const apiClient = new ApiServerApi({ basePath: apiHost });
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
