import {
	Address,
	Bytes,
	Numbers,
	ObjectValueToTuple,
	ArrayToIndexObject,
	FixedSizeArray,
} from 'web3-utils';
import { ConvertToNumber } from './number_map_type';

export interface AbiStruct {
	[key: string]: unknown;
	name?: string;
	type: string;
}

export interface AbiCoderStruct extends AbiStruct {
	[key: string]: unknown;
	components?: Array<AbiStruct>;
}

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiParameter = {
	readonly name: string;
	readonly type: string;
	readonly baseType?: string;
	readonly indexed?: boolean;
	readonly components?: ReadonlyArray<AbiParameter>;
	readonly arrayLength?: number;
	readonly arrayChildren?: ReadonlyArray<AbiParameter>;
};

type FragmentTypes = 'constructor' | 'event' | 'function' | 'fallback';

export type AbiBaseFragment = {
	readonly type: FragmentTypes;
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiConstructorFragment = AbiBaseFragment & {
	readonly type: 'constructor';
	readonly stateMutability: 'nonpayable' | 'payable';
	readonly inputs: ReadonlyArray<AbiParameter>;
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiFunctionFragment = AbiBaseFragment & {
	readonly name: string;
	readonly type: 'function';
	readonly stateMutability: 'nonpayable' | 'payable' | 'pure' | 'view';
	readonly inputs: ReadonlyArray<AbiParameter>;
	readonly outputs: ReadonlyArray<AbiParameter>;

	readonly constant?: boolean; // stateMutability == 'pure' or stateMutability == 'view'
	readonly payable?: boolean; // stateMutability == 'payable'
};

export type AbiFallbackFragment = AbiBaseFragment & {
	readonly name?: never;
	readonly type: 'fallback';
	readonly stateMutability: 'nonpayable' | 'payable' | 'pure' | 'view';
	readonly inputs?: never;
	readonly outputs?: never;

	// legacy properties
	readonly constant?: boolean; // stateMutability == 'pure' or stateMutability == 'view'
	readonly payable?: boolean; // stateMutability == 'payable'
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiEventFragment = AbiBaseFragment & {
	readonly name: string;
	readonly type: 'event';
	readonly inputs: ReadonlyArray<AbiParameter>;
	readonly anonymous?: boolean;
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiFragment =
	| AbiConstructorFragment
	| AbiFunctionFragment
	| AbiEventFragment
	| AbiFallbackFragment;

export type ContractAbi = ReadonlyArray<AbiFragment>;

export type AbiInput = string | AbiParameter | { readonly [key: string]: unknown };

export type FilterAbis<Abis extends ContractAbi, Filter, Abi = Abis[number]> = Abi extends Filter
	? Abi
	: never;

type _TypedArray<Type, Size extends string> = Size extends ''
	? Type[]
	: FixedSizeArray<Type, ConvertToNumber<Size>>;

export type PrimitiveAddressType<Type extends string> = Type extends `address[${infer Size}]`
	? _TypedArray<Address, Size>
	: Type extends 'address'
	? Address
	: never;

export type PrimitiveStringType<Type extends string> = Type extends `string${string}[${infer Size}]`
	? _TypedArray<string, Size>
	: Type extends 'string' | `string${string}`
	? string
	: never;

export type PrimitiveBooleanType<Type extends string> = Type extends `bool[${infer Size}]`
	? _TypedArray<boolean, Size>
	: Type extends 'bool'
	? boolean
	: never;

export type PrimitiveIntegerType<Type extends string> = Type extends
	| `uint${string}[${infer Size}]`
	| `int${string}[${infer Size}]`
	? _TypedArray<Numbers, Size>
	: Type extends 'uint' | 'int' | `int${string}` | `uint${string}`
	? Numbers
	: never;

export type PrimitiveBytesType<Type extends string> = Type extends `bytes${string}[${infer Size}]`
	? _TypedArray<Bytes, Size>
	: Type extends 'bytes' | `bytes${string}`
	? Bytes
	: never;

export type PrimitiveTupleType<
	Type extends string,
	Components extends ReadonlyArray<AbiParameter> | undefined = [],
> = Components extends ReadonlyArray<AbiParameter>
	? Type extends 'tuple'
		? {
				// eslint-disable-next-line no-use-before-define
				[Param in Components[number] as Param['name']]: MatchPrimitiveType<
					Param['type'],
					Param['components']
				>;
		  }
		: Type extends `tuple[${infer Size}]`
		? _TypedArray<
				{
					// eslint-disable-next-line no-use-before-define
					[Param in Components[number] as Param['name']]: MatchPrimitiveType<
						Param['type'],
						Param['components']
					>;
				},
				Size
		  >
		: never
	: never;

export type MatchPrimitiveType<
	Type extends string,
	Components extends ReadonlyArray<AbiParameter> | undefined,
> =
	| PrimitiveAddressType<Type>
	| PrimitiveStringType<Type>
	| PrimitiveBooleanType<Type>
	| PrimitiveIntegerType<Type>
	| PrimitiveBytesType<Type>
	| PrimitiveTupleType<Type, Components>
	| never;

// Only intended to use locally so why not exported
// TODO: Inspect Record<string, AbiParameter> not working constraint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _ExtractParameterType<T extends Record<string, any>> = {
	[K in keyof T]: MatchPrimitiveType<T[K]['type'], T[K]['components']>;
};

export type ContractMethodOutputParameters<Params extends ReadonlyArray<AbiParameter>> =
	ObjectValueToTuple<_ExtractParameterType<ArrayToIndexObject<Params>>>;

export type ContractMethodInputParameters<Params extends ReadonlyArray<AbiParameter>> =
	Params extends readonly []
		? never
		: {
				[Param in Params[number] as Param['name']]: MatchPrimitiveType<
					Param['type'],
					Param['components']
				>;
		  };

export type ContractConstructor<Abis extends ContractAbi> = {
	[Abi in FilterAbis<Abis, AbiConstructorFragment> as 'constructor']: {
		readonly Abi: Abi;
		readonly Inputs: ContractMethodInputParameters<Abi['inputs']>;
	};
}['constructor'];

export type ContractMethods<Abis extends ContractAbi> = {
	[Abi in FilterAbis<Abis, AbiFunctionFragment> as Abi['name']]: {
		readonly Abi: Abi;
		readonly Inputs: ContractMethodInputParameters<Abi['inputs']>;
		readonly Outputs: ContractMethodOutputParameters<Abi['outputs']>;
	};
};

export type ContractEvents<Abis extends ContractAbi> = {
	[Abi in FilterAbis<Abis, AbiEventFragment> as Abi['name']]: {
		readonly Abi: Abi;
		readonly Inputs: ContractMethodInputParameters<Abi['inputs']>;
	};
};
