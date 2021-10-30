import { BlockNumberOrTag, SyncingStatus, TransactionWithSender, Block, TransactionInfo, ReceiptInfo } from 'web3-common';
import { Web3RequestManager } from 'web3-core';

export async function getProtocolVersion(requestManager: Web3RequestManager): Promise<string> {
	return await requestManager.send<'eth_protocolVersion'>({
		method: 'eth_protocolVersion',
		params: [],
	});
}

export async function getSyncing(requestManager: Web3RequestManager): Promise<SyncingStatus> {
	return await requestManager.send<'eth_syncing'>({
		method: 'eth_syncing',
		params: [],
	});
}

export async function getCoinbase(requestManager: Web3RequestManager): Promise<string> {
	return await requestManager.send<'eth_coinbase'>({
		method: 'eth_coinbase',
		params: [],
	});
}

export async function getMining(requestManager: Web3RequestManager): Promise<boolean> {
	return await requestManager.send<'eth_mining'>({
		method: 'eth_mining',
		params: [],
	});
}

export async function getHashRate(requestManager: Web3RequestManager): Promise<string> {
	return await requestManager.send<'eth_hashrate'>({
		method: 'eth_hashrate',
		params: [],
	});
}

export async function getGasPrice(requestManager: Web3RequestManager): Promise<string> {
	return await requestManager.send<'eth_gasPrice'>({
		method: 'eth_gasPrice',
		params: [],
	});
}

export async function getAccounts(requestManager: Web3RequestManager): Promise<string[]> {
	return await requestManager.send<'eth_accounts'>({
		method: 'eth_accounts',
		params: [],
	});
}

export async function getBlockNumber(requestManager: Web3RequestManager): Promise<string> {
	return await requestManager.send<'eth_blockNumber'>({
		method: 'eth_blockNumber',
		params: [],
	});
}

export async function getBalance(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getBalance'>({
		method: 'eth_getBalance',
		params: [address, block],
	});
}

export async function getStorageAt(
	requestManager: Web3RequestManager,
	storageAddress: string,
	storagePosition: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getStorageAt'>({
		method: 'eth_getStorageAt',
		params: [storageAddress, storagePosition, block],
	});
}

export async function getTransactionCount(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getTransactionCount'>({
		method: 'eth_getTransactionCount',
		params: [address, block],
	});
}

export async function getBlockTransactionCountByHash(
	requestManager: Web3RequestManager,
	blockHash: string,
): Promise<string> {
	return await requestManager.send<'eth_getBlockTransactionCountByHash'>({
		method: 'eth_getBlockTransactionCountByHash',
		params: [blockHash],
	});
}

export async function getBlockTransactionCountByNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getBlockTransactionCountByNumber'>({
		method: 'eth_getBlockTransactionCountByNumber',
		params: [block],
	});
}

export async function getUncleCountByBlockHash(
	requestManager: Web3RequestManager,
	blockHash: string,
): Promise<string> {
	return await requestManager.send<'eth_getUncleCountByBlockHash'>({
		method: 'eth_getUncleCountByBlockHash',
		params: [blockHash],
	});
}

export async function getUncleCountByBlockNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getUncleCountByBlockNumber'>({
		method: 'eth_getUncleCountByBlockNumber',
		params: [block],
	});
}

export async function getCode(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_getCode'>({
		method: 'eth_getCode',
		params: [address, block],
	});
}

export async function sign(
	requestManager: Web3RequestManager,
	address: string,
	data: string,
): Promise<string> {
	return await requestManager.send<'eth_sign'>({
		method: 'eth_sign',
		params: [address, data],
	});
}

export async function signTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
): Promise<string> {
	return await requestManager.send<'eth_signTransaction'>({
		method: 'eth_signTransaction',
		params: [transaction],
	});
}

export async function sendTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
): Promise<string> {
	return await requestManager.send<'eth_sendTransaction'>({
		method: 'eth_sendTransaction',
		params: [transaction],
	});
}

export async function sendRawTransaction(
	requestManager: Web3RequestManager,
	signedTransaction: string,
): Promise<string> {
	return await requestManager.send<'eth_sendRawTransaction'>({
		method: 'eth_sendRawTransaction',
		params: [signedTransaction],
	});
}

export async function call(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
	block: BlockNumberOrTag,
): Promise<string> {
	return await requestManager.send<'eth_call'>({
		method: 'eth_call',
		params: [transaction, block],
	});
}

export async function estimateGas(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
	block: BlockNumberOrTag,
): Promise<string> {
    return await requestManager.send<'eth_estimateGas'>({
		method: 'eth_estimateGas',
		params: [transaction, block],
	});
}

export async function getBlockByHash(
	requestManager: Web3RequestManager,
	blockHash: string,
    hydrated: boolean,
): Promise<Block> {
	return await requestManager.send<'eth_getBlockByHash'>({
		method: 'eth_getBlockByHash',
		params: [blockHash, hydrated],
	});
}

export async function getBlockByNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
): Promise<Block> {
	return await requestManager.send<'eth_getBlockByNumber'>({
		method: 'eth_getBlockByNumber',
		params: [block],
	});
}

export async function getTransactionByHash(
	requestManager: Web3RequestManager,
	transactionHash: string,
): Promise<TransactionInfo> {
	return await requestManager.send<'eth_getTransactionByHash'>({
		method: 'eth_getTransactionByHash',
		params: [transactionHash],
	});
}

export async function getTransactionByBlockHashAndIndex(
	requestManager: Web3RequestManager,
	blockHash: string,
    transactionIndex: string
): Promise<TransactionInfo> {
	return await requestManager.send<'eth_getTransactionByBlockHashAndIndex'>({
		method: 'eth_getTransactionByBlockHashAndIndex',
		params: [blockHash, transactionIndex],
	});
}

export async function getTransactionByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
	blockNumber: string,
    transactionIndex: string
): Promise<TransactionInfo> {
	return await requestManager.send<'eth_getTransactionByBlockNumberAndIndex'>({
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: [blockNumber, transactionIndex],
	});
}

export async function getTransactionReceipt(
	requestManager: Web3RequestManager,
    transactionHash: string
): Promise<ReceiptInfo> {
	return await requestManager.send<'eth_getTransactionReceipt'>({
		method: 'eth_getTransactionReceipt',
		params: [transactionHash],
	});
}

export async function getUncleByBlockHashAndIndex(
	requestManager: Web3RequestManager,
    blockHash: string,
    uncleIndex: string
): Promise<Block> {
	return await requestManager.send<'eth_getUncleByBlockHashAndIndex'>({
		method: 'eth_getUncleByBlockHashAndIndex',
		params: [blockHash, uncleIndex],
	});
}

export async function getUncleByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
    blockNumber: BlockNumberOrTag,
    uncleIndex: string
): Promise<Block> {
	return await requestManager.send<'eth_getUncleByBlockNumberAndIndex'>({
		method: 'eth_getUncleByBlockNumberAndIndex',
		params: [blockNumber, uncleIndex],
	});
}
