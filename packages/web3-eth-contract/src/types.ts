import { Uint, Address, Bytes } from 'web3-utils';
import { SupportedProviders } from 'web3-core';
import { EthExecutionAPI } from 'web3-common';
import { JsonAbiFragment } from 'web3-eth-abi';

export interface ContractOptions {
	readonly gas: Uint | null;
	readonly gasPrice: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	jsonInterface: JsonAbiFragment[];
	address?: Address | null;
}

export interface ContractInitOptions {
	readonly gas: Uint | null;
	readonly gasPrice: Uint | null;
	readonly from?: Address;
	readonly data?: Bytes;
	readonly gasLimit: Uint;
	readonly provider: SupportedProviders<EthExecutionAPI> | string;
}
