export type HexString = string;
export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';
export type Bytes = Buffer | Uint8Array | ArrayBuffer | HexString;
export type Numbers = number | bigint | string | HexString;
// Hex encoded 32 bytes
export type HexString32Bytes = HexString;
// Hex encoded 16 bytes
export type HexString16Bytes = HexString;
// Hex encoded 8 bytes
export type HexString8Bytes = HexString;
// Hex encoded 1 byte
export type HexStringSingleByte = HexString;
// Hex encoded 1 byte
export type HexStringBytes = HexString;
// Hex encoded 256 byte
export type HexString256Bytes = HexString;
// Hex encoded unsigned integer
export type Uint = HexString;
// Hex encoded unsigned integer 32 bytes
export type Uint256 = HexString;
// Hex encoded address
export type Address = HexString;

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L59
export type Topic = HexString32Bytes;

export enum BlockTags {
	EARLIEST = 'earliest',
	LATEST = 'latest',
	PENDING = 'pending',
}
export type BlockTag = 'earliest' | 'latest' | 'pending';
export type BlockNumberOrTag = Uint | BlockTag;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type EncodingTypes = Numbers | boolean | Numbers[] | boolean[];
export type TypedObject = {
	type: string;
	value: EncodingTypes;
};
export type TypedObjectAbbreviated = {
	t: string;
	v: EncodingTypes;
};

export type IndexKeysForArray<A extends readonly unknown[]> = Exclude<keyof A, keyof []>;

export type ArrayToIndexObject<T extends ReadonlyArray<unknown>> = {
	[K in IndexKeysForArray<T>]: T[K];
};

type _Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (...a: infer X) => void
	? X
	: never;

export type GrowToSize<T, A extends Array<T>, N extends number> = {
	0: A;
	1: GrowToSize<T, _Grow<T, A>, N>;
}[A['length'] extends N ? 0 : 1];

export type FixedSizeArray<T, N extends number> = GrowToSize<T, [], N>;

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

// TODO need to create Json Contract interface constructor, receive, and fallback

export enum ValidTypes {
	HexString = 'HexString',
	NumberString = 'NumberString',
	Number = 'Number',
	BigInt = 'BigInt',
}

export type ValidReturnTypes = {
	[ValidTypes.HexString]: string;
	[ValidTypes.NumberString]: string;
	[ValidTypes.Number]: number;
	[ValidTypes.BigInt]: bigint;
};

export type FormatValidReturnType<
	ObjectType,
	Properties extends (keyof ObjectType)[],
	ReturnType extends ValidTypes,
> = {
	[P in keyof ObjectType]: P extends Properties[number]
		? ValidReturnTypes[ReturnType]
		: ObjectType[P];
};

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L28
export interface Filter {
	readonly fromBlock?: BlockNumberOrTag;
	readonly toBlock?: BlockNumberOrTag;
	readonly address?: Address | Address[];
	readonly topics?: (Topic | Topic[] | null)[];
}
