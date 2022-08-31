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

// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */
import {
	EthExecutionAPI,
	TransactionInfo,
	TransactionWithSenderAPI,
	SignedTransactionInfoAPI,
	Web3BaseWalletAccount,
	Address,
	BlockTag,
	BlockNumberOrTag,
	Bytes,
	Filter,
	HexString,
	Numbers,
	HexStringBytes,
	AccountObject,
	Block,
	FeeHistory,
	Log,
	TransactionReceipt,
	Transaction,
	TransactionCall,
	TransactionWithLocalWalletIndex,
} from 'web3-types';
import { Web3Context, Web3PromiEvent } from 'web3-core';
import {
	ETH_DATA_FORMAT,
	FormatType,
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	format,
	waitWithTimeout,
} from 'web3-utils';
import { isBlockTag, isBytes, isNullish, isString } from 'web3-validator';
import { TransactionError, TransactionRevertError } from 'web3-errors';
import { SignatureError, TransactionSendTimeoutError } from './errors';
import * as rpcMethods from './rpc_methods';
import {
	accountSchema,
	blockSchema,
	feeHistorySchema,
	logSchema,
	transactionReceiptSchema,
	transactionInfoSchema,
} from './schemas';
import {
	SendSignedTransactionEvents,
	SendSignedTransactionOptions,
	SendTransactionEvents,
	SendTransactionOptions,
} from './types';
// eslint-disable-next-line import/no-cycle
import { getTransactionFromAttr } from './utils/transaction_builder';
import { formatTransaction } from './utils/format_transaction';
// eslint-disable-next-line import/no-cycle
import { getTransactionGasPricing } from './utils/get_transaction_gas_pricing';
// eslint-disable-next-line import/no-cycle
import { waitForTransactionReceipt } from './utils/wait_for_transaction_receipt';
import { watchTransactionForConfirmations } from './utils/watch_transaction_for_confirmations';
import { Web3EthExecutionAPI } from './web3_eth_execution_api';
import { NUMBER_DATA_FORMAT } from './constants';
import { decodeSignedTransaction } from './utils/decode_signed_transaction';

/**
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @returns Returns the ethereum protocol version of the node.
 *
 * ```ts
 * web3.eth.getProtocolVersion().then(console.log);
 * > "63"
 * ```
 */
export const getProtocolVersion = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getProtocolVersion(web3Context.requestManager);

// TODO Add returnFormat parameter
/**
 * Checks if the node is currently syncing.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @returns Either a {@link SyncingStatusAPI}, or `false`.
 *
 * ```ts
 * web3.eth.isSyncing().then(console.log);
 * > {
 *     startingBlock: 100,
 *     currentBlock: 312,
 *     highestBlock: 512,
 *     knownStates: 234566,
 *     pulledStates: 123455
 * }
 * ```
 */
export const isSyncing = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getSyncing(web3Context.requestManager);

// TODO consider adding returnFormat parameter (to format address as bytes)
/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @returns Returns the coinbase address to which mining rewards will go.
 *
 * ```ts
 * web3.eth.getCoinbase().then(console.log);
 * > "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
 * ```
 */
export const getCoinbase = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getCoinbase(web3Context.requestManager);

/**
 * Checks whether the node is mining or not.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @returns `true` if the node is mining, otherwise `false`.
 *
 * ```ts
 * web3.eth.isMining().then(console.log);
 * > true
 * ```
 */
export const isMining = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getMining(web3Context.requestManager);

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The number of hashes per second that the node is mining with.
 *
 * ```ts
 * web3.eth.getHashrate().then(console.log);
 * > 493736n
 *
 * web3.eth.getHashrate({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
 * > "0x788a8"
 * ```
 */
