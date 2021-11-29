import { AbiParameterBaseType, Reader } from "../../types";

const readerWriterMap: {
	[K in AbiParameterBaseType]: {
		reader: Reader<AbiTypeToNativeType<K>>;
		writer: Writer<AbiTypeToNativeType<K>>;
	};
} = {
	bool: { reader: baseTypes.readBoolean, writer: baseTypes.writeBoolean },
	string: { reader: baseTypes.readString, writer: baseTypes.writeString },
	address: { reader: baseTypes.readBytes, writer: baseTypes.writeBytes },
	uint: { reader: baseTypes.readUint, writer: baseTypes.writeUint },
	int: { reader: baseTypes.readInt, writer: baseTypes.writeInt },
	bytes: { reader: baseTypes.readBytes, writer: baseTypes.writeBytes },
	array: { reader: baseTypes.readArray, writer: baseTypes.writeArray },
	tuple: { reader: baseTypes.readBoolean, writer: baseTypes.writeBoolean },
};
