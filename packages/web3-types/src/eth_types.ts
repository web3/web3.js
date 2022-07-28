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
import { Bytes, HexString, Numbers } from './primitives_types';

export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';
// Hex encoded 32 bytes
export type HexString32Bytes = HexString;
// Hex encoded 16 bytes
export type HexString16Bytes = HexString;
// Hex encoded 8 bytes
export type HexString8Bytes = HexString;
// Hex encoded 1 byte
export type HexStringSingleByte = HexString;
// Hex encoded 1 byte
export type HexStringBytes = HexString;
// Hex encoded 256 byte
export type HexString256Bytes = HexString;
// Hex encoded unsigned integer
export type Uint = HexString;
// Hex encoded unsigned integer 32 bytes
export type Uint256 = HexString;
// Hex encoded address
export type Address = HexString;

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L59
export type Topic = HexString32Bytes;

export type TransactionHash = HexString;
export type Uncles = HexString32Bytes[];
export enum BlockTags {
	EARLIEST = 'earliest',
	LATEST = 'latest',
	PENDING = 'pending',
}
export type BlockTag = 'earliest' | 'latest' | 'pending';
export type BlockNumberOrTag = Numbers | BlockTag;

export interface Proof {
	readonly address: HexString;
	readonly nonce: string;
	readonly balance: string;
}

export interface TransactionInput {
	readonly [key: string]: unknown;
	readonly to?: HexString; // If its a contract creation tx then no address wil be specified.
	readonly from?: HexString;
	readonly data?: string;
	readonly input?: string;
	readonly gas: HexString;
	readonly gasLimit?: string;
	readonly gasPrice?: string;
	readonly maxPriorityFeePerGas?: string;
	readonly maxFeePerGas?: string;
	readonly nonce: string;
	readonly value: string;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly type?: HexString;
	readonly chainId?: HexString;
}

export type TransactionOutput = {
	readonly [key: string]: unknown;
	readonly to?: HexString; // If its a contract creation tx then no address wil be specified.
	readonly from?: HexString;
	readonly data: string;
	readonly gas?: Numbers;
	readonly gasLimit?: string;
	readonly nonce: Numbers;
	readonly value: Numbers;
	readonly blockNumber?: Numbers;
	readonly transactionIndex?: Numbers;
} & (
	| { maxPriorityFeePerGas: Numbers; maxFeePerGas: Numbers; gasPrice?: never }
	| { maxPriorityFeePerGas?: never; maxFeePerGas?: never; gasPrice: Numbers }
);

export interface LogsInput {
	readonly blockHash?: HexString;
	readonly transactionHash?: HexString;
	readonly logIndex?: HexString;
	readonly id?: string;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly address: HexString;
	readonly topics: HexString[];
	readonly data: HexString;
}
export interface LogsOutput {
	readonly id?: string;
	readonly removed: boolean;
	readonly logIndex?: Numbers;
	readonly transactionIndex?: Numbers;
	readonly transactionHash?: HexString32Bytes;
	readonly blockHash?: HexString32Bytes;
	readonly blockNumber?: Numbers;
	readonly address: string;
	readonly topics: HexString[];
	readonly data: HexString;
}

export interface BlockInput {
	readonly gasLimit: HexString;
	readonly gasUsed: HexString;
	readonly size: HexString;
	readonly timestamp: HexString;
	readonly number?: HexString;
	readonly difficulty?: HexString;
	readonly totalDifficulty?: HexString;
	readonly transactions?: TransactionInput[];
	readonly miner?: HexString;
	readonly baseFeePerGas?: HexString;
}

export interface BlockOutput {
	readonly gasLimit: bigint | number;
	readonly gasUsed: bigint | number;
	readonly size: bigint | number;
	readonly timestamp: bigint | number;
	readonly number?: bigint | number;
	readonly difficulty?: bigint | number;
	readonly totalDifficulty?: bigint | number;
	readonly transactions?: TransactionOutput[];
	readonly miner?: HexString;
	readonly baseFeePerGas?: bigint | number;
	readonly parentHash?: HexString32Bytes;
}

export interface BlockHeaderOutput {
	readonly gasLimit: Numbers;
	readonly gasUsed: Numbers;
	readonly timestamp: Numbers;
	readonly number?: Numbers;
	readonly difficulty?: Numbers;
	readonly totalDifficulty?: Numbers;
	readonly transactions?: TransactionOutput[];
	readonly miner?: HexString;
	readonly baseFeePerGas?: Numbers;
	readonly parentHash?: HexString32Bytes;
	readonly sha3Uncles: HexString32Bytes[];
}

