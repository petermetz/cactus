import * as jspb from 'google-protobuf';



export class GetKeychainEntryRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): GetKeychainEntryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKeychainEntryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetKeychainEntryRequest): GetKeychainEntryRequest.AsObject;
  static serializeBinaryToWriter(message: GetKeychainEntryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKeychainEntryRequest;
  static deserializeBinaryFromReader(message: GetKeychainEntryRequest, reader: jspb.BinaryReader): GetKeychainEntryRequest;
}

export namespace GetKeychainEntryRequest {
  export type AsObject = {
    key: string,
  }
}

