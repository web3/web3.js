// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

// import { TransactionCall, TransactionWithSender, Web3BaseProvider } from 'web3-common';
import { EthExecutionAPI, Web3BaseProvider, TransactionWithSender } from 'web3-common';
import { ConfigOptions, Web3Context } from 'web3-core';
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
	isNumbers,
	numberToHex,
} from 'web3-utils';

import { Transaction, BlockFormatted, ChainNames, HardForks } from './types';
import {
	convertibleBlockProperties,
	convertibleFeeHistoryResultProperties,
	convertibleReceiptInfoProperties,
	convertibleTransactionCustomChainProperties,
	convertibleTransactionInfoProperties,
	convertibleTransactionProperties,
} from './convertible_properties';

import * as rpcMethods from './rpc_methods';

export default class Web3Eth {
	public readonly web3Context: Web3Context<EthExecutionAPI>;

	public constructor(provider: Web3BaseProvider | string, options?: Partial<ConfigOptions>) {
		this.web3Context = new Web3Context(provider, options);
	}

	public async getProtocolVersion() {
		return rpcMethods.getProtocolVersion(this.web3Context.requestManager);
	}

	public async isSyncing() {
		return rpcMethods.getSyncing(this.web3Context.requestManager);
	}

	public async getCoinbase() {
		return rpcMethods.getCoinbase(this.web3Context.requestManager);
	}

	public async isMining() {
		return rpcMethods.getMining(this.web3Context.requestManager);
	}

