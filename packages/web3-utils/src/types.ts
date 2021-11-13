export type HexString = string;
export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';
export type Address = string;
export type Bytes = Buffer | Uint8Array | ArrayBuffer | HexString;
export type Numbers = number | bigint | string | HexString;
export type EncodingTypes = Numbers | boolean | Numbers[] | boolean[];
export type TypedObject = {
	type: string;
	value: EncodingTypes;
};
export type TypedObjectAbbreviated = {
	t: string;
	v: EncodingTypes;
};

export type Components = {
	name: string;
	type: string;
	indexed?: boolean;
	components?: Components[];
};

export type AbiInput = {
	name: string;
	type: string;
	components?: Components;
	index?: boolean;
	internalType?: string;
};

// https://docs.soliditylang.org/en/develop/abi-spec.html#json
export type JsonFunctionInterface = {
	type: 'function';
	name: string;
	inputs: Components[];
	outputs?: AbiInput[];
	stateMutability?: string;
};

export type JsonEventInterface = {
	type: 'event';
	name: string;
	inputs: Components[];
	indexed: boolean;
	anonymous: boolean;
};

// need to create Json Contract interface constructor, receive, and fallback
