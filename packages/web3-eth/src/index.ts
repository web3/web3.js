import { BlockNumberOrTag, Web3BaseProvider } from 'web3-common';
import { Web3Config, Web3RequestManager } from 'web3-core';
import {
	ValidTypes,
	ValidReturnTypes,
	convertToValidType,
	Address,
	Uint256,
	isHexStrict,
	HexString32Bytes,
} from 'web3-utils';

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

	public async getSyncingResponse() {
		return RpcMethods.getSyncing(this._requestManager);
	}

	public async getCoinbase() {
		return RpcMethods.getCoinbase(this._requestManager);
	}

	public async getMining() {
		return RpcMethods.getMining(this._requestManager);
	}

	public async getHashRate(returnType?: ValidTypes): Promise<ValidReturnTypes[ValidTypes]> {
		const response = await RpcMethods.getHashRate(this._requestManager);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	public async getGasPrice(returnType?: ValidTypes): Promise<ValidReturnTypes[ValidTypes]> {
		const response = await RpcMethods.getGasPrice(this._requestManager);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	public async getAccounts() {
		return RpcMethods.getAccounts(this._requestManager);
	}

	public async getBlockNumber(returnType?: ValidTypes): Promise<ValidReturnTypes[ValidTypes]> {
		const response = await RpcMethods.getBlockNumber(this._requestManager);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getBalance(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ValidTypes,
	): Promise<ValidReturnTypes[ValidTypes]> {
		const response = await RpcMethods.getBalance(this._requestManager, address, blockNumber);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	public async getStorageAt(
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
	): Promise<ValidReturnTypes[ValidTypes]> {
		return RpcMethods.getStorageAt(this._requestManager, address, storageSlot, blockNumber);
	}

	// TODO Discuss the use of multiple optional parameters
	public async getTransactionCount(
		address: Address,
		blockNumber: BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ValidTypes,
	): Promise<ValidReturnTypes[ValidTypes]> {
		const response = await RpcMethods.getTransactionCount(
			this._requestManager,
			address,
			blockNumber,
		);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	public async getBlockTransactionCount(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ValidTypes,
	): Promise<ValidReturnTypes[ValidTypes]> {
		const response =
			// Checking if block is a block hash or number
			typeof block === 'string' && isHexStrict(block) && block.length === 66
				? await RpcMethods.getBlockTransactionCountByHash(this._requestManager, block)
				: await RpcMethods.getBlockTransactionCountByNumber(this._requestManager, block);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	public async getBlockUncleCount(
		block: HexString32Bytes | BlockNumberOrTag = this._options.defaultBlock,
		returnType?: ValidTypes,
	): Promise<ValidReturnTypes[ValidTypes]> {
		const response =
			// Checking if block is a block hash or number
			typeof block === 'string' && isHexStrict(block) && block.length === 66
				? await RpcMethods.getUncleCountByBlockHash(this._requestManager, block)
				: await RpcMethods.getUncleCountByBlockNumber(this._requestManager, block);

		return returnType === undefined
			? this._options.defaultReturnType === undefined
				? response
				: convertToValidType(response, this._options.defaultReturnType)
			: convertToValidType(response, returnType);
	}

	// public async getCode(
	// 	address: HexString,
	// 	block?: ValidTypes | PredefinedBlockNumbers,
	// ): Promise<HexString> {
	// 	return RpcMethods.getCode(
	// 		this._requestManager,
	// 		address,
	// 		block ?? this._options.defaultBlock,
	// 	);
	// }

	// // TODO Figure out type of data
	// public async sign(address: HexString, data: HexString): Promise<HexString> {
	// 	return RpcMethods.sign(this._requestManager, address, data);
	// }

	// // TODO Check for defaults such as gas
	// public async signTransaction(transaction: Transaction): Promise<HexString> {
	// 	return RpcMethods.signTransaction(this._requestManager, transaction);
	// }

	// // TODO Check for defaults such as gas
	// public async sendTransaction(transaction: Transaction): Promise<HexString> {
	// 	return RpcMethods.sendTransaction(this._requestManager, transaction);
	// }

	// public async sendRawTransaction(signedTransaction: HexString): Promise<HexString> {
	// 	return RpcMethods.sendRawTransaction(this._requestManager, signedTransaction);
	// }

	// // TODO Check for defaults such as gas
	// public async call(
	// 	transaction: Transaction,
	// 	block?: ValidTypes | PredefinedBlockNumbers,
	// 	options?: Web3EthMethodOptions,
	// ): Promise<HexString> {
	// 	return RpcMethods.call(
	// 		this._requestManager,
	// 		transaction,
	// 		block ?? this._options.defaultBlock,
	// 		options,
	// 	);
	// }

	// // TODO Check for defaults such as gas
	// public async estimateGas(
	// 	transaction: Transaction,
	// 	block?: ValidTypes | PredefinedBlockNumbers,
	// 	options?: Web3EthMethodOptions,
	// ): Promise<HexString> {
	// 	return RpcMethods.estimateGas(
	// 		this._requestManager,
	// 		transaction,
	// 		block ?? this._options.defaultBlock,
	// 		options,
	// 	);
	// }
}
