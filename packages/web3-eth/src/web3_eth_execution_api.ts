import { EthExecutionAPI, TransactionInfo } from 'web3-common';
import { Address, BlockNumberOrTag, HexString32Bytes, Uint } from 'web3-utils';

export interface StorageProof {
	readonly key: HexString32Bytes;
	readonly value: Uint;
	readonly proof: HexString32Bytes[];
}

export interface AccountObject {
	readonly balance: Uint;
	readonly codeHash: HexString32Bytes;
	readonly nonce: Uint;
	readonly storageHash: HexString32Bytes;
	readonly accountProof: HexString32Bytes[];
	readonly storageProof: StorageProof[];
}

export type Web3EthExecutionAPI = EthExecutionAPI & {
	eth_pendingTransactions: () => TransactionInfo[];

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md
	eth_requestAccounts: () => Address[];

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md
	eth_chainId: () => Uint;

	web3_clientVersion: () => string;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md
	eth_getProof: (
		address: Address,
		storageKey: HexString32Bytes,
		blockNumber: BlockNumberOrTag,
	) => AccountObject;
};
