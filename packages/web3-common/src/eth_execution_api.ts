// The types are generated manually by referring to following doc
// https://github.com/ethereum/execution-apis

type HexString = string;

// Hex encoded 32 bytes
type HexString32Bytes = HexString;
// Hex encoded 1 byte
type HexStringSingleByte = HexString;
// Hex encoded 1 byte
type HexStringBytes = HexString;
// Hex encoded 256 byte
type HexString256Bytes = HexString;
// Hex encoded unsigned integer
type Uint = HexString;
// Hex encoded unsigned integer 32 bytes
type Uint256 = HexString;
// Hex encoded address
type Address = HexString;

export interface AccessListEntry {
	readonly [k: string]: unknown;
	readonly address?: Address;
	readonly storageKeys?: HexString32Bytes[];
}
export type AccessList = AccessListEntry[];
export type TransactionHash = HexString;
export type Uncles = HexString32Bytes[];
export type BlockTag = 'earliest' | 'latest' | 'pending';
export type BlockNumberOrTag = Uint | BlockTag;

export interface BaseTransaction {
	readonly to?: Address;
	readonly type: HexStringSingleByte;
	readonly nonce: Uint;
	readonly gas: Uint;
	readonly value: Uint;
	readonly input: HexStringBytes;
	readonly chainId: Uint;
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
	readonly blockHash: HexString32Bytes;
	readonly blockNumber: Uint;
	readonly from: Address;
	readonly hash: HexString32Bytes;
	readonly transactionIndex: Uint;
};

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.json#L24
export type TransactionWithSender = TransactionUnsigned & { from: Address };

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/block.json#L2
export interface Block {
	readonly [k: string]: unknown;
	readonly parentHash: HexString32Bytes;
	readonly sha3Uncles: HexString32Bytes;
	readonly miner: HexString;
	readonly stateRoot: HexString32Bytes;
	readonly transactionsRoot: HexString32Bytes;
	readonly receiptsRoot: HexString32Bytes;
	readonly logsBloom: HexString256Bytes;
	readonly difficulty?: HexStringBytes;
	readonly number: Uint;
	readonly gasLimit: Uint;
	readonly gasUsed: Uint;
	readonly timestamp: Uint;
	readonly extraData: HexStringBytes;
	readonly mixHash: HexString32Bytes;
	readonly nonce: HexStringBytes;
	readonly totalDifficulty: Uint;
	readonly baseFeePerGas?: Uint;
	readonly size: Uint;
	readonly transactions: TransactionHash[] | TransactionSigned[];
	readonly uncles: Uncles;
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L59
export type Topic = HexString256Bytes;

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/receipt.json#L2
export interface Log {
	readonly removed?: boolean;
	readonly logIndex?: Uint;
	readonly transactionIndex?: Uint;
	readonly transactionHash?: HexString32Bytes;
	readonly blockHash?: HexString32Bytes;
	readonly blockNumber?: Uint;
	readonly address?: Address;
	readonly data?: HexStringBytes;
	readonly topics?: Topic[];
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/receipt.json#L44
export interface ReceiptInfo {
	readonly transactionHash: HexString32Bytes;
	readonly transactionIndex: HexString32Bytes;
	readonly blockHash?: HexString32Bytes;
	readonly blockNumber?: Uint;
	readonly from?: Address;
	readonly to?: Address;
	readonly cumulativeGasUsed?: Uint;
	readonly gasUsed?: Uint;
	readonly contractAddress?: Address;
	readonly logs?: Log[];
	readonly logsBloom?: HexString256Bytes;
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

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L28
export interface Filter {
	readonly fromBlock?: Uint;
	readonly toBlock?: Uint;
	readonly address?: Address | Address[];
	readonly topics?: Topic[];
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L2
export type FilterResults = HexString32Bytes[] | Log[];

/* eslint-disable camelcase */
export type EthExecutionAPI = {
	// https://github.com/ethereum/execution-apis/blob/main/src/eth/block.json
	eth_getBlockByHash: (blockHash: HexString32Bytes, hydrated: boolean) => Block;
	eth_getBlockByNumber: (blockNumber: Uint, hydrated: boolean) => Block;
	eth_getBlockTransactionCountByHash: (blockHash: HexString32Bytes) => Uint[];
	eth_getBlockTransactionCountByNumber: (blockNumber: Uint) => Uint[];
	eth_getUncleCountByBlockHash: (blockHash: HexString32Bytes) => Uint[];
	eth_getUncleCountByBlockNumber: (blockNumber: Uint) => Uint[];

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/transaction.json
	eth_getTransactionByHash: (transactionHash: HexString32Bytes) => TransactionInfo;
	eth_getTransactionByBlockHashAndIndex: (
		blockHash: HexString32Bytes,
		transactionIndex: Uint,
	) => TransactionInfo;
	eth_getTransactionByBlockNumberAndIndex: (
		blockNumber: Uint,
		transactionIndex: Uint,
	) => TransactionInfo;
	eth_getTransactionReceipt: (transactionHash: HexString32Bytes) => ReceiptInfo;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/client.json
	eth_protocolVersion: () => string;
	eth_syncing: () => SyncingStatus;
	eth_coinbase: () => Address;
	eth_accounts: () => Address[];
	eth_blockNumber: () => Uint;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.json
	eth_call: (transaction: TransactionWithSender) => HexStringBytes;
	eth_estimateGas: (transaction: TransactionWithSender) => Uint;

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
		powHash: HexString32Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) => boolean;
	eth_submitHashrate: (hashRate: HexString32Bytes, id: HexString32Bytes) => boolean;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/sign.json
	eth_sign: (address: Address, message: HexStringBytes) => HexString256Bytes;
	eth_signTransaction: (transaction: TransactionWithSender) => HexStringBytes;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/state.json
	eth_getBalance: (address: Address, block: BlockNumberOrTag) => Uint;
	eth_getStorage: (
		address: Address,
		storageSlot: Uint256,
		block: BlockNumberOrTag,
	) => HexStringBytes;
	eth_getTransactionCount: (address: Address, block: BlockNumberOrTag) => Uint;
	eth_getCode: (address: Address, block: BlockNumberOrTag) => HexStringBytes;

	// https://github.com/ethereum/execution-apis/blob/main/src/eth/submit.json
	eth_sendTransaction: (transaction: TransactionWithSender) => HexString32Bytes;
	eth_sendRawTransaction: (transaction: HexStringBytes) => HexString32Bytes;

	// https://geth.ethereum.org/docs/rpc/pubsub
	eth_subscribe: (
		...params:
			| ['newHeads']
			| ['newPendingTransactions']
			| ['syncing']
			| ['logs', { address: HexString; topic: HexString[] }]
	) => HexString;
	eth_unsubscribe: (subscriptionId: HexString) => HexString;
};
