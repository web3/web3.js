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

import {
	Address,
	BlockNumberOrTag,
	HexString,
	HexString256Bytes,
	HexString8Bytes,
	HexString32Bytes,
	HexStringBytes,
	HexStringSingleByte,
	Uint,
	Uint256,
	Topic,
	Filter,
} from 'web3-utils';

// The types are generated manually by referring to following doc
// https://github.com/ethereum/execution-apis

export interface AccessListEntry {
	readonly address?: Address;
	readonly storageKeys?: HexString32Bytes[];
}
export type AccessList = AccessListEntry[];
export type TransactionHash = HexString;
export type Uncles = HexString32Bytes[];

export interface TransactionCall {
	readonly from?: Address;
	readonly to: Address;
	readonly gas?: Uint;
	readonly gasPrice?: Uint;
	readonly value?: Uint;
	readonly data?: HexStringBytes;
	readonly type?: HexStringSingleByte;
	readonly maxFeePerGas?: Uint;
	readonly maxPriorityFeePerGas?: Uint;
	readonly accessList?: AccessList;
}

export interface BaseTransaction {
	readonly to?: Address | null;
	readonly type: HexStringSingleByte;
	readonly nonce: Uint;
	readonly gas: Uint;
	readonly value: Uint;
	// TODO - https://github.com/ethereum/execution-apis/pull/201
	readonly input: HexStringBytes;
	readonly data?: HexStringBytes;
	readonly chainId?: Uint;
}

export interface Transaction1559Unsigned extends BaseTransaction {
	readonly maxFeePerGas: Uint;
	readonly maxPriorityFeePerGas: Uint;
	readonly accessList: AccessList;
}

export interface Transaction1559Signed extends Transaction1559Unsigned {
	readonly yParity: Uint;
	readonly r: Uint;
	readonly s: Uint;
}

export interface Transaction2930Unsigned extends BaseTransaction {
	readonly gasPrice: Uint;
	readonly accessList: AccessList;
}

export interface Transaction2930Signed extends Transaction2930Unsigned {
	readonly yParity: Uint;
	readonly r: Uint;
	readonly s: Uint;
}

export interface TransactionLegacyUnsigned extends BaseTransaction {
	readonly gasPrice: Uint;
}