export async function getHashRate<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getHashRate(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The gas price determined by the last few blocks median gas price.
 *
 * ```ts
 * web3.eth.getGasPrice().then(console.log);
 * > 20000000000n
 *
 * web3.eth.getGasPrice({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
 * > "0x4a817c800"
 * ```
 */
export async function getGasPrice<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getGasPrice(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The current block number.
 *
 * ```ts
 * web3.eth.getBlockNumber().then(console.log);
 * > 2744n
 *
 * web3.eth.getBlockNumber({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
 * > "0xab8"
 * ```
 */
export async function getBlockNumber<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getBlockNumber(web3Context.requestManager);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * Get the balance of an address at a given block.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param address The address to get the balance of.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the balance query.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The current balance for the given address in `wei`.
 *
 * ```ts
 * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
 * > 1000000000000n
 *
 * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1", { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
 * > "0xe8d4a51000"
 * ```
 */
export async function getBalance<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getBalance(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * Get the storage at a specific position of an address.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param address The address to get the storage from.
 * @param storageSlot The index position of the storage.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the storage query.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The value in storage at the given position.
 *
 * ```ts
 * web3.eth.getStorageAt("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234", 0).then(console.log);
 * > "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
 *
 * web3.eth.getStorageAt(
 *      "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234",
 *      0,
 *      undefined,
 *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.BUFFER }
 * ).then(console.log);
 * > <Buffer 03 34 56 73 21 23 ff ff 23 42 34 2d d1 23 42 43 43 24 23 42 34 fd 23 4f d2 3f d4 f2 3d 42 34>
 * ```
 */
export async function getStorageAt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	storageSlot: Numbers,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageSlotFormatted = format({ eth: 'uint' }, storageSlot, ETH_DATA_FORMAT);
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getStorageAt(
		web3Context.requestManager,
		address,
		storageSlotFormatted,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

/**
 * Get the code at a specific address.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param address The address to get the code from.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the code query.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The [data](https://ethereum.org/en/developers/docs/transactions/#the-data-field) at the provided `address`.
 *
 * ```ts
 * web3.eth.getCode("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234").then(console.log);
 * > "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
 *
 * web3.eth.getCode(
 *      "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234",
 *      undefined,
 *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.BUFFER }
 * ).then(console.log);
 * > <Buffer 30 78 36 30 30 31 36 30 30 30 38 30 33 35 38 31 31 61 38 31 38 31 38 31 31 34 36 30 31 32 35 37 38 33 30 31 30 30 35 62 36 30 31 62 36 30 30 31 33 35 ... >
 * ```
 */
export async function getCode<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getCode(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

/**
 * Retrieves a {@link Block} matching the provided block number, block hash or block tag.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
 * @param hydrated If specified `true`, the returned block will contain all transactions as objects. If `false` it will only contain transaction hashes.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted (does not format transaction objects or hashes).
 * @returns A {@link Block} object matching the provided block number or block hash.
 *
 * ```ts
 * web3.eth.getBlock(0).then(console.log);
 * > {
 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
 *    miner: '0x0000000000000000000000000000000000000000',
 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *    difficulty: 1n,
 *    number: 0n,
 *    gasLimit: 30000000n,
 *    gasUsed: 0n,
 *    timestamp: 1658281638n,
 *    extraData: '0x',
 *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    nonce: 0n,
 *    totalDifficulty: 1n,
 *    baseFeePerGas: 1000000000n,
 *    size: 514n,
 *    transactions: [],
 *    uncles: []
 *  }
 *
 * web3.eth.getBlock(
 *      "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
 *      false,
 *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > {
 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
 *    miner: '0x0000000000000000000000000000000000000000',
 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *    difficulty: 1,
 *    number: 0,
 *    gasLimit: 30000000,
 *    gasUsed: 0,
 *    timestamp: 1658281638,
 *    extraData: '0x',
 *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    nonce: 0,
 *    totalDifficulty: 1,
 *    baseFeePerGas: 1000000000,
 *    size: 514,
 *    transactions: [],
 *    uncles: []
 *  }
 * ```
 */
export async function getBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	hydrated = false,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			hydrated,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
			hydrated,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The number of transactions in the provided block.
 *
 * ```ts
 * web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
 * > 1n
 *
 * web3.eth.getBlockTransactionCount(
 *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > 1
 * ```
 */
export async function getBlockTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getBlockTransactionCountByNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The number of [uncles](https://ethereum.org/en/glossary/#ommer) in the provided block.
 *
 * ```ts
 * web3.eth.getBlockUncleCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
 * > 1n
 *
 * web3.eth.getBlockUncleCount(
 *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > 1
 * ```
 */
export async function getBlockUncleCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleCountByBlockHash(
			web3Context.requestManager,
			blockHashFormatted as HexString,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleCountByBlockNumber(
			web3Context.requestManager,
			blockNumberFormatted,
		);
	}

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
 * @param uncleIndex The index position of the uncle.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns A blocks [uncle](https://ethereum.org/en/glossary/#ommer) by a given uncle index position.
 *
 * ```ts
 * web3.eth.getUncle(0, 1).then(console.log);
 * > {
 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
 *    miner: '0x0000000000000000000000000000000000000000',
 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *    difficulty: 1n,
 *    number: 0n,
 *    gasLimit: 30000000n,
 *    gasUsed: 0n,
 *    timestamp: 1658281638n,
 *    extraData: '0x',
 *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    nonce: 0n,
 *    totalDifficulty: 1n,
 *    baseFeePerGas: 1000000000n,
 *    size: 514n,
 *    transactions: [],
 *    uncles: []
 *  }
 *
 * web3.eth.getUncle(
 *      "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
 *      1,
 *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > {
 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
 *    miner: '0x0000000000000000000000000000000000000000',
 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *    difficulty: 1,
 *    number: 0,
 *    gasLimit: 30000000,
 *    gasUsed: 0,
 *    timestamp: 1658281638,
 *    extraData: '0x',
 *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *    nonce: 0,
 *    totalDifficulty: 1,
 *    baseFeePerGas: 1000000000,
 *    size: 514,
 *    transactions: [],
 *    uncles: []
 *  }
 * ```
 */
export async function getUncle<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	uncleIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const uncleIndexFormatted = format({ eth: 'uint' }, uncleIndex, ETH_DATA_FORMAT);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			uncleIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getUncleByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			uncleIndexFormatted,
		);
	}

	return format(blockSchema, response as unknown as Block, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transactionHash The hash of the desired transaction.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The desired transaction object.
 *
 * ```ts
 * web3.eth.getTransaction('0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc').then(console.log);
 * {
 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *    type: 0n,
 *    nonce: 0n,
 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
 *    blockNumber: 1n,
 *    transactionIndex: 0n,
 *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *    value: 1n,
 *    gas: 90000n,
 *    gasPrice: 2000000000n,
 *    input: '0x',
 *    v: 2709n,
 *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *  }
 *
 * web3.eth.getTransaction(
 *     <Buffer 30 78 37 33 61 65 61 37 30 65 39 36 39 39 34 31 66 32 33 66 39 64 32 34 31 30 33 65 39 31 61 61 31 66 35 35 63 37 39 36 34 65 62 31 33 64 61 66 31 63 ... >,
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * {
 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *    type: 0,
 *    nonce: 0,
 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
 *    blockNumber: 1,
 *    transactionIndex: 0,
 *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *    value: 1,
 *    gas: 90000,
 *    gasPrice: 2000000000,
 *    input: '0x',
 *    v: 2709,
 *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *  }
 * ```
 */
export async function getTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	const transactionHashFormatted = format(
		{ eth: 'bytes32' },
		transactionHash,
		DEFAULT_RETURN_FORMAT,
	);
	const response = await rpcMethods.getTransactionByHash(
		web3Context.requestManager,
		transactionHashFormatted,
	);

	return isNullish(response)
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns A list of pending transactions.
 *
 * ```ts
 * web3.eth.getPendingTransactions().then(console.log);
 * > [
 *      {
 *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *          type: 0n,
 *          nonce: 0n,
 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *          blockNumber: null,
 *          transactionIndex: 0n,
 *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *          value: 1n,
 *          gas: 90000n,
 *          gasPrice: 2000000000n,
 *          input: '0x',
 *          v: 2709n,
 *          r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *          s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *      },
 *      {
 *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
 *          type: 0n,
 *          nonce: 1n,
 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *          blockNumber: null,
 *          transactionIndex: 0n,
 *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *          value: 1n,
 *          gas: 90000n,
 *          gasPrice: 2000000000n,
 *          input: '0x',
 *          v: 2710n,
 *          r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
 *          s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
 *      }
 *   ]
 *
 * * web3.eth.getPendingTransactions({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
 * > [
 *      {
 *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *          type: 0,
 *          nonce: 0,
 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *          blockNumber: null,
 *          transactionIndex: 0,
 *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *          value: 1,
 *          gas: 90000,
 *          gasPrice: 2000000000,
 *          input: '0x',
 *          v: 2709,
 *          r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *          s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *      },
 *      {
 *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
 *          type: 0,
 *          nonce: 1,
 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
 *          blockNumber: null,
 *          transactionIndex: 0,
 *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *          value: 1,
 *          gas: 90000,
 *          gasPrice: 2000000000,
 *          input: '0x',
 *          v: 2710,
 *          r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
 *          s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
 *      }
 *   ]
 * ```
 */
export async function getPendingTransactions<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getPendingTransactions(web3Context.requestManager);

	return response.map(transaction =>
		formatTransaction(transaction as unknown as Transaction, returnFormat),
	);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
 * @param transactionIndex The index position of the transaction.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The desired transaction object.
 *
 * ```ts
 * web3.eth.getTransactionFromBlock('0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00', 0).then(console.log);
 * {
 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *    type: 0n,
 *    nonce: 0n,
 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
 *    blockNumber: 1n,
 *    transactionIndex: 0n,
 *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *    value: 1n,
 *    gas: 90000n,
 *    gasPrice: 2000000000n,
 *    input: '0x',
 *    v: 2709n,
 *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *  }
 *
 * web3.eth.getTransactionFromBlock(
 *     <Buffer 30 78 34 33 32 30 32 62 64 31 36 62 36 62 64 35 34 62 65 61 31 62 33 31 30 37 33 36 62 64 37 38 62 64 62 65 39 33 61 36 34 61 64 39 34 30 66 37 35 38 ... >,
 *     0,
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * {
 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
 *    type: 0,
 *    nonce: 0,
 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
 *    blockNumber: 1,
 *    transactionIndex: 0,
 *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *    value: 1,
 *    gas: 90000,
 *    gasPrice: 2000000000,
 *    input: '0x',
 *    v: 2709,
 *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
 *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 *  }
 * ```
 */
export async function getTransactionFromBlock<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	transactionIndex: Numbers,
	returnFormat: ReturnFormat,
) {
	const transactionIndexFormatted = format({ eth: 'uint' }, transactionIndex, ETH_DATA_FORMAT);

	let response;
	if (isBytes(block)) {
		const blockHashFormatted = format({ eth: 'bytes32' }, block, ETH_DATA_FORMAT);
		response = await rpcMethods.getTransactionByBlockHashAndIndex(
			web3Context.requestManager,
			blockHashFormatted as HexString,
			transactionIndexFormatted,
		);
	} else {
		const blockNumberFormatted = isBlockTag(block as string)
			? (block as BlockTag)
			: format({ eth: 'uint' }, block as Numbers, ETH_DATA_FORMAT);
		response = await rpcMethods.getTransactionByBlockNumberAndIndex(
			web3Context.requestManager,
			blockNumberFormatted,
			transactionIndexFormatted,
		);
	}

	return isNullish(response)
		? response
		: format(transactionInfoSchema, response as unknown as TransactionInfo, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transactionHash Hash of the transaction to retrieve the receipt for.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The desired {@link TransactionReceipt} object.
 *
 * ```ts
 * web3.eth.getTransactionReceipt("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f").then(console.log);
 * > {
 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
 *      transactionIndex: 0n,
 *      blockNumber: 2n,
 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
 *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *      cumulativeGasUsed: 21000n,
 *      gasUsed: 21000n,
 *      logs: [],
 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *      status: 1n,
 *      effectiveGasPrice: 2000000000n,
 *      type: 0n
 *  }
 *
 * web3.eth.getTransactionReceipt(
 *      "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
 *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > {
 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
 *      transactionIndex: 0,
 *      blockNumber: 2,
 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
 *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *      cumulativeGasUsed: 21000,
 *      gasUsed: 21000,
 *      logs: [],
 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *      status: 1,
 *      effectiveGasPrice: 2000000000,
 *      type: 0n
 *  }
 * ```
 */
export async function getTransactionReceipt<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: Bytes,
	returnFormat: ReturnFormat,
) {
	const transactionHashFormatted = format(
		{ eth: 'bytes32' },
		transactionHash,
		DEFAULT_RETURN_FORMAT,
	);
	const response = await rpcMethods.getTransactionReceipt(
		web3Context.requestManager,
		transactionHashFormatted,
	);

	return isNullish(response)
		? response
		: (format(
				transactionReceiptSchema,
				response as unknown as TransactionReceipt,
				returnFormat,
		  ) as TransactionReceipt);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param address The address to get the number of transactions for.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the query.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The number of transactions sent from the provided address.
 *
 * ```ts
 * web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
 * > 1n
 *
 * web3.eth.getTransactionCount(
 *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
 *     undefined,
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > 1
 * ```
 */
export async function getTransactionCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);
	const response = await rpcMethods.getTransactionCount(
		web3Context.requestManager,
		address,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transaction The {@link Transaction} or {@link TransactionWithLocalWalletIndex} to send.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @param options A configuration object used to change the behavior of the `sendTransaction` method.
 * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
 * ```ts
 * const transaction = {
 *   from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
 *   to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
 *   value: '0x1'
 * }
 *
 * const transactionHash = await web3.eth.sendTransaction(transaction);
 * console.log(transactionHash);
 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
 *
 * web3.eth.sendTransaction(transaction).then(console.log);
 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
 *
 * web3.eth.sendTransaction(transaction).catch(console.log);
 * > <Some TransactionError>
 *
 * // Example using options.ignoreGasPricing = true
 * web3.eth.sendTransaction(transaction, undefined, { ignoreGasPricing: true }).then(console.log);
 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
 * ```
 *
 *
 * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
 * - `sending`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
 * > {
 *    from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
 *    to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
 *    value: '0x1',
 *    gasPrice: '0x77359400',
 *    maxPriorityFeePerGas: undefined,
 *    maxFeePerGas: undefined
 * }
 * ```
 * - `sent`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('sent', sentTransaction => console.log(sentTransaction));
 * > {
 *    from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
 *    to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
 *    value: '0x1',
 *    gasPrice: '0x77359400',
 *    maxPriorityFeePerGas: undefined,
 *    maxFeePerGas: undefined
 * }
 * ```
 * - `transactionHash`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('transactionHash', transactionHash => console.log(transactionHash));
 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
 * ```
 * - `receipt`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('receipt', receipt => console.log(receipt));
 * > {
 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
 *      transactionIndex: 0n,
 *      blockNumber: 2n,
 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
 *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *      cumulativeGasUsed: 21000n,
 *      gasUsed: 21000n,
 *      logs: [],
 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *      status: 1n,
 *      effectiveGasPrice: 2000000000n,
 *      type: 0n
 * }
 * ```
 * - `confirmation`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('confirmation', confirmation => console.log(confirmation));
 * > {
 *     confirmations: 1n,
 *     receipt: {
 *         transactionHash: '0xb4a3a35ae0f3e77ef0ff7be42010d948d011b21a4e341072ee18717b67e99ab8',
 *         transactionIndex: 0n,
 *         blockNumber: 5n,
 *         blockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548',
 *         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
 *         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
 *         cumulativeGasUsed: 21000n,
 *         gasUsed: 21000n,
 *         logs: [],
 *         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *         status: 1n,
 *         effectiveGasPrice: 2000000000n,
 *         type: 0n
 *     },
 *     latestBlockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548'
 * }
 * ```
 * - `error`
 * ```ts
 * web3.eth.sendTransaction(transaction).on('error', error => console.log);
 * > <Some TransactionError>
 * ```
 */
export function sendTransaction<
	ReturnFormat extends DataFormat,
	ResolveType = FormatType<TransactionReceipt, ReturnFormat>,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction | TransactionWithLocalWalletIndex,
	returnFormat: ReturnFormat,
	options?: SendTransactionOptions<ResolveType>,
): Web3PromiEvent<ResolveType, SendTransactionEvents<ReturnFormat>> {
	const promiEvent = new Web3PromiEvent<ResolveType, SendTransactionEvents<ReturnFormat>>(
		(resolve, reject) => {
			setImmediate(() => {
				(async () => {
					try {
						let transactionFormatted = formatTransaction(
							{
								...transaction,
								from: getTransactionFromAttr(web3Context, transaction),
							},
							ETH_DATA_FORMAT,
						);

						if (web3Context.handleRevert) {
							// eslint-disable-next-line no-use-before-define
							await getRevertReason(
								web3Context,
								transactionFormatted as TransactionCall,
								returnFormat,
							);
						}

						if (
							!options?.ignoreGasPricing &&
							isNullish(transactionFormatted.gasPrice) &&
							(isNullish(transaction.maxPriorityFeePerGas) ||
								isNullish(transaction.maxFeePerGas))
						) {
							transactionFormatted = {
								...transactionFormatted,
								// TODO gasPrice, maxPriorityFeePerGas, maxFeePerGas
								// should not be included if undefined, but currently are
								...(await getTransactionGasPricing(
									transactionFormatted,
									web3Context,
									ETH_DATA_FORMAT,
								)),
							};
						}

						if (promiEvent.listenerCount('sending') > 0) {
							promiEvent.emit('sending', transactionFormatted);
						}

						let transactionHash: HexString;
						let wallet: Web3BaseWalletAccount | undefined;

						if (web3Context.wallet && !isNullish(transactionFormatted.from)) {
							wallet = web3Context.wallet.get(transactionFormatted.from);
						}

						if (wallet) {
							const signedTransaction = await wallet.signTransaction(
								transactionFormatted as Record<string, unknown>,
							);

							transactionHash = await waitWithTimeout(
								rpcMethods.sendRawTransaction(
									web3Context.requestManager,
									signedTransaction.rawTransaction,
								),
								web3Context.transactionSendTimeout,
								new TransactionSendTimeoutError({
									numberOfSeconds: web3Context.transactionSendTimeout / 1000,
									transactionHash: signedTransaction.transactionHash,
								}),
							);
						} else {
							transactionHash = await waitWithTimeout(
								rpcMethods.sendTransaction(
									web3Context.requestManager,
									transactionFormatted as Partial<TransactionWithSenderAPI>,
								),
								web3Context.transactionSendTimeout,
								new TransactionSendTimeoutError({
									numberOfSeconds: web3Context.transactionSendTimeout / 1000,
								}),
							);
						}

						const transactionHashFormatted = format(
							{ eth: 'bytes32' },
							transactionHash as Bytes,
							returnFormat,
						);

						if (promiEvent.listenerCount('sent') > 0) {
							promiEvent.emit('sent', transactionFormatted);
						}

						if (promiEvent.listenerCount('transactionHash') > 0) {
							promiEvent.emit('transactionHash', transactionHashFormatted);
						}

						const transactionReceipt = await waitForTransactionReceipt(
							web3Context,
							transactionHash,
							returnFormat,
						);

						const transactionReceiptFormatted = format(
							transactionReceiptSchema,
							transactionReceipt,
							returnFormat,
						);

						if (promiEvent.listenerCount('receipt') > 0) {
							promiEvent.emit('receipt', transactionReceiptFormatted);
						}

						if (options?.transactionResolver) {
							resolve(
								options?.transactionResolver(
									transactionReceiptFormatted,
								) as unknown as ResolveType,
							);
						} else if (transactionReceipt.status === BigInt(0)) {
							if (promiEvent.listenerCount('error') > 0) {
								promiEvent.emit(
									'error',
									new TransactionError(
										'Transaction failed',
										transactionReceiptFormatted,
									),
								);
							}
							reject(transactionReceiptFormatted as unknown as ResolveType);
						} else {
							resolve(transactionReceiptFormatted as unknown as ResolveType);
						}

						if (promiEvent.listenerCount('confirmation') > 0) {
							watchTransactionForConfirmations<
								ReturnFormat,
								SendTransactionEvents<ReturnFormat>,
								ResolveType
							>(
								web3Context,
								promiEvent,
								transactionReceiptFormatted as TransactionReceipt,
								transactionHash,
								returnFormat,
							);
						}
					} catch (error) {
						if (promiEvent.listenerCount('error') > 0) {
							promiEvent.emit(
								'error',
								new TransactionError((error as Error).message),
							);
						}
						reject(error);
					}
				})() as unknown;
			});
		},
	);

	return promiEvent;
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transaction Signed transaction in one of the valid {@link Bytes} format.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
 * ```ts
 * const signedTransaction = "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
 *
 * const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction);
 * console.log(transactionHash);
 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
 *
 * web3.eth.sendSignedTransaction(signedTransaction).then(console.log);
 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
 *
 * web3.eth.sendSignedTransaction(signedTransaction).catch(console.log);
 * > <Some TransactionError>
 * ```
 *
 *
 * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
 * - `sending`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
 * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
 * ```
 * - `sent`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('sent', sentTransaction => console.log(sentTransaction));
 * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
 * ```
 * - `transactionHash`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('transactionHash', transactionHash => console.log(transactionHash));
 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
 * ```
 * - `receipt`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('receipt', receipt => console.log(receipt));
 * > {
 *      blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
 *      blockNumber: 1n,
 *      cumulativeGasUsed: 21000n,
 *      effectiveGasPrice: 1000000001n,
 *      from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *      gasUsed: 21000n,
 *      logs: [],
 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *      status: 1n,
 *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *      transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
 *      transactionIndex: 0n,
 *      type: 0n
 * }
 * ```
 * - `confirmation`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('confirmation', confirmation => console.log(confirmation));
 * > {
 *     confirmations: 1n,
 *     receipt: {
 *          blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
 *          blockNumber: 1n,
 *          cumulativeGasUsed: 21000n,
 *          effectiveGasPrice: 1000000001n,
 *          from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *          gasUsed: 21000n,
 *          logs: [],
 *          logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *          status: 1n,
 *          to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *          transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
 *          transactionIndex: 0n,
 *          type: 0n
 *     },
 *     latestBlockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081'
 * }
 * ```
 * - `error`
 * ```ts
 * web3.eth.sendSignedTransaction(signedTransaction).on('error', error => console.log(error));
 * > <Some TransactionError>
 * ```
 */
export function sendSignedTransaction<
	ReturnFormat extends DataFormat,
	ResolveType = FormatType<TransactionReceipt, ReturnFormat>,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	signedTransaction: Bytes,
	returnFormat: ReturnFormat,
	options?: SendSignedTransactionOptions<ResolveType>,
): Web3PromiEvent<ResolveType, SendSignedTransactionEvents<ReturnFormat>> {
	// TODO - Promise returned in function argument where a void return was expected
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promiEvent = new Web3PromiEvent<ResolveType, SendSignedTransactionEvents<ReturnFormat>>(
		(resolve, reject) => {
			setImmediate(() => {
				(async () => {
					try {
						// Formatting signedTransaction to be send to RPC endpoint
						const signedTransactionFormattedHex = format(
							{ eth: 'bytes' },
							signedTransaction,
							ETH_DATA_FORMAT,
						);

						if (promiEvent.listenerCount('sending') > 0) {
							promiEvent.emit('sending', signedTransactionFormattedHex);
						}
						// todo enable handleRevert for sendSignedTransaction when we have a function to decode transactions
						// importing a package for this would increase the size of the library
						// if (web3Context.handleRevert) {
						// 	await getRevertReason(web3Context, transaction, returnFormat);
						// }

						const transactionHash = await rpcMethods.sendRawTransaction(
							web3Context.requestManager,
							signedTransactionFormattedHex,
						);

						if (promiEvent.listenerCount('sent') > 0) {
							promiEvent.emit('sent', signedTransactionFormattedHex);
						}

						const transactionHashFormatted = format(
							{ eth: 'bytes32' },
							transactionHash as Bytes,
							returnFormat,
						);

						if (promiEvent.listenerCount('transactionHash') > 0) {
							promiEvent.emit('transactionHash', transactionHashFormatted);
						}

						const transactionReceipt = await waitForTransactionReceipt(
							web3Context,
							transactionHash,
							returnFormat,
						);

						const transactionReceiptFormatted = format(
							transactionReceiptSchema,
							transactionReceipt,
							returnFormat,
						);

						if (promiEvent.listenerCount('receipt') > 0) {
							promiEvent.emit('receipt', transactionReceiptFormatted);
						}

						if (options?.transactionResolver) {
							resolve(
								options?.transactionResolver(
									transactionReceiptFormatted,
								) as unknown as ResolveType,
							);
						} else if (transactionReceipt.status === BigInt(0)) {
							if (promiEvent.listenerCount('error') > 0) {
								promiEvent.emit(
									'error',
									new TransactionError(
										'Transaction failed',
										transactionReceiptFormatted,
									),
								);
							}
							reject(transactionReceiptFormatted as unknown as ResolveType);
						} else {
							resolve(transactionReceiptFormatted as unknown as ResolveType);
						}

						if (promiEvent.listenerCount('confirmation') > 0) {
							watchTransactionForConfirmations<
								ReturnFormat,
								SendSignedTransactionEvents<ReturnFormat>,
								ResolveType
							>(
								web3Context,
								promiEvent,
								transactionReceiptFormatted as TransactionReceipt,
								transactionHash,
								returnFormat,
							);
						}
					} catch (error) {
						if (promiEvent.listenerCount('error') > 0) {
							promiEvent.emit(
								'error',
								new TransactionError((error as Error).message),
							);
						}
						reject(error);
					}
				})() as unknown;
			});
		},
	);

	return promiEvent;
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param message Data to sign in one of the valid {@link Bytes} format.
 * @param address Address to sign data with, can be an address or the index of a local wallet.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns The signed `message`.
 *
 * ```ts
 * // Using an unlocked account managed by connected RPC client
 * web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe").then(console.log);
 * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
 *
 * // Using an unlocked account managed by connected RPC client
 * web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.BUFFER }).then(console.log);
 * > <Buffer 30 78 33 30 37 35 35 65 64 36 35 33 39 36 66 61 63 66 38 36 63 35 33 65 36 32 31 37 63 35 32 62 34 64 61 65 62 65 37 32 61 61 34 39 34 31 64 38 39 36 ... >
 * ```
 *
 * // Using an indexed account managed by local Web3 wallet
 * web3.eth.sign("0x48656c6c6f20776f726c64", 0).then(console.log);
 * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
 */
export async function sign<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	message: Bytes,
	addressOrIndex: Address | number,
	returnFormat: ReturnFormat,
) {
	const messageFormatted = format({ eth: 'bytes' }, message, DEFAULT_RETURN_FORMAT);

	if (web3Context.wallet?.get(addressOrIndex)) {
		const wallet = web3Context.wallet.get(addressOrIndex) as Web3BaseWalletAccount;

		return wallet.sign(messageFormatted);
	}

	if (typeof addressOrIndex === 'number') {
		throw new SignatureError(
			message,
			'RPC method "eth_sign" does not support index signatures',
		);
	}

	const response = await rpcMethods.sign(
		web3Context.requestManager,
		addressOrIndex,
		messageFormatted,
	);
	return format({ eth: 'bytes' }, response, returnFormat);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transaction The transaction object to sign.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
 * @returns {@link SignedTransactionInfoAPI}, an object containing the [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/#top) encoded signed transaction (accessed via the `raw` property) and the signed transaction object (accessed via the `tx` property).
 *
 * ```ts
 * const transaction = {
 *      from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
 *      to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
 *      value: '0x1',
 *      gas: '21000',
 *      gasPrice: await web3Eth.getGasPrice(),
 *      nonce: '0x1',
 *      type: '0x0'
 * }
 *
 * web3.eth.signTransaction(transaction).then(console.log);
 * > {
 *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
 *   tx: {
 *      type: 0n,
 *      nonce: 1n,
 *      gasPrice: 1000000001n,
 *      gas: 21000n,
 *      value: 1n,
 *      v: 2710n,
 *      r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
 *      s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
 *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *      data: '0x'
 *   }
 * }
 *
 * web3.eth.signTransaction(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
 * > {
 *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
 *   tx: {
 *      type: 0,
 *      nonce: 1,
 *      gasPrice: 1000000001,
 *      gas: 21000,
 *      value: 1,
 *      v: 2710,
 *      r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
 *      s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
 *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
 *      data: '0x'
 *   }
 * }
 * ```
 */
export async function signTransaction<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.signTransaction(
		web3Context.requestManager,
		formatTransaction(transaction, ETH_DATA_FORMAT),
	);
	// Some clients only return the encoded signed transaction (e.g. Ganache)
	// while clients such as Geth return the desired SignedTransactionInfoAPI object
	return isString(response as HexStringBytes)
		? decodeSignedTransaction(response as HexStringBytes, returnFormat)
		: {
				raw: format(
					{ eth: 'bytes' },
					(response as SignedTransactionInfoAPI).raw,
					returnFormat,
				),
				tx: formatTransaction((response as SignedTransactionInfoAPI).tx, returnFormat),
		  };
}

// TODO Decide what to do with transaction.to
// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
/**
 * Executes a message call within the EVM without creating a transaction.
 * It does not publish anything to the blockchain and does not consume any gas.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transaction - A transaction object where all properties are optional except `to`, however it's recommended to include the `from` property or it may default to `0x0000000000000000000000000000000000000000` depending on your node or provider.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns The returned data of the call, e.g. a smart contract function's return value.
 */
export async function call<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.call(
		web3Context.requestManager,
		formatTransaction(transaction, ETH_DATA_FORMAT),
		blockNumberFormatted,
	);

	return format({ eth: 'bytes' }, response, returnFormat);
}

// TODO - Investigate whether response is padded as 1.x docs suggest
/**
 * Simulates the transaction within the EVM to estimate the amount of gas to be used by the transaction.
 * The transaction will not be added to the blockchain, and actual gas usage can vary when interacting
 * with a contract as a result of updating the contract's state.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param transaction The {@link Transaction} object to estimate the gas for.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns The used gas for the simulated transaction execution.
 *
 * ```ts
 * const transaction = {
 *       from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
 *       to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
 *       value: '0x1',
 *       nonce: '0x1',
 *       type: '0x0'
 * }
 *
 * web3.eth.estimateGas(transaction).then(console.log);
 * > 21000n
 *
 * web3.eth.estimateGas(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
 * > 21000
 * ```
 */
export async function estimateGas<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Transaction,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const transactionFormatted = formatTransaction(transaction, ETH_DATA_FORMAT);

	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.estimateGas(
		web3Context.requestManager,
		transactionFormatted,
		blockNumberFormatted,
	);

	return format({ eth: 'uint' }, response as Numbers, returnFormat);
}

// TODO - Add input formatting to filter
/**
 * Gets past logs, matching the provided `filter`.
 *
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param filter A {@link Filter} object containing the properties for the desired logs.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns {@link FilterResultsAPI}, an array of {@link Log} objects.
 *
 * ```ts
 * web3.eth.getPastLogs({
 *      address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
 *      topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
 *  }).then(console.log);
 * > [{
 *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
 *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
 *       logIndex: 0n,
 *       transactionIndex: 0n,
 *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
 *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
 *       blockNumber: 1234n,
 *       address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
 *   },
 *   {...}]
 *
 * web3.eth.getPastLogs(
 *     {
 *       address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
 *       topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
 *     },
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > [{
 *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
 *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
 *       logIndex: 0,
 *       transactionIndex: 0,
 *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
 *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
 *       blockNumber: 1234,
 *       address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
 *   },
 *   {...}]
 * ```
 */
export async function getLogs<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3EthExecutionAPI>,
	filter: Filter,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getLogs(web3Context.requestManager, filter);

	const result = response.map(res => {
		if (typeof res === 'string') {
			return res;
		}

		return format(logSchema, res as unknown as Log, returnFormat);
	});

	return result;
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns The chain ID of the current connected node as described in the [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md).
 *
 * ```ts
 * web3.eth.getChainId().then(console.log);
 * > 61n
 *
 * web3.eth.getChainId({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
 * > 61
 * ```
 */
export async function getChainId<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getChainId(web3Context.requestManager);

	return format(
		{ eth: 'uint' },
		// Response is number in hex formatted string
		response as unknown as number,
		returnFormat,
	);
}

/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param address The Address of the account or contract.
 * @param storageKeys Array of storage-keys which should be proofed and included. See {@link web3.getStorageAt}.
 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns The account and storage-values of the specified account including the Merkle-proof as described in [EIP-1186](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md).
 *
 * ```ts
 * web3.eth.getProof(
 *     "0x1234567890123456789012345678901234567890",
 *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
 *     "latest"
 * ).then(console.log);
 * > {
 *     "address": "0x1234567890123456789012345678901234567890",
 *     "accountProof": [
 *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
 *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
 *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
 *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
 *     ],
 *     "balance": 0n,
 *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
 *     "nonce": 0n,
 *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
 *     "storageProof": [
 *         {
 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
 *             "value": 0n,
 *             "proof": []
 *         },
 *         {
 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
 *             "value": 0n,
 *             "proof": []
 *         }
 *     ]
 * }
 *
 * web3.eth.getProof(
 *     "0x1234567890123456789012345678901234567890",
 *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
 *     undefined,
 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
 * ).then(console.log);
 * > {
 *     "address": "0x1234567890123456789012345678901234567890",
 *     "accountProof": [
 *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
 *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
 *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
 *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
 *     ],
 *     "balance": 0,
 *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
 *     "nonce": 0,
 *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
 *     "storageProof": [
 *         {
 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
 *             "value": 0,
 *             "proof": []
 *         },
 *         {
 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
 *             "value": 0,
 *             "proof": []
 *         }
 *     ]
 * }
 * ```
 */
export async function getProof<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3EthExecutionAPI>,
	address: Address,
	storageKeys: Bytes[],
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnFormat: ReturnFormat,
) {
	const storageKeysFormatted = storageKeys.map(storageKey =>
		format({ eth: 'bytes' }, storageKey, ETH_DATA_FORMAT),
	);

	const blockNumberFormatted = isBlockTag(blockNumber as string)
		? (blockNumber as BlockTag)
		: format({ eth: 'uint' }, blockNumber as Numbers, ETH_DATA_FORMAT);

	const response = await rpcMethods.getProof(
		web3Context.requestManager,
		address,
		storageKeysFormatted,
		blockNumberFormatted,
	);

	return format(accountSchema, response as unknown as AccountObject, returnFormat);
}

// TODO Throwing an error with Geth, but not Infura
// TODO gasUsedRatio and reward not formatting
/**
 * @param web3Context ({@link Web3Context}) Web3 configuration object that contains things such as the provider, request manager, wallet, etc.
 * @param blockCount Number of blocks in the requested range. Between `1` and `1024` blocks can be requested in a single query. Less than requested may be returned if not all blocks are available.
 * @param newestBlock Highest number block of the requested range.
 * @param rewardPercentiles A monotonically increasing list of percentile values to sample from each block’s effective priority fees per gas in ascending order, weighted by gas used. Example: `[“0”, “25”, “50”, “75”, “100”]` or `[“0”, “0.5”, “1”, “1.5”, “3”, “80”]`
 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
 * @returns `baseFeePerGas` and transaction effective `priorityFeePerGas` history for the requested block range if available.
 * The range between `headBlock - 4` and `headBlock` is guaranteed to be available while retrieving data from the `pending` block and older history are optional to support.
 * For pre-EIP-1559 blocks the `gasPrice`s are returned as `rewards` and zeroes are returned for the `baseFeePerGas`.
 *
 * ```ts
 * web3.eth.getFeeHistory(4, 'pending', [0, 25, 75, 100]).then(console.log);
 * > {
 *     baseFeePerGas: [
 *         22983878621n,
 *         21417903463n,
 *         19989260230n,
 *         17770954829n,
 *         18850641304n
 *     ],
 *     gasUsedRatio: [
 *         0.22746546666666667,
 *         0.2331871,
 *         0.05610054885262125,
 *         0.7430227268212117
 *     ],
 *     oldestBlock: 15216343n,
 *     reward: [
 *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
 *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
 *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
 *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
 *     ]
 * }
 *
 * web3.eth.getFeeHistory(4, BlockTags.LATEST, [0, 25, 75, 100], { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
 * > {
 *     baseFeePerGas: [
 *         22983878621,
 *         21417903463,
 *         19989260230,
 *         17770954829,
 *         18850641304
 *     ],
 *     gasUsedRatio: [
 *         0.22746546666666667,
 *         0.2331871,
 *         0.05610054885262125,
 *         0.7430227268212117
 *     ],
 *     oldestBlock: 15216343,
 *     reward: [
 *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
 *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
 *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
 *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
 *     ]
 * }
 * ```
 */
export async function getFeeHistory<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	blockCount: Numbers,
	newestBlock: BlockNumberOrTag = web3Context.defaultBlock,
	rewardPercentiles: Numbers[],
	returnFormat: ReturnFormat,
) {
	const blockCountFormatted = format({ eth: 'uint' }, blockCount, ETH_DATA_FORMAT);

	const newestBlockFormatted = isBlockTag(newestBlock as string)
		? (newestBlock as BlockTag)
		: format({ eth: 'uint' }, newestBlock as Numbers, ETH_DATA_FORMAT);

	const rewardPercentilesFormatted = format(
		{
			type: 'array',
			items: {
				eth: 'uint',
			},
		},
		rewardPercentiles,
		NUMBER_DATA_FORMAT,
	);

	const response = await rpcMethods.getFeeHistory(
		web3Context.requestManager,
		blockCountFormatted,
		newestBlockFormatted,
		rewardPercentilesFormatted,
	);

	return format(feeHistorySchema, response as unknown as FeeHistory, returnFormat);
}
/**
 *
 * @param web3Context
 * @param transaction
 */
async function getRevertReason<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: TransactionCall,
	returnFormat: ReturnFormat,
) {
	try {
		await call(web3Context, transaction, web3Context.defaultBlock, returnFormat);
	} catch (err) {
		throw new TransactionRevertError((err as Error).message);
	}
}
