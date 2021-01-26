import * as jspb from 'google-protobuf';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as models_get_keychain_entry_request_pb from './models/get_keychain_entry_request_pb';
import * as models_get_keychain_entry_response_pb from './models/get_keychain_entry_response_pb';
import * as models_set_keychain_entry_request_pb from './models/set_keychain_entry_request_pb';
import * as models_set_keychain_entry_response_pb from './models/set_keychain_entry_response_pb';


export class GetKeychainEntryV1Request extends jspb.Message {
  getGetkeychainentryrequest(): models_get_keychain_entry_request_pb.GetKeychainEntryRequest | undefined;
  setGetkeychainentryrequest(value?: models_get_keychain_entry_request_pb.GetKeychainEntryRequest): GetKeychainEntryV1Request;
  hasGetkeychainentryrequest(): boolean;
  clearGetkeychainentryrequest(): GetKeychainEntryV1Request;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKeychainEntryV1Request.AsObject;
  static toObject(includeInstance: boolean, msg: GetKeychainEntryV1Request): GetKeychainEntryV1Request.AsObject;
  static serializeBinaryToWriter(message: GetKeychainEntryV1Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKeychainEntryV1Request;
  static deserializeBinaryFromReader(message: GetKeychainEntryV1Request, reader: jspb.BinaryReader): GetKeychainEntryV1Request;
}

export namespace GetKeychainEntryV1Request {
  export type AsObject = {
    getkeychainentryrequest?: models_get_keychain_entry_request_pb.GetKeychainEntryRequest.AsObject,
  }
}

export class SetKeychainEntryV1Request extends jspb.Message {
  getSetkeychainentryrequest(): models_set_keychain_entry_request_pb.SetKeychainEntryRequest | undefined;
  setSetkeychainentryrequest(value?: models_set_keychain_entry_request_pb.SetKeychainEntryRequest): SetKeychainEntryV1Request;
  hasSetkeychainentryrequest(): boolean;
  clearSetkeychainentryrequest(): SetKeychainEntryV1Request;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetKeychainEntryV1Request.AsObject;
  static toObject(includeInstance: boolean, msg: SetKeychainEntryV1Request): SetKeychainEntryV1Request.AsObject;
  static serializeBinaryToWriter(message: SetKeychainEntryV1Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetKeychainEntryV1Request;
  static deserializeBinaryFromReader(message: SetKeychainEntryV1Request, reader: jspb.BinaryReader): SetKeychainEntryV1Request;
}

export namespace SetKeychainEntryV1Request {
  export type AsObject = {
    setkeychainentryrequest?: models_set_keychain_entry_request_pb.SetKeychainEntryRequest.AsObject,
  }
}

