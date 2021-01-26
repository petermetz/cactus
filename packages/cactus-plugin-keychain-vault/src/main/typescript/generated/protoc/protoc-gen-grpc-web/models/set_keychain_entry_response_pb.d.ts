import * as jspb from 'google-protobuf';



export class SetKeychainEntryResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): SetKeychainEntryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetKeychainEntryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetKeychainEntryResponse): SetKeychainEntryResponse.AsObject;
  static serializeBinaryToWriter(message: SetKeychainEntryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetKeychainEntryResponse;
  static deserializeBinaryFromReader(message: SetKeychainEntryResponse, reader: jspb.BinaryReader): SetKeychainEntryResponse;
}

export namespace SetKeychainEntryResponse {
  export type AsObject = {
    key: string,
  }
}

