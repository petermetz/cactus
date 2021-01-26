//
//Hyperledger Cactus - Keychain API
//
//Contains/describes the Keychain API types/paths for Hyperledger Cactus.
//
//The version of the OpenAPI document: 0.3.0
//
//Generated by OpenAPI Generator: https://openapi-generator.tech

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.25.0
// 	protoc        v3.12.2
// source: default_service.proto

package ctkeychainvaultsrvgrpc

import (
	proto "github.com/golang/protobuf/proto"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	_ "google.golang.org/protobuf/types/known/emptypb"
	models "models"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

// Symbols defined in public import of models/get_keychain_entry_request.proto.

type GetKeychainEntryRequest = models.GetKeychainEntryRequest

// Symbols defined in public import of models/get_keychain_entry_response.proto.

type GetKeychainEntryResponse = models.GetKeychainEntryResponse

// Symbols defined in public import of models/set_keychain_entry_request.proto.

type SetKeychainEntryRequest = models.SetKeychainEntryRequest

// Symbols defined in public import of models/set_keychain_entry_response.proto.

type SetKeychainEntryResponse = models.SetKeychainEntryResponse

type GetKeychainEntryV1Request struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Requst body to obtain a keychain entry via its key
	GetKeychainEntryRequest *models.GetKeychainEntryRequest `protobuf:"bytes,1,opt,name=getKeychainEntryRequest,proto3" json:"getKeychainEntryRequest,omitempty"`
}

func (x *GetKeychainEntryV1Request) Reset() {
	*x = GetKeychainEntryV1Request{}
	if protoimpl.UnsafeEnabled {
		mi := &file_default_service_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetKeychainEntryV1Request) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetKeychainEntryV1Request) ProtoMessage() {}

func (x *GetKeychainEntryV1Request) ProtoReflect() protoreflect.Message {
	mi := &file_default_service_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetKeychainEntryV1Request.ProtoReflect.Descriptor instead.
func (*GetKeychainEntryV1Request) Descriptor() ([]byte, []int) {
	return file_default_service_proto_rawDescGZIP(), []int{0}
}

func (x *GetKeychainEntryV1Request) GetGetKeychainEntryRequest() *models.GetKeychainEntryRequest {
	if x != nil {
		return x.GetKeychainEntryRequest
	}
	return nil
}

type SetKeychainEntryV1Request struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Requst body to write/update a keychain entry via its key
	SetKeychainEntryRequest *models.SetKeychainEntryRequest `protobuf:"bytes,1,opt,name=setKeychainEntryRequest,proto3" json:"setKeychainEntryRequest,omitempty"`
}

func (x *SetKeychainEntryV1Request) Reset() {
	*x = SetKeychainEntryV1Request{}
	if protoimpl.UnsafeEnabled {
		mi := &file_default_service_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SetKeychainEntryV1Request) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SetKeychainEntryV1Request) ProtoMessage() {}

