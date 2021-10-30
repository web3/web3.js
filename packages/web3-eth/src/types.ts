// TODO Move to web3-common
export type HexString = string;
export type NumberString = string;
export type ValidTypes = HexString | number | NumberString | bigint;

interface EthSyncingIsSyncing<ReturnType = HexString> {
	startingBlock: ReturnType;
	currentBlock: ReturnType;
	highestBlock: ReturnType;
}
type EthSyncingNotSyncing = boolean;
export type EthSyncingResponse<ReturnType = HexString> =
	| EthSyncingIsSyncing<ReturnType>
	| EthSyncingNotSyncing;

// TODO Revisit
export interface Transaction {
	[key: string]: unknown;
	to?: HexString; // If its a contract creation tx then no address wil be specified.
	from?: HexString;
	data?: string;
	gas?: ValidTypes;
	gasLimit?: ValidTypes;
	gasPrice?: ValidTypes;
	maxPriorityFeePerGas?: ValidTypes;
	maxFeePerGas?: ValidTypes;
	nonce?: ValidTypes;
	value?: ValidTypes;
	type?: ValidTypes;
}

// TODO Revisit
export interface Block<ReturnType = HexString> {
    number: ValidTypes | null;
    hash: HexString | null;
    parentHash: HexString;
    nonce: ValidTypes | null;
    sha3Uncles: HexString;
    logsBloom: HexString | null;
    transactionsRoot: HexString;
    stateRoot: HexString;
    receiptsRoot: HexString;
    miner: HexString;
    difficulty: ValidTypes;
    totalDifficulty: ValidTypes;
    extraData: HexString;
    size: ValidTypes;
    gasLimit: ValidTypes;
    gasUsed: ValidTypes;
    baseFeePerGas?: ValidTypes;
    timestamp: ValidTypes;
    transactions: Transaction[];
    uncles: HexString[];
}
