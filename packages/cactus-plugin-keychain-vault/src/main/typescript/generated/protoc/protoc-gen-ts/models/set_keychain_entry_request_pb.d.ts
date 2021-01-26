// package: ctkeychainvaultsrvgrpc
// file: models/set_keychain_entry_request.proto

import * as jspb from "google-protobuf";

export class SetKeychainEntryRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetKeychainEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetKeychainEntryRequest): SetKeychainEntryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetKeychainEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetKeychainEntryRequest;
  static deserializeBinaryFromReader(message: SetKeychainEntryRequest, reader: jspb.BinaryReader): SetKeychainEntryRequest;
}

export namespace SetKeychainEntryRequest {
  export type AsObject = {
    key: string,
    value: string,
  }
}

