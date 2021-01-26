// package: ctkeychainvaultsrvgrpc
// file: models/set_keychain_entry_response.proto

import * as jspb from "google-protobuf";

export class SetKeychainEntryResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetKeychainEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetKeychainEntryResponse): SetKeychainEntryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetKeychainEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetKeychainEntryResponse;
  static deserializeBinaryFromReader(message: SetKeychainEntryResponse, reader: jspb.BinaryReader): SetKeychainEntryResponse;
}

export namespace SetKeychainEntryResponse {
  export type AsObject = {
    key: string,
  }
}

