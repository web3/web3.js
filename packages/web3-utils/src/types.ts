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
export type TypedObject2 = {
	t: string;
	v: EncodingTypes;
};

export type AbiInput = {
	name: string,
	type: string,
	components?: AbiInput[],
	index?: boolean

}

export type jsonInterface = {
	name: string,
	type: string,
	inputs: AbiInput[],
	outputs: AbiInput[],
}