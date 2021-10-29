import {
	InvalidResponseError,
	JsonRpcResponse,
	ResponseError,
	PredefinedBlockNumbers,
} from 'web3-common';
import { Web3RequestManager } from 'web3-core';
import { EthSyncingResponse, HexString, NumberString, ValidTypes, Transaction } from './types';

enum ReturnTypes {
	HexString = 'HexString',
	Number = 'Number',
	NumberString = 'NumberString',
	BigInt = 'BigInt',
}

interface Web3EthMethodOptions {
	returnType?: ReturnTypes;
}

/**
 * For all below methods, if (options.returnType === undefined)
 * then the return value is what's specified by JSON RPC spec:
 * https://eth.wiki/json-rpc/API
 */

export async function getProtocolVersion<ReturnType = NumberString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<NumberString>, []>({
		method: 'eth_protocolVersion',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getSyncing<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<EthSyncingResponse<ReturnType>> {
	const response = await requestManager.send<JsonRpcResponse<EthSyncingResponse<ReturnType>>, []>(
		{
			method: 'eth_syncing',
		},
	);

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getCoinbase<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, []>({
		method: 'eth_coinbase',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getMining(requestManager: Web3RequestManager): Promise<boolean> {
	const response = await requestManager.send<JsonRpcResponse<boolean>, []>({
		method: 'eth_mining',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function getHashRate<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, []>({
		method: 'eth_hashrate',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getGasPrice<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, []>({
		method: 'eth_gasPrice',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getAccounts(requestManager: Web3RequestManager): Promise<HexString[]> {
	const response = await requestManager.send<JsonRpcResponse<HexString[]>, []>({
		method: 'eth_accounts',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function getBlockNumber<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, []>({
		method: 'eth_blockNumber',
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getBalance<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	address: HexString,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<
		JsonRpcResponse<ReturnType>,
		[HexString, HexString | PredefinedBlockNumbers]
	>({
		method: 'eth_getBalance',
		params: [address, block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getStorageAt<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	storageAddress: HexString,
	storagePosition: ValidTypes,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	// TODO convert storagePosition to integer
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<
		JsonRpcResponse<ReturnType>,
		[HexString, ValidTypes, ValidTypes | PredefinedBlockNumbers]
	>({
		method: 'eth_getStorageAt',
		params: [storageAddress, storagePosition, block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getTransactionCount<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	address: HexString,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<
		JsonRpcResponse<ReturnType>,
		[HexString, ValidTypes | PredefinedBlockNumbers]
	>({
		method: 'eth_getTransactionCount',
		params: [address, block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getBlockTransactionCountByHash<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	blockHash: HexString,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, [HexString]>({
		method: 'eth_getBlockTransactionCountByHash',
		params: [blockHash],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getBlockTransactionCountByNumber<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<JsonRpcResponse<ReturnType>, [HexString]>({
		method: 'eth_getBlockTransactionCountByNumber',
		params: [block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getUncleCountByBlockHash<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	blockHash: HexString,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	const response = await requestManager.send<JsonRpcResponse<ReturnType>, [HexString]>({
		method: 'eth_getUncleCountByBlockHash',
		params: [blockHash],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getUncleCountByBlockNumber<ReturnType = HexString>(
	requestManager: Web3RequestManager,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<ReturnType> {
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<JsonRpcResponse<ReturnType>, [HexString]>({
		method: 'eth_getUncleCountByBlockNumber',
		params: [block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}

export async function getCode(
	requestManager: Web3RequestManager,
	address: HexString,
	block: ValidTypes | PredefinedBlockNumbers,
): Promise<HexString> {
	// TODO convert block to hex string if not PredefinedBlockNumbers

	const response = await requestManager.send<
		JsonRpcResponse<HexString>,
		[HexString, ValidTypes | PredefinedBlockNumbers]
	>({
		method: 'eth_getCode',
		params: [address, block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

// TODO Figure out type of data
export async function sign(
	requestManager: Web3RequestManager,
	address: HexString,
	data: HexString,
): Promise<HexString> {
	const response = await requestManager.send<JsonRpcResponse<HexString>, [HexString, HexString]>({
		method: 'eth_sign',
		params: [address, data],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function signTransaction(
	requestManager: Web3RequestManager,
	transaction: Transaction,
): Promise<HexString> {
	// TODO Convert ValidTypes properties to HexString

	const response = await requestManager.send<JsonRpcResponse<HexString>, [Transaction]>({
		method: 'eth_signTransaction',
		params: [transaction],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function sendTransaction(
	requestManager: Web3RequestManager,
	transaction: Transaction,
): Promise<HexString> {
	// TODO Convert ValidTypes properties to HexString

	const response = await requestManager.send<JsonRpcResponse<HexString>, [Transaction]>({
		method: 'eth_sendTransaction',
		params: [transaction],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function sendRawTransaction(
	requestManager: Web3RequestManager,
	signedTransaction: HexString,
): Promise<HexString> {
	const response = await requestManager.send<JsonRpcResponse<HexString>, [HexString]>({
		method: 'eth_sendRawTransaction',
		params: [signedTransaction],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	return response.result;
}

export async function call(
	requestManager: Web3RequestManager,
	transaction: Transaction,
	block: ValidTypes | PredefinedBlockNumbers,
	options?: Web3EthMethodOptions,
): Promise<HexString> {
	// TODO Convert ValidTypes properties to HexString

	const response = await requestManager.send<
		JsonRpcResponse<HexString>,
		[Transaction, ValidTypes | PredefinedBlockNumbers]
	>({
		method: 'eth_call',
		params: [transaction, block],
	});

	if (response instanceof ResponseError) throw response;
	if (response.result === undefined) throw new InvalidResponseError(response);

	if (options?.returnType !== undefined) {
		// TODO convert result
	}

	return response.result;
}
