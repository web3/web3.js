// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import { EthExecutionAPI, TransactionWithSender } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	Address,
	BlockNumberOrTag,
	convertObjectPropertiesToValidType,
	convertToValidType,
	HexString32Bytes,
	Uint,
	ValidReturnTypes,
	ValidTypes,
} from 'web3-utils';
import { isHexString32Bytes } from 'web3-validator';
import {
	convertibleBlockProperties,
	convertibleFeeHistoryResultProperties,
	convertibleReceiptInfoProperties,
	convertibleTransactionInfoProperties,
} from './convertible_properties';

import * as rpcMethods from './rpc_methods';
import { BlockFormatted } from './types';

export async function getHashRate<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getHashRate(web3Context.requestManager);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getGasPrice<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getGasPrice(web3Context.requestManager);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export const getAccounts = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getAccounts(web3Context.requestManager);

export async function getBlockNumber<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getBlockNumber(web3Context.requestManager);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getBalance<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getBalance(web3Context.requestManager, address, blockNumber);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	hydrated = false,
	returnType?: ReturnType,
): Promise<BlockFormatted<ReturnType>> {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getBlockByHash(web3Context.requestManager, block, hydrated)
		: await rpcMethods.getBlockByNumber(web3Context.requestManager, block, hydrated);

	// @ts-expect-error Having a problem determining if BlockFormatted<ReturnType> is correct type
	return convertObjectPropertiesToValidType(
		response,
		convertibleBlockProperties,
		returnType ?? web3Context.defaultReturnType,
	);
}

export async function getBlockTransactionCount<
	ReturnType extends ValidTypes = ValidTypes.HexString,
>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnType?: ReturnType,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getBlockTransactionCountByHash(web3Context.requestManager, block)
		: await rpcMethods.getBlockTransactionCountByNumber(web3Context.requestManager, block);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getBlockUncleCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	returnType?: ReturnType,
) {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getUncleCountByBlockHash(web3Context.requestManager, block)
		: await rpcMethods.getUncleCountByBlockNumber(web3Context.requestManager, block);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getUncle<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag = web3Context.defaultBlock,
	uncleIndex: Uint,
	returnType?: ReturnType,
): Promise<BlockFormatted<ReturnType>> {
	const response = isHexString32Bytes(block)
		? await rpcMethods.getUncleByBlockHashAndIndex(
				web3Context.requestManager,
				block,
				uncleIndex,
		  )
		: await rpcMethods.getUncleByBlockNumberAndIndex(
				web3Context.requestManager,
				block,
				uncleIndex,
		  );

	// @ts-expect-error Having a problem determining if BlockFormatted<ReturnType> is correct type
	return convertObjectPropertiesToValidType(
		response,
		convertibleBlockProperties,
		returnType ?? web3Context.defaultReturnType,
	);
}

export async function getTransaction<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getTransactionByHash(
		web3Context.requestManager,
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
				returnType ?? web3Context.defaultReturnType,
		  );
}

// TODO Can't find in spec
// export async function getPendingTransactions() {
// }

export async function getTransactionFromBlock<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	block: HexString32Bytes | BlockNumberOrTag | undefined,
	transactionIndex: Uint,
	returnType?: ReturnType,
) {
	const blockOrDefault = block ?? web3Context.defaultBlock;
	const response = isHexString32Bytes(blockOrDefault)
		? await rpcMethods.getTransactionByBlockHashAndIndex(
				web3Context.requestManager,
				blockOrDefault,
				transactionIndex,
		  )
		: await rpcMethods.getTransactionByBlockNumberAndIndex(
				web3Context.requestManager,
				blockOrDefault,
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
				returnType ?? web3Context.defaultReturnType,
		  );
}

export async function getTransactionReceipt<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	transactionHash: HexString32Bytes,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getTransactionReceipt(
		web3Context.requestManager,
		transactionHash,
	);

	return response === null
		? response
		: convertObjectPropertiesToValidType(
				response,
				convertibleReceiptInfoProperties,
				returnType ?? web3Context.defaultReturnType,
		  );
}

export async function getTransactionCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	address: Address,
	blockNumber: BlockNumberOrTag | undefined,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getTransactionCount(
		web3Context.requestManager,
		address,
		blockNumber ?? web3Context.defaultBlock,
	);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

// TODO Needs to convert input to hex string
// public async sendTransaction(transaction: Transaction) {
// 	return rpcMethods.sendTransaction(this.web3Context.requestManager, transaction);
// }

// TODO Needs to convert input to hex string
// public async signTransaction(transaction: Transaction) {
// 	return rpcMethods.signTransaction(this.web3Context.requestManager, transaction);
// }

// TODO Decide what to do with transaction.to
// https://github.com/ChainSafe/web3.js/pull/4525#issuecomment-982330076
// public async call(
// 	transaction: Transaction & { to: Address },
// 	blockNumber: BlockNumberOrTag = this.web3Context.defaultBlock,
// ) {
// 	return rpcMethods.call(this.web3Context.requestManager, transaction, blockNumber);
// }

// TODO Missing param
export async function estimateGas<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	transaction: Partial<TransactionWithSender>,
	blockNumber: BlockNumberOrTag = web3Context.defaultBlock,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.estimateGas(
		web3Context.requestManager,
		transaction,
		blockNumber,
	);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
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

export async function getFeeHistory<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<EthExecutionAPI>,
	blockCount: Uint,
	newestBlock: BlockNumberOrTag = web3Context.defaultBlock,
	rewardPercentiles: number[],
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getFeeHistory(
		web3Context.requestManager,
		blockCount,
		newestBlock,
		rewardPercentiles,
	);

	return convertObjectPropertiesToValidType(
		response,
		convertibleFeeHistoryResultProperties,
		returnType ?? web3Context.defaultReturnType,
	);
}
