// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import { EthExecutionAPI, TransactionWithSender } from 'web3-common';
import { SupportedProviders, Web3ConfigOptions, Web3Context } from 'web3-core';
import {
	BlockNumberOrTag,
	ValidTypes,
	Address,
	Uint256,
	HexString32Bytes,
	HexStringBytes,
	Uint,
	HexString8Bytes,
	Filter,
} from 'web3-utils';

// import { Transaction, BlockFormatted } from './types';
import { BlockFormatted } from './types';
import * as rpcMethods from './rpc_methods';
import * as rpcMethodsWrappers from './rpc_method_wrappers';

export default class Web3Eth {
	public readonly web3Context: Web3Context<EthExecutionAPI>;

	public constructor(
		provider: SupportedProviders<EthExecutionAPI> | string,
		options?: Partial<Web3ConfigOptions>,
	) {
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
		return rpcMethodsWrappers.getHashRate(this.web3Context, returnType);
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getGasPrice(this.web3Context, returnType);
	}

	public async getAccounts() {
		return rpcMethodsWrappers.getAccounts(this.web3Context);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockNumber(this.web3Context, returnType);
	}

	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBalance(this.web3Context, address, blockNumber, returnType);
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
		return rpcMethodsWrappers.getBlock(this.web3Context, block, hydrated, returnType);
	}

	public async getBlockTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockTransactionCount(this.web3Context, block, returnType);
	}

	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockUncleCount(this.web3Context, block, returnType);
	}

	public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		uncleIndex: Uint,
		returnType?: ReturnType,
	): Promise<BlockFormatted<ReturnType>> {
		return rpcMethodsWrappers.getUncle(this.web3Context, block, uncleIndex, returnType);
	}

	public async getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransaction(this.web3Context, transactionHash, returnType);
	}

	// TODO Can't find in spec
	// public async getPendingTransactions() {

	// }

	public async getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.web3Context.defaultBlock,
		transactionIndex: Uint,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionFromBlock(
			this.web3Context,
			block,
			transactionIndex,
			returnType,
		);
	}

	public async getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionReceipt(
			this.web3Context,
			transactionHash,
			returnType,
		);
	}

	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionCount(
			this.web3Context,
			address,
			blockNumber,
			returnType,
		);
	}

	// TODO Needs to convert input to hex string
	// public async sendTransaction(transaction: Transaction) {
	// 	return rpcMethodsWrappers.sendTransaction(this.web3Context, transaction);
	// }

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return rpcMethods.sendRawTransaction(this.web3Context.requestManager, transaction);
	}

	// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
	// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
	public async sign(message: HexStringBytes, address: Address) {
		return rpcMethods.sign(this.web3Context.requestManager, message, address);
	}

	// TODO Needs to convert input to hex string
	// public async signTransaction(transaction: Transaction) {
	// 	return rpcMethodsWrappers.signTransaction(this.web3Context, transaction);
	// }

	// TODO Decide what to do with transaction.to
	// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
	// public async call(
	// 	transaction: Transaction & { to: Address },
	// 	blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
	// ) {
	// 	return rpcMethodsWrappers.call(this.web3Context, transaction, blockNumber);
	// }

	// TODO Missing param
	public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.estimateGas(
			this.web3Context,
			transaction,
			blockNumber,
			returnType,
		);
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

	public async getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag = this.web3Context.defaultBlock,
		rewardPercentiles: number[],
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getFeeHistory(
			this.web3Context,
			blockCount,
			newestBlock,
			rewardPercentiles,
			returnType,
		);
	}
}