func (x *SetKeychainEntryV1Request) ProtoReflect() protoreflect.Message {
	mi := &file_default_service_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SetKeychainEntryV1Request.ProtoReflect.Descriptor instead.
func (*SetKeychainEntryV1Request) Descriptor() ([]byte, []int) {
	return file_default_service_proto_rawDescGZIP(), []int{1}
}

func (x *SetKeychainEntryV1Request) GetSetKeychainEntryRequest() *models.SetKeychainEntryRequest {
	if x != nil {
		return x.SetKeychainEntryRequest
	}
	return nil
}

var File_default_service_proto protoreflect.FileDescriptor

var file_default_service_proto_rawDesc = []byte{
	0x0a, 0x15, 0x64, 0x65, 0x66, 0x61, 0x75, 0x6c, 0x74, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x16, 0x63, 0x74, 0x6b, 0x65, 0x79, 0x63, 0x68,
	0x61, 0x69, 0x6e, 0x76, 0x61, 0x75, 0x6c, 0x74, 0x73, 0x72, 0x76, 0x67, 0x72, 0x70, 0x63, 0x1a,
	0x1b, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66,
	0x2f, 0x65, 0x6d, 0x70, 0x74, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x27, 0x6d, 0x6f,
	0x64, 0x65, 0x6c, 0x73, 0x2f, 0x67, 0x65, 0x74, 0x5f, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69,
	0x6e, 0x5f, 0x65, 0x6e, 0x74, 0x72, 0x79, 0x5f, 0x72, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x28, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x73, 0x2f, 0x67, 0x65,
	0x74, 0x5f, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x5f, 0x65, 0x6e, 0x74, 0x72, 0x79,
	0x5f, 0x72, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a,
	0x27, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x73, 0x2f, 0x73, 0x65, 0x74, 0x5f, 0x6b, 0x65, 0x79, 0x63,
	0x68, 0x61, 0x69, 0x6e, 0x5f, 0x65, 0x6e, 0x74, 0x72, 0x79, 0x5f, 0x72, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x28, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x73,
	0x2f, 0x73, 0x65, 0x74, 0x5f, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x5f, 0x65, 0x6e,
	0x74, 0x72, 0x79, 0x5f, 0x72, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x22, 0x86, 0x01, 0x0a, 0x19, 0x47, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61,
	0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x56, 0x31, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x12, 0x69, 0x0a, 0x17, 0x67, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45,
	0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x0b, 0x32, 0x2f, 0x2e, 0x63, 0x74, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61,
	0x75, 0x6c, 0x74, 0x73, 0x72, 0x76, 0x67, 0x72, 0x70, 0x63, 0x2e, 0x47, 0x65, 0x74, 0x4b, 0x65,
	0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x52, 0x17, 0x67, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45,
	0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x86, 0x01, 0x0a, 0x19,
	0x53, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79,
	0x56, 0x31, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x69, 0x0a, 0x17, 0x73, 0x65, 0x74,
	0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x2f, 0x2e, 0x63, 0x74, 0x6b,
	0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61, 0x75, 0x6c, 0x74, 0x73, 0x72, 0x76, 0x67,
	0x72, 0x70, 0x63, 0x2e, 0x53, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45,
	0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x52, 0x17, 0x73, 0x65, 0x74,
	0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x32, 0x86, 0x02, 0x0a, 0x0e, 0x44, 0x65, 0x66, 0x61, 0x75, 0x6c, 0x74,
	0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x79, 0x0a, 0x12, 0x47, 0x65, 0x74, 0x4b, 0x65,
	0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x56, 0x31, 0x12, 0x31, 0x2e,
	0x63, 0x74, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61, 0x75, 0x6c, 0x74, 0x73,
	0x72, 0x76, 0x67, 0x72, 0x70, 0x63, 0x2e, 0x47, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61,
	0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x56, 0x31, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x30, 0x2e, 0x63, 0x74, 0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61, 0x75,
	0x6c, 0x74, 0x73, 0x72, 0x76, 0x67, 0x72, 0x70, 0x63, 0x2e, 0x47, 0x65, 0x74, 0x4b, 0x65, 0x79,
	0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x79, 0x0a, 0x12, 0x53, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69,
	0x6e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x56, 0x31, 0x12, 0x31, 0x2e, 0x63, 0x74, 0x6b, 0x65, 0x79,
	0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61, 0x75, 0x6c, 0x74, 0x73, 0x72, 0x76, 0x67, 0x72, 0x70,
	0x63, 0x2e, 0x53, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x45, 0x6e, 0x74,
	0x72, 0x79, 0x56, 0x31, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x30, 0x2e, 0x63, 0x74,
	0x6b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x76, 0x61, 0x75, 0x6c, 0x74, 0x73, 0x72, 0x76,
	0x67, 0x72, 0x70, 0x63, 0x2e, 0x53, 0x65, 0x74, 0x4b, 0x65, 0x79, 0x63, 0x68, 0x61, 0x69, 0x6e,
	0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x50, 0x01, 0x50,
	0x02, 0x50, 0x03, 0x50, 0x04, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_default_service_proto_rawDescOnce sync.Once
	file_default_service_proto_rawDescData = file_default_service_proto_rawDesc
)

func file_default_service_proto_rawDescGZIP() []byte {
	file_default_service_proto_rawDescOnce.Do(func() {
		file_default_service_proto_rawDescData = protoimpl.X.CompressGZIP(file_default_service_proto_rawDescData)
	})
	return file_default_service_proto_rawDescData
}

var file_default_service_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_default_service_proto_goTypes = []interface{}{
	(*GetKeychainEntryV1Request)(nil),       // 0: ctkeychainvaultsrvgrpc.GetKeychainEntryV1Request
	(*SetKeychainEntryV1Request)(nil),       // 1: ctkeychainvaultsrvgrpc.SetKeychainEntryV1Request
	(*models.GetKeychainEntryRequest)(nil),  // 2: ctkeychainvaultsrvgrpc.GetKeychainEntryRequest
	(*models.SetKeychainEntryRequest)(nil),  // 3: ctkeychainvaultsrvgrpc.SetKeychainEntryRequest
	(*models.GetKeychainEntryResponse)(nil), // 4: ctkeychainvaultsrvgrpc.GetKeychainEntryResponse
	(*models.SetKeychainEntryResponse)(nil), // 5: ctkeychainvaultsrvgrpc.SetKeychainEntryResponse
}
var file_default_service_proto_depIdxs = []int32{
	2, // 0: ctkeychainvaultsrvgrpc.GetKeychainEntryV1Request.getKeychainEntryRequest:type_name -> ctkeychainvaultsrvgrpc.GetKeychainEntryRequest
	3, // 1: ctkeychainvaultsrvgrpc.SetKeychainEntryV1Request.setKeychainEntryRequest:type_name -> ctkeychainvaultsrvgrpc.SetKeychainEntryRequest
	0, // 2: ctkeychainvaultsrvgrpc.DefaultService.GetKeychainEntryV1:input_type -> ctkeychainvaultsrvgrpc.GetKeychainEntryV1Request
	1, // 3: ctkeychainvaultsrvgrpc.DefaultService.SetKeychainEntryV1:input_type -> ctkeychainvaultsrvgrpc.SetKeychainEntryV1Request
	4, // 4: ctkeychainvaultsrvgrpc.DefaultService.GetKeychainEntryV1:output_type -> ctkeychainvaultsrvgrpc.GetKeychainEntryResponse
	5, // 5: ctkeychainvaultsrvgrpc.DefaultService.SetKeychainEntryV1:output_type -> ctkeychainvaultsrvgrpc.SetKeychainEntryResponse
	4, // [4:6] is the sub-list for method output_type
	2, // [2:4] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_default_service_proto_init() }
func file_default_service_proto_init() {
	if File_default_service_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_default_service_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetKeychainEntryV1Request); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_default_service_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SetKeychainEntryV1Request); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_default_service_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_default_service_proto_goTypes,
		DependencyIndexes: file_default_service_proto_depIdxs,
		MessageInfos:      file_default_service_proto_msgTypes,
	}.Build()
	File_default_service_proto = out.File
	file_default_service_proto_rawDesc = nil
	file_default_service_proto_goTypes = nil
	file_default_service_proto_depIdxs = nil
}