	public async getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getHashRate(this.web3Context.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getGasPrice(this.web3Context.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

    public async getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag = this.web3Context.defaultBlock,
		rewardPercentiles: number[],
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getFeeHistory(
			this.web3Context.requestManager,
			blockCount,
			newestBlock,
			rewardPercentiles,
		);

		return convertObjectPropertiesToValidType(
			response,
			convertibleFeeHistoryResultProperties,
			returnType ?? this.web3Context.defaultReturnType,
		);
	}

	public async getAccounts() {
		return rpcMethods.getAccounts(this.web3Context.requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBlockNumber(this.web3Context.requestManager);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getBalance(
			this.web3Context.requestManager,
			address,
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getStorageAt(
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
	) {
		return rpcMethods.getStorageAt(
			this.web3Context.requestManager,
			address,
			storageSlot,
			blockNumber,
		);
	}

	public async getCode(
		address: Address,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
	) {
		return rpcMethods.getCode(this.web3Context.requestManager, address, blockNumber);
	}

	public async getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		hydrated = false,
		returnType?: ReturnType,
	): Promise<BlockFormatted<ReturnType>> {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockByHash(this.web3Context.requestManager, block, hydrated)
			: await rpcMethods.getBlockByNumber(this.web3Context.requestManager, block, hydrated);

		return convertObjectPropertiesToValidType(
			response,
			convertibleBlockProperties,
			returnType ?? this.web3Context.defaultReturnType,
		);
	}

	public async getBlockTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getBlockTransactionCountByHash(
					this.web3Context.requestManager,
					block,
			  )
			: await rpcMethods.getBlockTransactionCountByNumber(
					this.web3Context.requestManager,
					block,
			  );

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleCountByBlockHash(this.web3Context.requestManager, block)
			: await rpcMethods.getUncleCountByBlockNumber(this.web3Context.requestManager, block);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		uncleIndex: Uint,
		returnType?: ReturnType,
	): Promise<BlockFormatted<ReturnType>> {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getUncleByBlockHashAndIndex(
					this.web3Context.requestManager,
					block,
					uncleIndex,
			  )
			: await rpcMethods.getUncleByBlockNumberAndIndex(
					this.web3Context.requestManager,
					block,
					uncleIndex,
			  );

		return convertObjectPropertiesToValidType(
			response,
			convertibleBlockProperties,
			returnType ?? this.web3Context.defaultReturnType,
		);
	}

	public async getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionByHash(
			this.web3Context.requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					convertibleTransactionInfoProperties,
					returnType ?? this.web3Context.defaultReturnType,
			  );
	}

	// // TODO Can't find in spec
	// // public async getPendingTransactions() {

	// // }

	public async getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		transactionIndex: Uint,
		returnType?: ReturnType,
	) {
		const response = isHexString32Bytes(block)
			? await rpcMethods.getTransactionByBlockHashAndIndex(
					this.web3Context.requestManager,
					block,
					transactionIndex,
			  )
			: await rpcMethods.getTransactionByBlockNumberAndIndex(
					this.web3Context.requestManager,
					block,
					transactionIndex,
			  );

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					convertibleTransactionInfoProperties,
					returnType ?? this.web3Context.defaultReturnType,
			  );
	}

	public async getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionReceipt(
			this.web3Context.requestManager,
			transactionHash,
		);

		return response === null
			? response
			: convertObjectPropertiesToValidType(
					response,
					convertibleReceiptInfoProperties,
					returnType ?? this.web3Context.defaultReturnType,
			  );
	}

	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.getTransactionCount(
			this.web3Context.requestManager,
			address,
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public normalizeTransaction(transaction: Transaction): Partial<TransactionWithSender> {
		const normalizedTransaction = convertObjectPropertiesToValidType(
			transaction,
			convertibleTransactionProperties,
			ValidTypes.HexString,
		);

		if (normalizedTransaction.common !== undefined) {
			if (normalizedTransaction.common.customChain === undefined)
				throw new Error('customChain needs to be defined');
			normalizedTransaction.common.customChain = convertObjectPropertiesToValidType(
				normalizedTransaction.common.customChain,
				convertibleTransactionCustomChainProperties,
				ValidTypes.HexString,
			);
		}

		return normalizedTransaction;
	}

	public async fillTransaction(transaction: Transaction): TransactionWithSender {
		const filledTransaction = { ...transaction };

		if (filledTransaction.from === undefined) {
			if (this.web3Context.defaultAccount === null)
				throw new Error('No from address specified, and no default available');
			filledTransaction.from = this.web3Context.defaultAccount;
		} else if (isNumbers(filledTransaction.from)) {
			// TODO index of a local wallet in web3.eth.accounts.wallet
			// filledTransaction.from = numberToHex(filledTransaction.from);
			throw new Error('index of account in local wallet not implemented');
		}

		// TODO Correct calculation
		if (filledTransaction.type === undefined) filledTransaction.type = '0x0';
		if (
			(filledTransaction.type === '0x0' || filledTransaction.type === '0x1') &&
			filledTransaction.gasPrice === undefined
		) {
			filledTransaction.gasPrice = await this.getGasPrice();
		} else {
			if (filledTransaction.maxPriorityFeePerGas === undefined)
				filledTransaction.maxPriorityFeePerGas = numberToHex(1000000000); // 1 Gwei
			// TODO Correct calculation
			if (filledTransaction.maxFeePerGas === undefined)
				filledTransaction.maxFeePerGas = '0x1';
		}

		if (filledTransaction.chain === undefined) filledTransaction.chain = ChainNames.MAINNET;
		if (filledTransaction.hardfork === undefined) filledTransaction.hardfork = HardForks.LONDON;

		return filledTransaction;
	}

	public normalizeAndFillTransaction(transaction: Transaction) {
		return this.fillTransaction(this.normalizeTransaction(transaction));
	}

	public async sendTransaction(transaction: Transaction) {
		return rpcMethods.sendTransaction(
			this.web3Context.requestManager,
			this.normalizeAndFillTransaction(transaction),
		);
	}

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return rpcMethods.sendRawTransaction(this.web3Context.requestManager, transaction);
	}

	// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
	// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
	public async sign(message: HexStringBytes, address: Address) {
		return rpcMethods.sign(this.web3Context.requestManager, address, message);
	}

	public async signTransaction(transaction: Transaction) {
		return rpcMethods.signTransaction(
			this.web3Context.requestManager,
			this.normalizeAndFillTransaction(transaction),
		);
	}

	// TODO Decide what to do with transaction.to
	// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
	// public async call(
	// 	transaction: Transaction & { to: Address },
	// 	blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
	// ) {
	// 	return rpcMethods.call(this.web3Context.requestManager, transaction, blockNumber);
	// }

	// TODO Missing param
	public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transaction: Transaction,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		const response = await rpcMethods.estimateGas(
			this.web3Context.requestManager,
			this.normalizeAndFillTransaction(transaction),
			blockNumber,
		);

		return convertToValidType(
			response,
			returnType ?? this.web3Context.defaultReturnType,
		) as ValidReturnTypes[ReturnType];
	}

	public async getPastLogs(filter: Filter) {
		return rpcMethods.getLogs(this.web3Context.requestManager, {
			...filter,
			// These defaults are carried over from 1.x
			// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#getpastlogs
			fromBlock: filter.fromBlock ?? this.web3Context.defaultBlock,
			toBlock: filter.toBlock ?? this.web3Context.defaultBlock,
		});
	}

	public async getWork() {
		return rpcMethods.getWork(this.web3Context.requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return rpcMethods.submitWork(this.web3Context.requestManager, nonce, seedHash, difficulty);
	}

	// // TODO
	// // public async requestAccounts() {

	// // }

	// // TODO
	// // public async getChainId() {

	// // }

	// // TODO
	// // public async getNodeInfo() {

	// // }

	// // TODO
	// // public async getProof() {

	// // }
}