export interface TransactionLegacySigned extends TransactionLegacyUnsigned {
	readonly v: Uint;
	readonly r: Uint;
	readonly s: Uint;
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.json#L178
export type TransactionUnsigned =
	| Transaction1559Unsigned
	| Transaction2930Unsigned
	| TransactionLegacyUnsigned;

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.json#L262
export type TransactionSigned =
	| Transaction1559Signed
	| Transaction2930Signed
	| TransactionLegacySigned;

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.json#L269
export type TransactionInfo = TransactionSigned & {
	readonly blockHash: HexString32Bytes | null;
	readonly blockNumber: Uint | null;
	readonly from: Address;
	readonly hash: HexString32Bytes;
	readonly transactionIndex: Uint | null;
};

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.json#L24
export type TransactionWithSender = TransactionUnsigned & { from: Address };

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/block.json#L2
export interface Block {
	readonly parentHash: HexString32Bytes;
	readonly sha3Uncles: HexString32Bytes;
	readonly miner: HexString;
	readonly stateRoot: HexString32Bytes;
	readonly transactionsRoot: HexString32Bytes;
	readonly receiptsRoot: HexString32Bytes;
	readonly logsBloom: HexString256Bytes | null;
	readonly difficulty?: Uint;
	readonly number: Uint | null;
	readonly gasLimit: Uint;
	readonly gasUsed: Uint;
	readonly timestamp: Uint;
	readonly extraData: HexStringBytes;
	readonly mixHash: HexString32Bytes;
	readonly nonce: Uint | null;
	readonly totalDifficulty: Uint;
	readonly baseFeePerGas?: Uint;
	readonly size: Uint;
	readonly transactions: TransactionHash[] | TransactionInfo[];
	readonly uncles: Uncles;
	readonly hash: HexString32Bytes | null;
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/receipt.json#L2
export interface Log {
	readonly removed?: boolean;
	readonly logIndex?: Uint | null;
	readonly transactionIndex?: Uint | null;
	readonly transactionHash?: HexString32Bytes | null;
	readonly blockHash?: HexString32Bytes | null;
	readonly blockNumber?: Uint | null;
	readonly address?: Address;
	readonly data?: HexStringBytes;
	readonly topics?: null | Topic | Topic[];
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/receipt.json#L44
export interface ReceiptInfo {
	readonly transactionHash: HexString32Bytes;
	readonly transactionIndex: Uint;
	readonly blockHash: HexString32Bytes;
	readonly blockNumber: Uint;
	readonly from: Address;
	readonly to: Address;
	readonly cumulativeGasUsed: Uint;
	readonly gasUsed: Uint;
	readonly contractAddress: Address | null;
	readonly logs: Log[];
	readonly logsBloom: HexString256Bytes;
	readonly root: HexString32Bytes;
	readonly status: '0x1' | '0x0';
	readonly effectiveGasPrice: Uint;
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/client.json#L2
export type SyncingStatus =
	| { startingBlock: Uint; currentBlock: Uint; highestBlock: Uint }
	| boolean;

// https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.json#L53
export interface FeeHistoryResult {
	readonly oldestBlock: Uint;
	readonly baseFeePerGas: Uint;
	readonly reward: number[][];
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L2
export type FilterResults = HexString32Bytes[] | Log[];

export interface CompileResult {
	readonly code: HexStringBytes;
	readonly info: {
		readonly source: string;
		readonly language: string;
		readonly languageVersion: string;
		readonly compilerVersion: string;
		readonly abiDefinition: Record<string, unknown>[];
		readonly userDoc: {
			readonly methods: Record<string, unknown>;
		};
		readonly developerDoc: {
			readonly methods: Record<string, unknown>;
		};
	};
}

/* eslint-disable camelcase */
export type EthExecutionAPI = {
	// https://github.com/ethereum/execution-apis/blob/main/src/eth/block.json
	eth_getBlockByHash: (blockHash: HexString32Bytes, hydrated: boolean) => Block;
	eth_getBlockByNumber: (blockNumber: BlockNumberOrTag, hydrated: boolean) => Block;
	eth_getBlockTransactionCountByHash: (blockHash: HexString32Bytes) => Uint;
	eth_getBlockTransactionCountByNumber: (blockNumber: BlockNumberOrTag) => Uint;
	eth_getUncleCountByBlockHash: (blockHash: HexString32Bytes) => Uint;
	eth_getUncleCountByBlockNumber: (blockNumber: BlockNumberOrTag) => Uint;
	eth_getUncleByBlockHashAndIndex: (blockHash: HexString32Bytes, uncleIndex: Uint) => Block;
	eth_getUncleByBlockNumberAndIndex: (blockNumber: BlockNumberOrTag, uncleIndex: Uint) => Block;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/transaction.json
	eth_getTransactionByHash: (transactionHash: HexString32Bytes) => TransactionInfo | null;
	eth_getTransactionByBlockHashAndIndex: (
		blockHash: HexString32Bytes,
		transactionIndex: Uint,
	) => TransactionInfo | null;
	eth_getTransactionByBlockNumberAndIndex: (
		blockNumber: BlockNumberOrTag,
		transactionIndex: Uint,
	) => TransactionInfo | null;
	eth_getTransactionReceipt: (transactionHash: HexString32Bytes) => ReceiptInfo | null;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/client.json
	eth_protocolVersion: () => string;
	eth_syncing: () => SyncingStatus;
	eth_coinbase: () => Address;
	eth_accounts: () => Address[];
	eth_blockNumber: () => Uint;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.json
	eth_call: (transaction: TransactionCall, blockNumber: BlockNumberOrTag) => HexStringBytes;
	eth_estimateGas: (
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag,
	) => Uint;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.json
	eth_gasPrice: () => Uint;
	eth_feeHistory: (
		blockCount: Uint,
		newestBlock: BlockNumberOrTag,
		rewardPercentiles: number[],
	) => FeeHistoryResult;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/filter.json
	eth_newFilter: (filter: Filter) => Uint;
	eth_newBlockFilter: () => Uint;
	eth_newPendingTransactionFilter: () => Uint;
	eth_uninstallFilter: (filterIdentifier: Uint) => boolean;
	eth_getFilterChanges: (filterIdentifier: Uint) => FilterResults;
	eth_getFilterLogs: (filterIdentifier: Uint) => FilterResults;
	eth_getLogs: (filter: Filter) => FilterResults;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/mining.json
	eth_mining: () => boolean;
	eth_hashrate: () => Uint;
	eth_getWork: () => [HexString32Bytes, HexString32Bytes, HexString32Bytes];
	eth_submitWork: (
		nonce: HexString8Bytes,
		hash: HexString32Bytes,
		digest: HexString32Bytes,
	) => boolean;
	eth_submitHashrate: (hashRate: HexString32Bytes, id: HexString32Bytes) => boolean;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/sign.json
	eth_sign: (address: Address, message: HexStringBytes) => HexString256Bytes;
	eth_signTransaction: (
		transaction: TransactionWithSender | Partial<TransactionWithSender>,
	) => HexStringBytes;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/state.json
	eth_getBalance: (address: Address, blockNumber: BlockNumberOrTag) => Uint;
	eth_getStorageAt: (
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag,
	) => HexStringBytes;
	eth_getTransactionCount: (address: Address, blockNumber: BlockNumberOrTag) => Uint;
	eth_getCode: (address: Address, blockNumber: BlockNumberOrTag) => HexStringBytes;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/submit.json
	eth_sendTransaction: (
		transaction: TransactionWithSender | Partial<TransactionWithSender>,
	) => HexString32Bytes;
	eth_sendRawTransaction: (transaction: HexStringBytes) => HexString32Bytes;

	// https://geth.ethereum.org/docs/rpc/pubsub
	eth_subscribe: (
		...params:
			| ['newHeads']
			| ['newPendingTransactions']
			| ['syncing']
			| ['logs', { address?: HexString; topics?: HexString[] }]
	) => HexString;
	eth_unsubscribe: (subscriptionId: HexString) => HexString;
	eth_clearSubscriptions: (keepSyncing?: boolean) => void;
	// Non-supported by execution-apis specs
	eth_getCompilers: () => string[];
	eth_compileSolidity: (code: string) => CompileResult;
	eth_compileLLL: (code: string) => HexStringBytes;
	eth_compileSerpent: (code: string) => HexStringBytes;
};
