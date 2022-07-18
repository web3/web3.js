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
import { HexString, Numbers } from './primitives_types';

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
	readonly gas?: bigint | number;
	readonly gasLimit?: string;
	readonly nonce: bigint | number;
	readonly value: bigint | number;
	readonly blockNumber?: bigint | number;
	readonly transactionIndex?: bigint | number;
} & (
	| { maxPriorityFeePerGas: bigint | number; maxFeePerGas: bigint | number; gasPrice?: never }
	| { maxPriorityFeePerGas?: never; maxFeePerGas?: never; gasPrice: bigint | number }
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
	readonly logIndex?: bigint | number;
	readonly transactionIndex?: bigint | number;
	readonly transactionHash?: HexString32Bytes;
	readonly blockHash?: HexString32Bytes;
	readonly blockNumber?: bigint | number;
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
	readonly startingBlock: bigint | number;
	readonly currentBlock: bigint | number;
	readonly highestBlock: bigint | number;
	readonly knownStates?: bigint | number;
	readonly pulledStates?: bigint | number;
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
