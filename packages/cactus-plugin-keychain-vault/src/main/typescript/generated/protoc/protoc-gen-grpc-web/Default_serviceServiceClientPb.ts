/**
 * @fileoverview gRPC-Web generated client stub for ctkeychainvaultsrvgrpc
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as models_get_keychain_entry_response_pb from './models/get_keychain_entry_response_pb';
import * as models_set_keychain_entry_response_pb from './models/set_keychain_entry_response_pb';
import * as default_service_pb from './default_service_pb';


export class DefaultServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetKeychainEntryV1 = new grpcWeb.AbstractClientBase.MethodInfo(
    models_get_keychain_entry_response_pb.GetKeychainEntryResponse,
    (request: default_service_pb.GetKeychainEntryV1Request) => {
      return request.serializeBinary();
    },
    models_get_keychain_entry_response_pb.GetKeychainEntryResponse.deserializeBinary
  );

  getKeychainEntryV1(
    request: default_service_pb.GetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null): Promise<models_get_keychain_entry_response_pb.GetKeychainEntryResponse>;

  getKeychainEntryV1(
    request: default_service_pb.GetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: models_get_keychain_entry_response_pb.GetKeychainEntryResponse) => void): grpcWeb.ClientReadableStream<models_get_keychain_entry_response_pb.GetKeychainEntryResponse>;

  getKeychainEntryV1(
    request: default_service_pb.GetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: models_get_keychain_entry_response_pb.GetKeychainEntryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ctkeychainvaultsrvgrpc.DefaultService/GetKeychainEntryV1',
        request,
        metadata || {},
        this.methodInfoGetKeychainEntryV1,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ctkeychainvaultsrvgrpc.DefaultService/GetKeychainEntryV1',
    request,
    metadata || {},
    this.methodInfoGetKeychainEntryV1);
  }

  methodInfoSetKeychainEntryV1 = new grpcWeb.AbstractClientBase.MethodInfo(
    models_set_keychain_entry_response_pb.SetKeychainEntryResponse,
    (request: default_service_pb.SetKeychainEntryV1Request) => {
      return request.serializeBinary();
    },
    models_set_keychain_entry_response_pb.SetKeychainEntryResponse.deserializeBinary
  );

  setKeychainEntryV1(
    request: default_service_pb.SetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null): Promise<models_set_keychain_entry_response_pb.SetKeychainEntryResponse>;

  setKeychainEntryV1(
    request: default_service_pb.SetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: models_set_keychain_entry_response_pb.SetKeychainEntryResponse) => void): grpcWeb.ClientReadableStream<models_set_keychain_entry_response_pb.SetKeychainEntryResponse>;

  setKeychainEntryV1(
    request: default_service_pb.SetKeychainEntryV1Request,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: models_set_keychain_entry_response_pb.SetKeychainEntryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/ctkeychainvaultsrvgrpc.DefaultService/SetKeychainEntryV1',
        request,
        metadata || {},
        this.methodInfoSetKeychainEntryV1,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/ctkeychainvaultsrvgrpc.DefaultService/SetKeychainEntryV1',
    request,
    metadata || {},
    this.methodInfoSetKeychainEntryV1);
  }

}

