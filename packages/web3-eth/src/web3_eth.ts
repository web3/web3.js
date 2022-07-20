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
import { DataFormat, DEFAULT_RETURN_FORMAT, LogsInput } from 'web3-common';
import {
	isSupportedProvider,
	SupportedProviders,
	Web3Context,
	Web3ContextInitOptions,
} from 'web3-core';
import { TransactionNotFound } from 'web3-errors';
import {
	Address,
	Bytes,
	Filter,
	HexString32Bytes,
	HexString8Bytes,
	Numbers,
	BlockNumberOrTag,
	toChecksumAddress,
} from 'web3-utils';
import * as rpcMethods from './rpc_methods';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import {
	SendTransactionOptions,
	Transaction,
	TransactionCall,
	TransactionWithLocalWalletIndex,
} from './types';
import { Web3EthExecutionAPI } from './web3_eth_execution_api';
import {
	LogsSubscription,
	NewPendingTransactionsSubscription,
	NewHeadsSubscription,
	SyncingSubscription,
} from './web3_subscriptions';

type RegisteredSubscription = {
	logs: typeof LogsSubscription;
	newPendingTransactions: typeof NewPendingTransactionsSubscription;
	pendingTransactions: typeof NewPendingTransactionsSubscription;
	newHeads: typeof NewHeadsSubscription;
	newBlockHeaders: typeof NewHeadsSubscription;
	syncing: typeof SyncingSubscription;
};

const registeredSubscriptions = {
	logs: LogsSubscription,
	newPendingTransactions: NewPendingTransactionsSubscription,
	newHeads: NewHeadsSubscription,
	syncing: SyncingSubscription,
	pendingTransactions: NewPendingTransactionsSubscription, // the same as newPendingTransactions. just for support API like in version 1.x
	newBlockHeaders: NewHeadsSubscription, // the same as newHeads. just for support API like in version 1.x
};

export class Web3Eth extends Web3Context<Web3EthExecutionAPI, RegisteredSubscription> {
	public constructor(
		providerOrContext?: SupportedProviders<any> | Web3ContextInitOptions | string,
	) {
		if (
			typeof providerOrContext === 'string' ||
			isSupportedProvider(providerOrContext as SupportedProviders<any>)
		) {
			super({
				provider: providerOrContext as SupportedProviders<any>,
				registeredSubscriptions,
			});

			return;
		}

		if ((providerOrContext as Web3ContextInitOptions).registeredSubscriptions) {
			super(providerOrContext as Web3ContextInitOptions);
			return;
		}

		super({
			...(providerOrContext as Web3ContextInitOptions),
			registeredSubscriptions,
		});
	}

	/**
	 * @returns Returns the ethereum protocol version of the node.
	 *
	 * ```ts
	 * web3.eth.getProtocolVersion().then(console.log);
	 * > "63"
	 * ```
	 */
	public async getProtocolVersion() {
		return rpcMethods.getProtocolVersion(this.requestManager);
	}

	// TODO Add returnFormat parameter
	/**
	 * Checks if the node is currently syncing.
	 *
	 * @returns Either a {@link SyncingStatus}, or `false`.
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
	public async isSyncing() {
		return rpcMethods.getSyncing(this.requestManager);
	}

	// TODO consider adding returnFormat parameter (to format address as bytes)
	/**
	 * @returns Returns the coinbase address to which mining rewards will go.
	 *
	 * ```ts
	 * web3.eth.getCoinbase().then(console.log);
	 * > "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
	 * ```
	 */
	public async getCoinbase() {
		return rpcMethods.getCoinbase(this.requestManager);
	}

	/**
	 * Checks whether the node is mining or not.
	 *
	 * @returns `true` if the node is mining, otherwise `false`.
	 *
	 * ```ts
	 * web3.eth.isMining().then(console.log);
	 * > true
	 * ```
	 */
	public async isMining() {
		return rpcMethods.getMining(this.requestManager);
	}

