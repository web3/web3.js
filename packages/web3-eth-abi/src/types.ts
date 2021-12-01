// TODO: Adding reference of source definition/doc for these types
export interface JsonAbiParameter {
	readonly name: string;
	readonly type: string;
	readonly baseType?: string;
	readonly indexed?: boolean;
	readonly components?: Array<JsonAbiParameter>;
	readonly arrayLength?: number;
	readonly arrayChildren?: Array<JsonAbiParameter>;
}

export interface JsonAbiStruct {
	[key: string]: unknown;
	name?: string;
	type: string;
}

export interface JsonAbiCoderStruct extends JsonAbiStruct {
	[key: string]: unknown;
	components?: Array<JsonAbiStruct>;
}

type FragmentTypes = 'constructor' | 'event' | 'function';

export interface JsonAbiBaseFragment {
	name?: string;
	type: FragmentTypes;
	inputs?: Array<JsonAbiParameter>;
}

export interface JsonAbiConstructorFragment extends JsonAbiBaseFragment {
	type: 'constructor';
	payable: boolean;
	stateMutability: 'nonpayable' | 'payable';
}

export interface JsonAbiFunctionFragment extends JsonAbiBaseFragment {
	type: 'function';
	constant?: boolean;
	stateMutability?: 'nonpayable' | 'payable' | 'pure' | 'view';
	outputs?: Array<JsonAbiParameter>;
}

export interface JsonAbiEventFragment extends JsonAbiBaseFragment {
	type: 'event';
	anonymous?: boolean;
}

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type JsonAbiFragment =
	| JsonAbiBaseFragment
	| JsonAbiConstructorFragment
	| JsonAbiFunctionFragment
	| JsonAbiEventFragment;

export type AbiInput = string | JsonAbiParameter | { readonly [key: string]: unknown };
