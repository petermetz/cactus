import * as jspb from 'google-protobuf';



export class GetKeychainEntryResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): GetKeychainEntryResponse;

  getValue(): string;
  setValue(value: string): GetKeychainEntryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKeychainEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetKeychainEntryResponse): GetKeychainEntryResponse.AsObject;
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