export interface ReceiptInput {
	readonly [x: string]: unknown;
	readonly blockNumber?: HexString;
	readonly transactionIndex?: HexString;
	readonly cumulativeGasUsed: HexString;
	readonly gasUsed: HexString;
	readonly logs?: LogsInput[];
	readonly contractAddress?: HexString;
	readonly status?: string;
	readonly effectiveGasPrice?: HexString;
}

export interface ReceiptOutput {
	readonly blockNumber?: bigint | number;
	readonly transactionIndex?: bigint | number;
	readonly cumulativeGasUsed: bigint | number;
	readonly gasUsed: bigint | number;
	readonly logs?: LogsOutput[];
	readonly contractAddress?: HexString;
	readonly status: boolean;
	readonly effectiveGasPrice?: bigint | number;
}

export interface PostInput {
	readonly ttl?: HexString;
	readonly workToProve?: HexString;
	readonly priority?: HexString;
	readonly expiry?: HexString;
	readonly sent?: HexString;
	readonly workProved?: HexString;
	readonly topics?: HexString[];
}

export interface PostOutput {
	readonly ttl?: bigint | number;
	readonly workToProve?: bigint | number;
	readonly priority?: bigint | number;
	readonly expiry?: bigint | number;
	readonly sent?: bigint | number;
	readonly workProved?: bigint | number;
	readonly topics?: string[];
}

export interface SyncInput {
	readonly startingBlock: HexString;
	readonly currentBlock: HexString;
	readonly highestBlock: HexString;
	readonly knownStates?: HexString;
	readonly pulledStates?: HexString;
}

export interface SyncOutput {
	readonly startingBlock: Numbers;
	readonly currentBlock: Numbers;
	readonly highestBlock: Numbers;
	readonly knownStates?: Numbers;
	readonly pulledStates?: Numbers;
}

export type Receipt = Record<string, unknown>;

export type Components = {
	name: string;
	type: string;
	indexed?: boolean;
	components?: Components[];
};

export type AbiInput = {
	name: string;
	type: string;
	components?: Components;
	index?: boolean;
	internalType?: string;
};

// https://docs.soliditylang.org/en/develop/abi-spec.html#json
export type JsonFunctionInterface = {
	type: 'function';
	name: string;
	inputs: Components[];
	outputs?: AbiInput[];
	stateMutability?: string;
};

export type JsonEventInterface = {
	type: 'event';
	name: string;
	inputs: Components[];
	indexed: boolean;
	anonymous: boolean;
};

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/filter.json#L28
export interface Filter {
	readonly fromBlock?: BlockNumberOrTag;
	readonly toBlock?: BlockNumberOrTag;
	readonly address?: Address | Address[];

	// Using "null" type intentionally to match specifications
	// eslint-disable-next-line @typescript-eslint/ban-types
	readonly topics?: (null | Topic | Topic[])[];
}

// https://docs.soliditylang.org/en/latest/abi-spec.html#json
export type AbiParameter = {
	readonly name: string;
	readonly type: string;
	readonly components?: ReadonlyArray<AbiParameter | string>;
};

export interface AccessListEntry {
	readonly address?: Address;
	readonly storageKeys?: HexString32Bytes[];
}
export type AccessList = AccessListEntry[];

export type ValidChains = 'goerli' | 'kovan' | 'mainnet' | 'rinkeby' | 'ropsten' | 'sepolia';

export type Hardfork =
	| 'arrowGlacier'
	| 'berlin'
	| 'byzantium'
	| 'chainstart'
	| 'constantinople'
	| 'dao'
	| 'homestead'
	| 'istanbul'
	| 'london'
	| 'merge'
	| 'muirGlacier'
	| 'petersburg'
	| 'shanghai'
	| 'spuriousDragon'
	| 'tangerineWhistle';

export interface Log {
	readonly removed?: boolean;
	readonly logIndex?: Numbers;
	readonly transactionIndex?: Numbers;
	readonly transactionHash?: Bytes;
	readonly blockHash?: Bytes;
	readonly blockNumber?: Numbers;
	readonly address?: Address;
	readonly data?: Bytes;
	readonly topics?: Bytes[];
	readonly id?: string;
}

