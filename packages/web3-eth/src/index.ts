// import { PredefinedBlockNumbers, Web3BaseProvider, HexString } from 'web3-common';
// import { Web3Config, Web3RequestManager } from 'web3-core';
// import { isHexStrict } from 'web3-utils';

// import * as RpcMethods from './rpc_methods';
// import { EthSyncingResponse, NumberString, ValidTypes, Transaction } from './types';

// // TODO Duplicate
// enum ReturnTypes {
// 	HexString = 'HexString',
// 	Number = 'Number',
// 	NumberString = 'NumberString',
// 	BigInt = 'BigInt',
// }

// interface Web3EthOptions extends Web3Config {
// 	defaultReturnType: ReturnTypes;
// }

// // TODO Duplicate
// interface Web3EthMethodOptions {
// 	returnType?: ReturnTypes;
// }

// export class Web3Eth {
// 	private readonly _requestManager: Web3RequestManager;
// 	private readonly _options: Web3EthOptions;

// 	constructor(provider: Web3BaseProvider | string, options: Web3EthOptions) {
// 		this._requestManager = new Web3RequestManager(provider);
// 		this._options = options;
// 	}

// 	public async getProtocolVersion<ReturnType = NumberString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getProtocolVersion(this._requestManager, options);
// 	}

// 	public async getSyncingResponse<ReturnType = HexString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<EthSyncingResponse<ReturnType>> {
// 		return RpcMethods.getSyncing(this._requestManager, options);
// 	}

// 	public async getCoinbase<ReturnType = HexString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getCoinbase(this._requestManager, options);
// 	}

// 	public async getMining(): Promise<boolean> {
// 		return RpcMethods.getMining(this._requestManager);
// 	}

// 	public async getHashRate<ReturnType = HexString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getHashRate(this._requestManager, options);
// 	}

// 	public async getGasPrice<ReturnType = HexString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getGasPrice(this._requestManager, options);
// 	}

// 	public async getAccounts(): Promise<HexString[]> {
// 		return RpcMethods.getAccounts(this._requestManager);
// 	}

// 	public async getBlockNumber<ReturnType = HexString>(
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getBlockNumber(this._requestManager, options);
// 	}

// 	// TODO Discuss the use of multiple optional parameters
// 	public async getBalance<ReturnType = HexString>(
// 		address: HexString,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getBalance(
// 			this._requestManager,
// 			address,
// 			block ?? this._options.defaultBlock,
// 			options,
// 		);
// 	}

// 	// TODO Discuss the use of multiple optional parameters
// 	public async getStorageAt<ReturnType = HexString>(
// 		storageAddress: HexString,
// 		storagePosition: ValidTypes,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getStorageAt(
// 			this._requestManager,
// 			storageAddress,
// 			storagePosition,
// 			block ?? this._options.defaultBlock,
// 			options,
// 		);
// 	}

// 	// TODO Discuss the use of multiple optional parameters
// 	public async getTransactionCount<ReturnType = HexString>(
// 		address: HexString,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		return RpcMethods.getTransactionCount(
// 			this._requestManager,
// 			address,
// 			block ?? this._options.defaultBlock,
// 			options,
// 		);
// 	}

// 	public async getBlockTransactionCount<ReturnType = HexString>(
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		const _block = block ?? this._options.defaultBlock;

// 		// Checking if _block is a block hash or number
// 		if (typeof _block === 'string' && isHexStrict(_block) && _block.length === 66)
// 			return RpcMethods.getBlockTransactionCountByHash(this._requestManager, _block, options);

// 		return RpcMethods.getBlockTransactionCountByNumber(this._requestManager, _block, options);
// 	}

// 	public async getBlockUncleCount<ReturnType = HexString>(
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<ReturnType> {
// 		const _block = block ?? this._options.defaultBlock;

// 		// Checking if block is a block hash or number
// 		if (typeof _block === 'string' && isHexStrict(_block) && _block.length === 66)
// 			return RpcMethods.getUncleCountByBlockHash(this._requestManager, _block, options);

// 		return RpcMethods.getUncleCountByBlockNumber(this._requestManager, _block, options);
// 	}

// 	public async getCode(
// 		address: HexString,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 	): Promise<HexString> {
// 		return RpcMethods.getCode(
// 			this._requestManager,
// 			address,
// 			block ?? this._options.defaultBlock,
// 		);
// 	}

// 	// TODO Figure out type of data
// 	public async sign(address: HexString, data: HexString): Promise<HexString> {
// 		return RpcMethods.sign(this._requestManager, address, data);
// 	}

// 	// TODO Check for defaults such as gas
// 	public async signTransaction(transaction: Transaction): Promise<HexString> {
// 		return RpcMethods.signTransaction(this._requestManager, transaction);
// 	}

// 	// TODO Check for defaults such as gas
// 	public async sendTransaction(transaction: Transaction): Promise<HexString> {
// 		return RpcMethods.sendTransaction(this._requestManager, transaction);
// 	}

// 	public async sendRawTransaction(signedTransaction: HexString): Promise<HexString> {
// 		return RpcMethods.sendRawTransaction(this._requestManager, signedTransaction);
// 	}

// 	// TODO Check for defaults such as gas
// 	public async call(
// 		transaction: Transaction,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<HexString> {
// 		return RpcMethods.call(
// 			this._requestManager,
// 			transaction,
// 			block ?? this._options.defaultBlock,
// 			options,
// 		);
// 	}

//     // TODO Check for defaults such as gas
// 	public async estimateGas(
// 		transaction: Transaction,
// 		block?: ValidTypes | PredefinedBlockNumbers,
// 		options?: Web3EthMethodOptions,
// 	): Promise<HexString> {
// 		return RpcMethods.estimateGas(
// 			this._requestManager,
// 			transaction,
// 			block ?? this._options.defaultBlock,
// 			options,
// 		);
// 	}
// }
