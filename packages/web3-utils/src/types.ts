import { HexString, Numbers } from 'web3-common';

export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';

export type HexString16Bytes = HexString;

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
