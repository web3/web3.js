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
import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-common';
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
     * @returns The gas price determined by the last few blocks median gas price (formatted as per `returnFormat`).
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
     * @returns The current block number (formatted as per `returnFormat`).
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
     * @returns The current balance for the given address in `wei` (formatted as per `returnFormat`).
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
     * @returns The value in storage at the given position (formatted as per `returnFormat`).
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
     * @returns The `data` at given address.
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
     */
	public async getBlock<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		hydrated = false,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlock(this, block, hydrated, returnFormat);
	}

	public async getBlockTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockTransactionCount(this, block, returnFormat);
	}

	public async getBlockUncleCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockUncleCount(this, block, returnFormat);
	}

	public async getUncle<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		uncleIndex: Numbers,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getUncle(this, block, uncleIndex, returnFormat);
	}

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

	public async getPendingTransactions<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		return rpcMethodsWrappers.getPendingTransactions(this, returnFormat);
	}

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

	public async getTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getTransactionCount(this, address, blockNumber, returnFormat);
	}

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
     * @returns The returned data of the call (formatted as per `returnFormat`), e.g. a smart contract function's return value.
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
							subscription._processSubscriptionResult(log);
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

	public clearSubscriptions(notClearSyncing = false): Promise<void[]> | undefined {
		return this.subscriptionManager?.unsubscribe(
			// eslint-disable-next-line
			notClearSyncing ? Web3Eth.shouldClearSubscription : undefined,
		);
	}
}
