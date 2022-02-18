// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import { EthExecutionAPI, TransactionWithSender } from 'web3-common';
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
import * as rpcMethodsWrappers from './rpc_method_wrappers';

export default class Web3Eth extends Web3Context<EthExecutionAPI> {
	public async getProtocolVersion() {
		return rpcMethodsWrappers.getProtocolVersion(this);
	}

	public async isSyncing() {
		return rpcMethodsWrappers.isSyncing(this);
	}

	public async getCoinbase() {
		return rpcMethodsWrappers.getCoinbase(this);
	}

	public async isMining() {
		return rpcMethodsWrappers.isMining(this);
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
		return rpcMethodsWrappers.getAccounts(this);
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
		return rpcMethodsWrappers.getStorageAt(this, address, storageSlot, blockNumber);
	}

	public async getCode(address: Address, blockNumber: BlockNumberOrTag = this.defaultBlock) {
		return rpcMethodsWrappers.getCode(this, address, blockNumber);
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

	// TODO Can't find in spec
	// public async getPendingTransactions() {

	// }

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
		return rpcMethodsWrappers.sendSignedTransaction(this, transaction);
	}

	// TODO address can be an address or the index of a local wallet in web3.eth.accounts.wallet
	// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#sign
	public async sign(message: HexStringBytes, address: Address) {
		return rpcMethodsWrappers.sign(this, message, address);
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
		return rpcMethodsWrappers.getPastLogs(this, {
			...filter,
			// These defaults are carried over from 1.x
			// https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html?highlight=sendTransaction#getpastlogs
			fromBlock: filter.fromBlock ?? this.defaultBlock,
			toBlock: filter.toBlock ?? this.defaultBlock,
		});
	}

	public async getWork() {
		return rpcMethodsWrappers.getWork(this);
	}

	public async submitWork(
		nonce: HexString8Bytes,
		seedHash: HexString32Bytes,
		difficulty: HexString32Bytes,
	) {
		return rpcMethodsWrappers.submitWork(this, nonce, seedHash, difficulty);
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
