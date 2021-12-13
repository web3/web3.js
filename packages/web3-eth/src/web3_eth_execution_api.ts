import { EthExecutionAPI, TransactionInfo } from 'web3-common';
import { Address, BlockNumberOrTag, HexString, HexString32Bytes, Uint } from 'web3-utils';

export interface Proof {
	readonly address: Address;
	readonly balance: Uint;
	readonly codeHash: HexString;
	readonly nonce: Uint;
	readonly storageHash: HexString32Bytes;
	readonly accountProof: HexString32Bytes[];
	readonly storageProof: {
		readonly key: HexString32Bytes;
		readonly value: Uint;
		readonly proof: HexString32Bytes[];
	}[];
}

/* eslint-disable camelcase */
export type Web3EthExecutionApi = EthExecutionAPI & {
	eth_pendingTransactions: () => TransactionInfo[];
	eth_requestAccounts: () => Address[];
	eth_chainId: () => Uint;
	web3_clientVersion: () => string;
	eth_getProof: (
		address: Address,
		storageKeys: HexString32Bytes[],
		blockNumber: BlockNumberOrTag,
	) => Proof;
};
