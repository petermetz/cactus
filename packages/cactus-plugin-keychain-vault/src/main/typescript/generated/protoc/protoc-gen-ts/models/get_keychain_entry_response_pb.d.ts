// package: ctkeychainvaultsrvgrpc
// file: models/get_keychain_entry_response.proto

import * as jspb from "google-protobuf";

export class GetKeychainEntryResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKeychainEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetKeychainEntryResponse): GetKeychainEntryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetKeychainEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKeychainEntryResponse;
  static deserializeBinaryFromReader(message: GetKeychainEntryResponse, reader: jspb.BinaryReader): GetKeychainEntryResponse;
}

export namespace GetKeychainEntryResponse {
  export type AsObject = {
    key: string,
    value: string,
  }
}

