// To avoid package dependency we have to copy these types

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiParameter = {
	readonly name: string;
	readonly type: string;
	readonly components?: ReadonlyArray<AbiParameter | string>;
};
