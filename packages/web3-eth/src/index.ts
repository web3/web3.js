// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import { TransactionCall, TransactionWithSender, Web3BaseProvider } from 'web3-common';
import { Web3Config, Web3RequestManager } from 'web3-core';
import {
	BlockNumberOrTag,
	ValidTypes,
	ValidReturnTypes,
	convertToValidType,
	Address,
	Uint256,
	HexString32Bytes,
	HexStringBytes,
	Uint,
	HexString8Bytes,
	convertObjectPropertiesToValidType,
	isHexString32Bytes,
	Filter,
} from 'web3-utils';
import {
	convertibleBlockProperties,
	convertibleFeeHistoryResultProperties,
	convertibleReceiptInfoProperties,
	convertibleTransactionInfoProperties,
} from './convertible_properties';

import * as rpcMethods from './rpc_methods';

export class Web3Eth {
	private readonly _requestManager: Web3RequestManager;
	private readonly _options: Web3Config;

	public constructor(provider: Web3BaseProvider | string, options: Web3Config) {
		this._requestManager = new Web3RequestManager(provider);
		this._options = options;
	}

	public async getProtocolVersion() {
		return rpcMethods.getProtocolVersion(this._requestManager);
	}

	public async isSyncing() {
		return rpcMethods.getSyncing(this._requestManager);
	}

	public async getCoinbase() {
		return rpcMethods.getCoinbase(this._requestManager);
	}

	public async isMining() {
		return rpcMethods.getMining(this._requestManager);
	}

	public async getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getHashRate(this._requestManager);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getGasPrice(this._requestManager);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getAccounts() {
		return rpcMethods.getAccounts(this._requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBlockNumber(this._requestManager);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBalance(this._requestManager, address, blockNumber);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getStorageAt(
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	) {
		return rpcMethods.getStorageAt(this._requestManager, address, storageSlot, blockNumber);
	}

	public async getCode(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	) {
		return rpcMethods.getCode(this._requestManager, address, blockNumber);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		hydrated: boolean,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockByHash(this._requestManager, block, hydrated)
			: await rpcMethods.getBlockByNumber(this._requestManager, block, hydrated);

		return convertObjectPropertiesToValidType(
			response,
			convertibleBlockProperties,
			returnType ?? this._options.defaultReturnType,
		);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBlockTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockTransactionCountByHash(this._requestManager, block)
			: await rpcMethods.getBlockTransactionCountByNumber(this._requestManager, block);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleCountByBlockHash(this._requestManager, block)
			: await rpcMethods.getUncleCountByBlockNumber(this._requestManager, block);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		uncleIndex: Uint,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleByBlockHashAndIndex(this._requestManager, block, uncleIndex)
			: await rpcMethods.getUncleByBlockNumberAndIndex(
					this._requestManager,
					block,
					uncleIndex,
			  );

		return convertObjectPropertiesToValidType(
			response,
			convertibleBlockProperties,
			returnType ?? this._options.defaultReturnType,
		);
	}

	public async getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionByHash(
			this._requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					// TODO
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					convertibleTransactionInfoProperties,
					returnType ?? this._options.defaultReturnType,
			  );
	}

	// TODO Can't find in spec
	// public async getPendingTransactions() {

	// }

	public async getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		transactionIndex: Uint,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getTransactionByBlockHashAndIndex(
					this._requestManager,
					block,
					transactionIndex,
			  )
			: await rpcMethods.getTransactionByBlockNumberAndIndex(
					this._requestManager,
					block,
					transactionIndex,
			  );

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					// TODO
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					convertibleTransactionInfoProperties,
					returnType ?? this._options.defaultReturnType,
			  );
	}

	public async getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionReceipt(
			this._requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					convertibleReceiptInfoProperties,
					returnType ?? this._options.defaultReturnType,
			  );
	}

	// TODO Discuss the use of multiple optional parameters
	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionCount(
			this._requestManager,
			address,
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async sendTransaction(transaction: TransactionWithSender) {
		return rpcMethods.sendTransaction(this._requestManager, transaction);
	}

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return rpcMethods.sendRawTransaction(this._requestManager, transaction);
	}

	public async sign(address: Address, message: HexStringBytes) {
		return rpcMethods.sign(this._requestManager, address, message);
	}

	public async signTransaction(transaction: TransactionWithSender) {
		return rpcMethods.signTransaction(this._requestManager, transaction);
	}

	public async call(
		transaction: TransactionCall,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	) {
		return rpcMethods.call(this._requestManager, transaction, blockNumber);
	}

	public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.estimateGas(
			this._requestManager,
			transaction,
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getPastLogs(filter: Filter) {
		return rpcMethods.getLogs(this._requestManager, filter);
	}

	public async getWork() {
		return rpcMethods.getWork(this._requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return rpcMethods.submitWork(this._requestManager, nonce, seedHash, difficulty);
	}

	// TODO
	// public async requestAccounts() {

	// }

	// TODO
	// public async getChainId() {

	// }

	// TODO
	// public async getNodeInfo() {

	// }

	// TODO
	// public async getProof() {

	// }

	public async getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag,
		rewardPercentiles: number[],
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getFeeHistory(
			this._requestManager,
			blockCount,
			newestBlock,
			rewardPercentiles,
		);

		return convertObjectPropertiesToValidType(
			response,
			convertibleFeeHistoryResultProperties,
			returnType ?? this._options.defaultReturnType,
		);
	}
}
