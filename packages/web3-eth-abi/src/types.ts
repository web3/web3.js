export interface AbiStruct {
	[key: string]: unknown;
	name?: string;
	type: string;
}

export interface AbiCoderStruct extends AbiStruct {
	[key: string]: unknown;
	components?: Array<AbiStruct>;
}

export type AbiParameterBaseType =
	| 'address'
	| 'uint'
	| 'int'
	| 'bool'
	| 'bytes'
	| 'string'
	| 'array'
	| 'tuple';

export type AbiParameter = {
	readonly name: string;
	readonly type: string;
	readonly internalType?: string | null;
	readonly indexed?: boolean;
	readonly components?: ReadonlyArray<AbiParameter>;
	readonly arrayLength?: number;
	readonly arrayChildren?: ReadonlyArray<AbiParameter>;
};

type AbiFragmentTypes = 'constructor' | 'event' | 'function';

export type AbiBaseFragment = {
	readonly name?: string;
	readonly type: AbiFragmentTypes;
	readonly inputs?: ReadonlyArray<AbiParameter>;
};

export type AbiConstructorFragment = AbiBaseFragment & {
	readonly type: 'constructor';
	readonly gas?: string;
	readonly payable: boolean;
	readonly stateMutability: 'nonpayable' | 'payable';
};

export type AbiFunctionFragment = AbiBaseFragment & {
	readonly type: 'function';
	readonly constant?: boolean;
	readonly stateMutability?: 'nonpayable' | 'payable' | 'pure' | 'view';
	readonly outputs?: ReadonlyArray<AbiParameter>;
};

export type AbiEventFragment = AbiBaseFragment & {
	readonly type: 'event';
	readonly anonymous?: boolean;
	readonly outputs?: ReadonlyArray<AbiParameter>;
};

export type AbiFragment = AbiConstructorFragment | AbiFunctionFragment | AbiEventFragment;
export type Abi = ReadonlyArray<AbiFragment>;
export type AbiInput = string | AbiParameter | { readonly [key: string]: unknown };

export type ReaderOptions = {
	wordSize: number;
	// eslint-disable-next-line no-use-before-define
	param: CompiledParameter;
};

export type WriterOptions = {
	wordSize: number;
	// eslint-disable-next-line no-use-before-define
	param: CompiledParameter;
};

export type Reader<ValueType> = (
	bytes: Buffer,
	offset: number,
	options: ReaderOptions,
) => { value: ValueType; offset: number };

export type Writer<ValueType> = (
	value: ValueType,
	options: WriterOptions,
) => { head: Buffer; tail: Buffer; refreshHead: boolean };

export type CompiledParameter<T = unknown> = {
	name: string | null;
	type: string;
	internalType: string;
	baseType: AbiParameterBaseType;
	arrayLength: number | null;
	path: string;
	components: ReadonlyArray<CompiledParameter>;
	read: Reader<T>;
	write: Writer<T>;
};

export type AbiTypeToNativeType<T extends AbiParameterBaseType> = T extends 'bool' ? boolean : any;
