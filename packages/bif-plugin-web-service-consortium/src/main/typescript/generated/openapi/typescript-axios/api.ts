// tslint:disable
/**
 * Hyperledger Cactus Plugin - Consortium Web Service
 * Manage a Cactus consortium through the APIs. Needs administrative priviliges.
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as globalImportUrl from 'url';
import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface BifNode
 */
export interface BifNode {
    /**
     * 
     * @type {string}
     * @memberof BifNode
     */
    host: string;
    /**
     * 
     * @type {string}
     * @memberof BifNode
     */
    publicKey?: string;
}
/**
 * 
 * @export
 * @interface Consortium
 */
export interface Consortium {
    /**
     * 
     * @type {string}
     * @memberof Consortium
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Consortium
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Consortium
     */
    configurationEndpoint: string;
    /**
     * 
     * @type {Array<BifNode>}
     * @memberof Consortium
     */
    bifNodes?: Array<BifNode>;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * The metadata of the consortium (minus the sensitive data)
         * @summary Retrieves a consortium
         * @param {string} consortiumId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId: string, options: any = {}): RequestArgs {
            // verify required parameter 'consortiumId' is not null or undefined
            if (consortiumId === null || consortiumId === undefined) {
                throw new RequiredError('consortiumId','Required parameter consortiumId was null or undefined when calling apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet.');
            }
            const localVarPath = `/api/v1/plugins/@hyperledger/cactus-plugin-web-service-consortium/consortium/{consortiumId}`
                .replace(`{${"consortiumId"}}`, encodeURIComponent(String(consortiumId)));
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...options.headers};

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Creates a new consortium from scratch based on the provided parameters.
         * @param {Consortium} consortium 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium: Consortium, options: any = {}): RequestArgs {
            // verify required parameter 'consortium' is not null or undefined
            if (consortium === null || consortium === undefined) {
                throw new RequiredError('consortium','Required parameter consortium was null or undefined when calling apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost.');
            }
            const localVarPath = `/api/v1/plugins/@hyperledger/cactus-plugin-web-service-consortium/consortium`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...options.headers};
            const needsSerialization = (typeof consortium !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(consortium !== undefined ? consortium : {}) : (consortium || "");

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * The metadata of the consortium (minus the sensitive data)
         * @summary Retrieves a consortium
         * @param {string} consortiumId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId: string, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Consortium> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Creates a new consortium from scratch based on the provided parameters.
         * @param {Consortium} consortium 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium: Consortium, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<void> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * The metadata of the consortium (minus the sensitive data)
         * @summary Retrieves a consortium
         * @param {string} consortiumId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId: string, options?: any): AxiosPromise<Consortium> {
            return DefaultApiFp(configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId, options)(axios, basePath);
        },
        /**
         * 
         * @summary Creates a new consortium from scratch based on the provided parameters.
         * @param {Consortium} consortium 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium: Consortium, options?: any): AxiosPromise<void> {
            return DefaultApiFp(configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium, options)(axios, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * The metadata of the consortium (minus the sensitive data)
     * @summary Retrieves a consortium
     * @param {string} consortiumId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId: string, options?: any) {
        return DefaultApiFp(this.configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumConsortiumIdGet(consortiumId, options)(this.axios, this.basePath);
    }

    /**
     * 
     * @summary Creates a new consortium from scratch based on the provided parameters.
     * @param {Consortium} consortium 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium: Consortium, options?: any) {
        return DefaultApiFp(this.configuration).apiV1PluginsHyperledgerCactusPluginWebServiceConsortiumConsortiumPost(consortium, options)(this.axios, this.basePath);
    }

}


