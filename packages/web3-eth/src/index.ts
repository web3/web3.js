// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import { TransactionWithSender } from 'web3-common';
import { Web3Context } from 'web3-core';
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

import { BlockFormatted } from './types';
import * as rpcMethods from './rpc_methods';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { Web3EthExecutionAPI } from './web3_eth_execution_api';

export default class Web3Eth extends Web3Context<Web3EthExecutionAPI> {
	public async getProtocolVersion() {
		return rpcMethods.getProtocolVersion(this.requestManager);
	}

	public async isSyncing() {
		return rpcMethods.getSyncing(this.requestManager);
	}

	public async getCoinbase() {
		return rpcMethods.getCoinbase(this.requestManager);
	}

	public async isMining() {
		return rpcMethods.getMining(this.requestManager);
	}

	public async getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getHashRate(this, returnType);
	}

	public async getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getGasPrice(this, returnType);
	}

	public async getAccounts() {
		return rpcMethods.getAccounts(this.requestManager);
	}

	public async getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockNumber(this, returnType);
	}

	public async getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBalance(this, address, blockNumber, returnType);
	}

	public async getStorageAt(
		address: Address,
		storageSlot: Uint256,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
	) {
		return rpcMethods.getStorageAt(this.requestManager, address, storageSlot, blockNumber);
	}

	public async getCode(address: Address, blockNumber: BlockNumberOrTag = this.defaultBlock) {
		return rpcMethods.getCode(this.requestManager, address, blockNumber);
	}

	public async getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		hydrated = false,
		returnType?: ReturnType,
	): Promise<BlockFormatted<ReturnType>> {
		return rpcMethodsWrappers.getBlock(this, block, hydrated, returnType);
	}

	public async getBlockTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockTransactionCount(this, block, returnType);
	}

	public async getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getBlockUncleCount(this, block, returnType);
	}

	public async getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		uncleIndex: Uint,
		returnType?: ReturnType,
	): Promise<BlockFormatted<ReturnType>> {
		return rpcMethodsWrappers.getUncle(this, block, uncleIndex, returnType);
	}

	public async getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransaction(this, transactionHash, returnType);
	}

	public async getPendingTransactions<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getPendingTransactions(this, returnType);
	}

	public async getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		transactionIndex: Uint,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionFromBlock(
			this,
			block,
			transactionIndex,
			returnType,
		);
	}

	public async getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transactionHash: HexString32Bytes,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionReceipt(this, transactionHash, returnType);
	}

	public async getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getTransactionCount(this, address, blockNumber, returnType);
	}

	// TODO Needs to convert input to hex string
	// public async sendTransaction(transaction: Transaction) {
	// 	return rpcMethodsWrappers.sendTransaction(this, transaction);
	// }

	public async sendSignedTransaction(transaction: HexStringBytes) {
		return rpcMethods.sendRawTransaction(this.requestManager, transaction);
	}

	// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
	// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
	public async sign(message: HexStringBytes, address: Address) {
		return rpcMethods.sign(this.requestManager, message, address);
	}

	// TODO Needs to convert input to hex string
	// public async signTransaction(transaction: Transaction) {
	// 	return rpcMethodsWrappers.signTransaction(this, transaction);
	// }

	// TODO Decide what to do with transaction.to
	// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
	// public async call(
	// 	transaction: Transaction & { to: Address },
	// 	blockNumber: BlockNumberOrTag = this.defaultBlock,
	// ) {
	// 	return rpcMethodsWrappers.call(this, transaction, blockNumber);
	// }

	// TODO Missing param
	public async estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
		transaction: Partial<TransactionWithSender>,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.estimateGas(this, transaction, blockNumber, returnType);
	}

	public async getPastLogs(filter: Filter) {
		return rpcMethods.getLogs(this.requestManager, {
			...filter,
			// These defaults are carried over from 1.x
			// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#getpastlogs
			fromBlock: filter.fromBlock ?? this.defaultBlock,
			toBlock: filter.toBlock ?? this.defaultBlock,
		});
	}

	public async getWork() {
		return rpcMethods.getWork(this.requestManager);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return rpcMethods.submitWork(this.requestManager, nonce, seedHash, difficulty);
	}

	// TODO - Format addresses
	public async requestAccounts() {
		return rpcMethods.requestAccounts(this.requestManager);
	}

	public async getChainId<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getChainId(this, returnType);
	}

	public async getNodeInfo() {
		return rpcMethods.getNodeInfo(this.requestManager);
	}

	// TODO - Format input
	public async getProof<ReturnType extends ValidTypes = ValidTypes.HexString>(
		address: Address,
		storageKey: HexString32Bytes,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getProof(this, address, storageKey, blockNumber, returnType);
	}

	public async getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
		blockCount: Uint,
		newestBlock: BlockNumberOrTag = this.defaultBlock,
		rewardPercentiles: number[],
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getFeeHistory(
			this,
			blockCount,
			newestBlock,
			rewardPercentiles,
			returnType,
		);
	}
}
