export interface JsonAbiParameter {
	readonly name: string;
	readonly type: string;
	readonly baseType: string;
	readonly indexed: boolean;
	readonly components: Array<JsonAbiParameter>;
	readonly arrayLength: number;
	readonly arrayChildren: Array<JsonAbiParameter>;
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

export interface JsonAbiBaseFragment {
	[key: string]: unknown;
	name?: string;
	type: 'constructor' | 'event' | 'function';
	inputs?: Array<JsonAbiParameter>;
}

export interface JsonAbiConstructorFragment extends JsonAbiBaseFragment {
	type: 'constructor';
	gas?: string;
	payable: boolean;
	stateMutability: 'nonpayable' | 'payable';
}

export interface JsonAbiFunctionFragment extends JsonAbiBaseFragment {
	type: 'function';
	constant: boolean;
	stateMutability: 'nonpayable' | 'payable' | 'pure' | 'view';
}

export interface JsonAbiEventFragment extends JsonAbiBaseFragment {
	type: 'event';
	anonymous: boolean;
	outputs?: Array<JsonAbiParameter>;
}

export type JsonAbiFragment =
	| JsonAbiBaseFragment
	| JsonAbiConstructorFragment
	| JsonAbiFunctionFragment
	| JsonAbiEventFragment;
