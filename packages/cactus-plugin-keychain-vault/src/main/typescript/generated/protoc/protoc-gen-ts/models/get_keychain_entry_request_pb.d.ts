// package: ctkeychainvaultsrvgrpc
// file: models/get_keychain_entry_request.proto

import * as jspb from "google-protobuf";

export class GetKeychainEntryRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKeychainEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetKeychainEntryRequest): GetKeychainEntryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetKeychainEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKeychainEntryRequest;
  static deserializeBinaryFromReader(message: GetKeychainEntryRequest, reader: jspb.BinaryReader): GetKeychainEntryRequest;
}

export namespace GetKeychainEntryRequest {
  export type AsObject = {
    key: string,
  }
}

