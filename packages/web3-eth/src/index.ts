import {
	BlockNumberOrTag,
	TransactionCall,
	TransactionWithSender,
	Web3BaseProvider,
	Filter,
} from 'web3-common';
import { Web3Config, Web3RequestManager } from 'web3-core';
import {
	ValidTypes,
	ValidReturnTypes,
	convertToValidType,
	Address,
	Uint256,
	isHexStrict,
	HexString32Bytes,
	HexStringBytes,
	HexString256Bytes,
	Uint,
	HexString8Bytes,
	convertObjectPropertiesToValidType,
} from 'web3-utils';
import { convertibleBlockProperties } from './convertible_properties';

import * as RpcMethods from './rpc_methods';

interface Web3EthOptions extends Web3Config {
	defaultReturnType: ValidTypes;
}

export class Web3Eth {
	private readonly _requestManager: Web3RequestManager;
	private readonly _options: Web3EthOptions;

	public constructor(provider: Web3BaseProvider | string, options: Web3EthOptions) {
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
	): Promise<ValidReturnTypes[ReturnType]> {
		const response = await RpcMethods.getHashRate(this._requestManager);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	): Promise<ValidReturnTypes[ReturnType]> {
		const response = await RpcMethods.getGasPrice(this._requestManager);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	public async getAccounts() {
		return RpcMethods.getAccounts(this._requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	): Promise<ValidReturnTypes[ReturnType]> {
		const response = await RpcMethods.getBlockNumber(this._requestManager);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	): Promise<ValidReturnTypes[ReturnType]> {
		const response = await RpcMethods.getBalance(this._requestManager, address, blockNumber);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
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
		const response =
			// Checking if block is a block hash or number
			typeof block === 'string' && isHexStrict(block) && block.length === 66
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
	): Promise<ValidReturnTypes[ReturnType]> {
		const response =
			// Checking if block is a block hash or number
			typeof block === 'string' && isHexStrict(block) && block.length === 66
				? await RpcMethods.getBlockTransactionCountByHash(this._requestManager, block)
				: await RpcMethods.getBlockTransactionCountByNumber(this._requestManager, block);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	): Promise<ValidReturnTypes[ReturnType]> {
		const response =
			// Checking if block is a block hash or number
			typeof block === 'string' && isHexStrict(block) && block.length === 66
				? await RpcMethods.getUncleCountByBlockHash(this._requestManager, block)
				: await RpcMethods.getUncleCountByBlockNumber(this._requestManager, block);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	// TODO Object returnType
	// public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
	// 	block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
	// 	uncleIndex: Uint,
	// 	returnType?: ReturnType,
	// ) {
	// 	// Checking if block is a block hash or number
	// 	const response =
	// 		typeof block === 'string' && isHexStrict(block) && block.length === 66
	// 			? RpcMethods.getUncleByBlockHashAndIndex(this._requestManager, block, uncleIndex)
	// 			: RpcMethods.getUncleByBlockNumberAndIndex(this._requestManager, block, uncleIndex);

	// 	return returnType === undefined
	// 		? this._options.defaultReturnType === undefined
	// 			? response
	// 			: convertObjectPropertiesToValidType(
	// 					response,
	// 					convertibleBlockProperties,
	// 					this._options.defaultReturnType,
	// 			  )
	// 		: convertObjectPropertiesToValidType(response, convertibleBlockProperties, returnType);
	// }

	// TODO Object returnType
	public async getTransaction(transactionHash: HexString32Bytes) {
		return RpcMethods.getTransactionByHash(this._requestManager, transactionHash);
	}

	// TODO Can't find in spec
	// public async getPendingTransactions() {

	// }

	// TODO Object returnType
	public async getTransactionFromBlock(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		transactionIndex: Uint,
		// returnType?: ReturnType,
	) {
		// Checking if block is a block hash or number
		return typeof block === 'string' && isHexStrict(block) && block.length === 66
			? RpcMethods.getTransactionByBlockHashAndIndex(
					this._requestManager,
					block,
					transactionIndex,
			  )
			: RpcMethods.getTransactionByBlockNumberAndIndex(
					this._requestManager,
					block,
					transactionIndex,
			  );

		// return (
		// 	returnType === undefined
		// 		? this._options.defaultReturnType === undefined
		// 			? response
		// 			: convertToValidType(response, this._options.defaultReturnType)
		// 		: convertToValidType(response, returnType)
		// ) as ValidReturnTypes[ReturnType];
	}

	// TODO Object returnType
	public async getTransactionReceipt(transactionHash: HexString32Bytes) {
		return RpcMethods.getTransactionReceipt(this._requestManager, transactionHash);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ReturnType,
	): Promise<ValidReturnTypes[ReturnType]> {
		const response = await RpcMethods.getTransactionCount(
			this._requestManager,
			address,
			blockNumber,
		);

		return (
			returnType === undefined
				? this._options.defaultReturnType === undefined
					? response
					: convertToValidType(response, this._options.defaultReturnType)
				: convertToValidType(response, returnType)
		) as ValidReturnTypes[ReturnType];
	}

	public async sendTransaction(transaction: TransactionWithSender): Promise<HexString32Bytes> {
		return RpcMethods.sendTransaction(this._requestManager, transaction);
	}

	public async sendSignedTransaction(transaction: HexStringBytes): Promise<HexString32Bytes> {
		return RpcMethods.sendRawTransaction(this._requestManager, transaction);
	}

	public async sign(address: Address, message: HexStringBytes): Promise<HexString256Bytes> {
		return RpcMethods.sign(this._requestManager, address, message);
	}

	public async signTransaction(transaction: TransactionWithSender): Promise<HexStringBytes> {
		return RpcMethods.signTransaction(this._requestManager, transaction);
	}

	public async call(
		transaction: TransactionCall,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	): Promise<HexStringBytes> {
		return RpcMethods.call(this._requestManager, transaction, blockNumber);
	}

	public async estimateGas(
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	): Promise<Uint> {
		return RpcMethods.estimateGas(this._requestManager, transaction, blockNumber);
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

	// TODO Object returnType
	public async getFeeHistory(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag,
		rewardPercentiles: number[],
	) {
		return RpcMethods.getFeeHistory(
			this._requestManager,
			blockCount,
			newestBlock,
			rewardPercentiles,
		);
	}
}