	/**
	 * @deprecated Will be removed in the future, please use {@link Web3Eth.getHashRate} method instead.
	 *
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
	public async getHashrate<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return this.getHashRate(returnFormat);
	}

	/**
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
	public async getHashRate<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getHashRate(this, returnFormat);
	}

	/**
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
	public async getGasPrice<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getGasPrice(this, returnFormat);
	}

	/**
	 * @returns A list of accounts the node controls (addresses are checksummed).
	 *
	 * ```ts
	 * web3.eth.getAccounts().then(console.log);
	 * > ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
	 * ```
	 */
	public async getAccounts() {
		const hexAddresses = (await rpcMethods.getAccounts(this.requestManager)) ?? [];
		return hexAddresses.map(address => toChecksumAddress(address));
	}

	/**
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
	public async getBlockNumber<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockNumber(this, returnFormat);
	}

	/**
	 * Get the balance of an address at a given block.
	 *
	 * @param address The address to get the balance of.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the balance query.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The current balance for the given address in `wei`.
	 *
	 * ```ts
	 * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > 1000000000000n
	 *
	 * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > "0xe8d4a51000"
	 * ```
	 */
	public async getBalance<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBalance(this, address, blockNumber, returnFormat);
	}

	/**
	 * Get the storage at a specific position of an address.
	 *
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
	public async getStorageAt<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		storageSlot: Numbers,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getStorageAt(
			this,
			address,
			storageSlot,
			blockNumber,
			returnFormat,
		);
	}

	/**
	 * Get the code at a specific address.
	 *
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
	public async getCode<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getCode(this, address, blockNumber, returnFormat);
	}

	/**
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
	public async getBlock<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		hydrated = false,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlock(this, block, hydrated, returnFormat);
	}

    /**
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
	public async getBlockTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockTransactionCount(this, block, returnFormat);
	}

    /**
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
	public async getBlockUncleCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockUncleCount(this, block, returnFormat);
	}

    /**
     *
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
	public async getUncle<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		uncleIndex: Numbers,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getUncle(this, block, uncleIndex, returnFormat);
	}

    /**
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
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX })
     * .then(console.log);
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
	public async getTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transactionHash: Bytes,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		const response = await rpcMethodsWrappers.getTransaction(
			this,
			transactionHash,
			returnFormat,
		);

		if (!response) throw new TransactionNotFound();

		return response;
	}

    /**
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
	public async getPendingTransactions<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		return rpcMethodsWrappers.getPendingTransactions(this, returnFormat);
	}

    /**
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
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX })
     * .then(console.log);
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
	public async getTransactionFromBlock<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		transactionIndex: Numbers,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getTransactionFromBlock(
			this,
			block,
			transactionIndex,
			returnFormat,
		);
	}

    /**
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
	public async getTransactionReceipt<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(transactionHash: Bytes, returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		const response = await rpcMethodsWrappers.getTransactionReceipt(
			this,
			transactionHash,
			returnFormat,
		);

		if (!response) throw new TransactionNotFound();

		return response;
	}

    /**
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
	public async getTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getTransactionCount(this, address, blockNumber, returnFormat);
	}

    /**
     * @param transaction The {@link Transaction} or {@link TransactionWithLocalWalletIndex} to send.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @param options A {@link SendTransactionOptions} configuration object used to change the behavior of the `sendTransaction` method.
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
     * ```
     *
     *
     * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
     * - `sending`
     * ```ts
     * web3.eth.sendTransaction(transaction)
     * .on('sending', (transactionToBeSent) => {
     *      console.log(transactionToBeSent);
     * });
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
     * web3.eth.sendTransaction(transaction)
     * .on('sent', (sentTransaction) => {
     *      console.log(sentTransaction);
     * });
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
     * web3.eth.sendTransaction(transaction)
     * .on('transactionHash', (transactionHash) => {
     *      console.log(transactionHash);
     * });
     * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
     * ```
     * - `receipt`
     * ```ts
     * web3.eth.sendTransaction(transaction)
     * .on('receipt', (receipt) => {
     *      console.log(receipt);
     * });
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
     * web3.eth.sendTransaction(transaction)
     * .on('confirmation', (confirmation) => {
     *      console.log(confirmation);
     * });
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
     * web3.eth.sendTransaction(transaction)
     * .on('error', (error) => {
     *      console.log(error);
     * });
     * > <Some TransactionError>
     * ```
     */
	public sendTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Transaction | TransactionWithLocalWalletIndex,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
		options?: SendTransactionOptions,
	) {
		return rpcMethodsWrappers.sendTransaction(this, transaction, returnFormat, options);
	}

	public sendSignedTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Bytes,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.sendSignedTransaction(this, transaction, returnFormat);
	}

	public async sign<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		message: Bytes,
		address: Address,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.sign(this, message, address, returnFormat);
	}

	public async signTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Transaction,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.signTransaction(this, transaction, returnFormat);
	}

	// TODO Decide what to do with transaction.to
	// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
	/**
	 * Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.
	 *
	 * @param transaction - A transaction object where all properties are optional except `to`, however it's recommended to include the `from` property or it may default to `0x0000000000000000000000000000000000000000` depending on your node or provider.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns The returned data of the call, e.g. a smart contract function's return value.
	 */
	public async call<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: TransactionCall,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.call(this, transaction, blockNumber, returnFormat);
	}

	public async estimateGas<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Transaction,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.estimateGas(this, transaction, blockNumber, returnFormat);
	}

	public async getPastLogs<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		filter: Filter,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getLogs(this, filter, returnFormat);
	}

	public async getWork() {
		return rpcMethods.getWork(this.requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		hash: HexString32Bytes,
		digest: HexString32Bytes,
	) {
		return rpcMethods.submitWork(this.requestManager, nonce, hash, digest);
	}

	// TODO - Format addresses
	public async requestAccounts() {
		return rpcMethods.requestAccounts(this.requestManager);
	}

	public async getChainId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getChainId(this, returnFormat);
	}

	public async getNodeInfo() {
		return rpcMethods.getNodeInfo(this.requestManager);
	}

	public async getProof<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		storageKeys: Bytes[],
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getProof(this, address, storageKeys, blockNumber, returnFormat);
	}

	public async getFeeHistory<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		blockCount: Numbers,
		newestBlock: BlockNumberOrTag = this.defaultBlock,
		rewardPercentiles: Numbers[],
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getFeeHistory(
			this,
			blockCount,
			newestBlock,
			rewardPercentiles,
			returnFormat,
		);
	}

	public async subscribe<T extends keyof RegisteredSubscription>(
		name: T,
		args?: ConstructorParameters<RegisteredSubscription[T]>[0],
	): Promise<InstanceType<RegisteredSubscription[T]>> {
		const subscription = (await this.subscriptionManager?.subscribe(
			name,
			args,
		)) as InstanceType<RegisteredSubscription[T]>;
		if (
			subscription instanceof LogsSubscription &&
			name === 'logs' &&
			typeof args === 'object' &&
			args.fromBlock &&
			Number.isFinite(Number(args.fromBlock))
		) {
			setImmediate(() => {
				this.getPastLogs(args)
					.then(logs => {
						for (const log of logs) {
							subscription._processSubscriptionResult(log as LogsInput);
						}
					})
					.catch(e => {
						subscription._processSubscriptionError(e as Error);
					});
			});
		}
		return subscription;
	}

	private static shouldClearSubscription({ sub }: { sub: unknown }): boolean {
		return !(sub instanceof SyncingSubscription);
	}

	public clearSubscriptions(notClearSyncing = false): Promise<string[]> | undefined {
		return this.subscriptionManager?.unsubscribe(
			// eslint-disable-next-line
			notClearSyncing ? Web3Eth.shouldClearSubscription : undefined,
		);
	}
}
