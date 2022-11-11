---
sidebar_position: 6
sidebar_label: web3.eth.abi
---

# web3.eth.abi Migration Guide

## Breaking Changes

-   `AbiInput` has moved from `web3-eth-utils` to `web3-eth-abi`

-   type `AbiInput` attribute was renamed to `baseType` from `internalType`.

In 1.x:

```
export interface AbiInput {
    name: string;
    type: string;
    indexed?: boolean;
	components?: AbiInput[];
    internalType?: string;
}
```

In 4.x:

```

export type AbiInput = string | AbiParameter | { readonly [key: string]: unknown };
// where AbiParameter is ...

export type AbiParameter = {
	readonly name: string;
	readonly type: string;
	readonly baseType?: string;
	readonly indexed?: boolean;
	readonly components?: ReadonlyArray<AbiParameter>;
	readonly arrayLength?: number;
	readonly arrayChildren?: ReadonlyArray<AbiParameter>;
};

```