export interface TransactionReceipt {
	readonly transactionHash: Bytes;
	readonly transactionIndex: Numbers;
	readonly blockHash: Bytes;
	readonly blockNumber: Numbers;
	readonly from: Address;
	readonly to: Address;
	readonly cumulativeGasUsed: Numbers;
	readonly gasUsed: Numbers;
	readonly effectiveGasPrice?: Numbers;
	readonly contractAddress?: Address;
	readonly logs: Log[];
	readonly logsBloom: Bytes;
	readonly root: Bytes;
	readonly status: Numbers;
	readonly type?: Numbers;
}

export interface CustomChain {
	name?: string;
	networkId: Numbers;
	chainId: Numbers;
}

export interface Common {
	customChain: CustomChain;
	baseChain?: ValidChains;
	hardfork?: Hardfork;
}

interface TransactionBase {
	value?: Numbers;
	accessList?: AccessList;
	common?: Common;
	// eslint-disable-next-line @typescript-eslint/ban-types
	to?: Address | null;
	gas?: Numbers;
	gasPrice?: Numbers;
	type?: Numbers;
	maxFeePerGas?: Numbers;
	maxPriorityFeePerGas?: Numbers;
	data?: Bytes;
	input?: Bytes;
	nonce?: Numbers;
	chain?: ValidChains;
	hardfork?: Hardfork;
	chainId?: Numbers;
	networkId?: Numbers;
	gasLimit?: Numbers;
	yParity?: Uint;
	v?: Numbers;
	r?: Bytes;
	s?: Bytes;
}

export interface Transaction extends TransactionBase {
	from?: Address;
}

export interface TransactionCall extends Transaction {
	to: Address;
}

export interface TransactionWithLocalWalletIndex extends TransactionBase {
	from?: Numbers;
}

export interface TransactionInfo extends Transaction {
	readonly blockHash?: Bytes;
	readonly blockNumber?: Numbers;
	readonly from: Address;
	readonly hash: Bytes;
	readonly transactionIndex?: Numbers;
}

export interface PopulatedUnsignedBaseTransaction {
	from: Address;
	to?: Address;
	value: Numbers;
	gas?: Numbers;
	gasPrice: Numbers;
	type: Numbers;
	data: Bytes;
	nonce: Numbers;
	networkId: Numbers;
	chain: ValidChains;
	hardfork: Hardfork;
	chainId: Numbers;
	common: Common;
	gasLimit: Numbers;
}

export interface PopulatedUnsignedEip2930Transaction extends PopulatedUnsignedBaseTransaction {
	accessList: AccessList;
}

export interface PopulatedUnsignedEip1559Transaction extends PopulatedUnsignedEip2930Transaction {
	gasPrice: never;
	maxFeePerGas: Numbers;
	maxPriorityFeePerGas: Numbers;
}
export type PopulatedUnsignedTransaction =
	| PopulatedUnsignedBaseTransaction
	| PopulatedUnsignedEip2930Transaction
	| PopulatedUnsignedEip1559Transaction;

export interface Block {
	readonly parentHash: Bytes;
	readonly sha3Uncles: Bytes;
	readonly miner: Bytes;
	readonly stateRoot: Bytes;
	readonly transactionsRoot: Bytes;
	readonly receiptsRoot: Bytes;
	readonly logsBloom?: Bytes;
	readonly difficulty?: Numbers;
	readonly number: Numbers;
	readonly gasLimit: Numbers;
	readonly gasUsed: Numbers;
	readonly timestamp: Numbers;
	readonly extraData: Bytes;
	readonly mixHash: Bytes;
	readonly nonce: Numbers;
	readonly totalDifficulty: Numbers;
	readonly baseFeePerGas?: Numbers;
	readonly size: Numbers;
	readonly transactions: TransactionHash[] | TransactionInfo[];
	readonly uncles: Uncles;
	readonly hash?: Bytes;
}

export interface FeeHistory {
	readonly oldestBlock: Numbers;
	readonly baseFeePerGas: Numbers;
	readonly reward: Numbers[][];
	readonly gasUsedRatio: Numbers;
}

export interface StorageProof {
	readonly key: Bytes;
	readonly value: Numbers;
	readonly proof: Bytes[];
}

export interface AccountObject {
	readonly balance: Numbers;
	readonly codeHash: Bytes;
	readonly nonce: Numbers;
	readonly storageHash: Bytes;
	readonly accountProof: Bytes[];
	readonly storageProof: StorageProof[];
}
