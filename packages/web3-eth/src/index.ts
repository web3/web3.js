import { TransactionCall, TransactionWithSender, Web3BaseProvider, Filter } from 'web3-common';
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
    isHexString32Bytes
} from 'web3-utils';
import {
	convertibleBlockProperties,
	convertibleFeeHistoryResultProperties,
	convertibleReceiptInfoProperties,
	convertibleTransactionInfoProperties,
} from './convertible_properties';

import * as RpcMethods from './rpc_methods';

export class Web3Eth {
	private readonly _requestManager: Web3RequestManager;
	private readonly _options: Web3Config;

	public constructor(provider: Web3BaseProvider | string, options: Web3Config) {
		this._requestManager = new Web3RequestManager(provider);
		this._options = options;
	}

	public async getProtocolVersion() {
		return RpcMethods.getProtocolVersion(this._requestManager);
	}

	public async isSyncing() {
		return RpcMethods.getSyncing(this._requestManager);
	}

	public async getCoinbase() {
		return RpcMethods.getCoinbase(this._requestManager);
	}

	public async isMining() {
		return RpcMethods.getMining(this._requestManager);
	}

	public async getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await RpcMethods.getHashRate(this._requestManager);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await RpcMethods.getGasPrice(this._requestManager);

		return convertToValidType(
			response,
			returnType ?? this._options.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getAccounts() {
		return RpcMethods.getAccounts(this._requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await RpcMethods.getBlockNumber(this._requestManager);

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
		const response = await RpcMethods.getBalance(this._requestManager, address, blockNumber);

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
		return RpcMethods.getStorageAt(this._requestManager, address, storageSlot, blockNumber);
	}

	public async getCode(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	) {
		return RpcMethods.getCode(this._requestManager, address, blockNumber);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		hydrated: boolean,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await RpcMethods.getBlockByHash(this._requestManager, block, hydrated)
			: await RpcMethods.getBlockByNumber(this._requestManager, block, hydrated);

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
			? await RpcMethods.getBlockTransactionCountByHash(this._requestManager, block)
			: await RpcMethods.getBlockTransactionCountByNumber(this._requestManager, block);

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
			? await RpcMethods.getUncleCountByBlockHash(this._requestManager, block)
			: await RpcMethods.getUncleCountByBlockNumber(this._requestManager, block);

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
			? await RpcMethods.getUncleByBlockHashAndIndex(this._requestManager, block, uncleIndex)
			: await RpcMethods.getUncleByBlockNumberAndIndex(
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
		const response = await RpcMethods.getTransactionByHash(
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
			? await RpcMethods.getTransactionByBlockHashAndIndex(
					this._requestManager,
					block,
					transactionIndex,
			  )
			: await RpcMethods.getTransactionByBlockNumberAndIndex(
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
		const response = await RpcMethods.getTransactionReceipt(
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
		const response = await RpcMethods.getTransactionCount(
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
		return RpcMethods.sendTransaction(this._requestManager, transaction);
	}

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return RpcMethods.sendRawTransaction(this._requestManager, transaction);
	}

	public async sign(address: Address, message: HexStringBytes) {
		return RpcMethods.sign(this._requestManager, address, message);
	}

	public async signTransaction(transaction: TransactionWithSender) {
		return RpcMethods.signTransaction(this._requestManager, transaction);
	}

	public async call(
		transaction: TransactionCall,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	) {
		return RpcMethods.call(this._requestManager, transaction, blockNumber);
	}

	public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await RpcMethods.estimateGas(
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
		return RpcMethods.getLogs(this._requestManager, filter);
	}

	public async getWork() {
		return RpcMethods.getWork(this._requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return RpcMethods.submitWork(this._requestManager, nonce, seedHash, difficulty);
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
		const response = await RpcMethods.getFeeHistory(
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
