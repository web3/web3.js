/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Address, Bytes, FixedSizeArray, Numbers } from 'web3-utils';
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
	// type will default to string if passed ABI is declared without "as const"
	readonly type: string | FragmentTypes;
};

// To assign an ABI which is not declared `as const` need to specify a generic string

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiConstructorFragment = AbiBaseFragment & {
	readonly type: string | 'constructor';
	readonly stateMutability: string | 'nonpayable' | 'payable';
	readonly inputs: ReadonlyArray<AbiParameter>;
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiFunctionFragment = AbiBaseFragment & {
	readonly name: string;
	readonly type: string | 'function';
	readonly stateMutability: string | 'nonpayable' | 'payable' | 'pure' | 'view';
	readonly inputs: ReadonlyArray<AbiParameter>;
	readonly outputs: ReadonlyArray<AbiParameter>;

	readonly constant?: boolean; // stateMutability == 'pure' or stateMutability == 'view'
	readonly payable?: boolean; // stateMutability == 'payable'
};

export type AbiFallbackFragment = AbiBaseFragment & {
	readonly name?: never;
	readonly type: string | 'fallback';
	readonly stateMutability: string | 'nonpayable' | 'payable' | 'pure' | 'view';
	readonly inputs?: never;
	readonly outputs?: never;

	// legacy properties
	readonly constant?: boolean; // stateMutability == 'pure' or stateMutability == 'view'
	readonly payable?: boolean; // stateMutability == 'payable'
};

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiEventFragment = AbiBaseFragment & {
	readonly name: string;
	readonly type: string | 'event';
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

export type ContractMethodOutputParameters<Params extends Array<unknown>> = Params extends []
	? []
	: Params extends [infer H, ...infer R]
	? H extends AbiParameter
		? // TODO: Find a way to set name for tuple item
		  [MatchPrimitiveType<H['type'], H['components']>, ...ContractMethodOutputParameters<R>]
		: ContractMethodOutputParameters<R>
	: Params;

export type ContractMethodInputParameters<Params extends Array<unknown>> = Params extends []
	? []
	: Params extends [infer H, ...infer R]
	? H extends AbiParameter
		? // TODO: Find a way to set name for tuple item
		  [MatchPrimitiveType<H['type'], H['components']>, ...ContractMethodInputParameters<R>]
		: ContractMethodInputParameters<R>
	: Params;

export type ContractConstructor<Abis extends ContractAbi> = {
	[Abi in FilterAbis<Abis, AbiConstructorFragment> as 'constructor']: {
		readonly Abi: Abi;
		readonly Inputs: ContractMethodInputParameters<[...Abi['inputs']]>;
	};
}['constructor'];

export type ContractMethod<Abi extends AbiFunctionFragment> = {
	readonly Abi: Abi;
	readonly Inputs: ContractMethodInputParameters<[...Abi['inputs']]>;
	readonly Outputs: ContractMethodOutputParameters<[...Abi['outputs']]>;
};

export type ContractMethods<Abis extends ContractAbi> = {
	[Abi in FilterAbis<
		Abis,
		AbiFunctionFragment & { type: 'function' }
	> as Abi['name']]: ContractMethod<Abi>;
};

export type ContractEvent<Abi extends AbiEventFragment> = {
	readonly Abi: Abi;
	readonly Inputs: ContractMethodInputParameters<[...Abi['inputs']]>;
};

export type ContractEvents<Abis extends ContractAbi> = {
	[Abi in FilterAbis<
		Abis,
		AbiEventFragment & { type: 'event' }
	> as Abi['name']]: ContractEvent<Abi>;
};
