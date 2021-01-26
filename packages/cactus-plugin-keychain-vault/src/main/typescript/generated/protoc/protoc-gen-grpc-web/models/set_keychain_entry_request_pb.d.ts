import * as jspb from 'google-protobuf';



export class SetKeychainEntryRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): SetKeychainEntryRequest;

  getValue(): string;
  setValue(value: string): SetKeychainEntryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetKeychainEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetKeychainEntryRequest): SetKeychainEntryRequest.AsObject;
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

