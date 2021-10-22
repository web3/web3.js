export type HexString = string;
export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';
export type Address = string;
export type Bytes = Buffer | Uint8Array | ArrayBuffer | HexString;
export type Numbers = number | bigint | string | HexString;
export type EncodingTypes = Numbers | boolean | Numbers[] | boolean[];
export type typedObject = {
	type: string;
	value: EncodingTypes;
};
export type typedObject2 = {
	t: string;
	v: EncodingTypes;
};
