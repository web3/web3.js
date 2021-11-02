import {
	BlockNumberOrTag,
	SyncingStatus,
	TransactionWithSender,
	Block,
	TransactionInfo,
	ReceiptInfo,
	Filter,
	FilterResults,
} from 'web3-common';
import { Web3RequestManager } from 'web3-core';

export async function getProtocolVersion(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_protocolVersion'>({
		method: 'eth_protocolVersion',
		params: [],
	});
}

export async function getSyncing(requestManager: Web3RequestManager): Promise<SyncingStatus> {
	return requestManager.send<'eth_syncing'>({
		method: 'eth_syncing',
		params: [],
	});
}

export async function getCoinbase(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_coinbase'>({
		method: 'eth_coinbase',
		params: [],
	});
}

export async function getMining(requestManager: Web3RequestManager): Promise<boolean> {
	return requestManager.send<'eth_mining'>({
		method: 'eth_mining',
		params: [],
	});
}

export async function getHashRate(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_hashrate'>({
		method: 'eth_hashrate',
		params: [],
	});
}

export async function getGasPrice(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_gasPrice'>({
		method: 'eth_gasPrice',
		params: [],
	});
}

export async function getAccounts(requestManager: Web3RequestManager): Promise<string[]> {
	return requestManager.send<'eth_accounts'>({
		method: 'eth_accounts',
		params: [],
	});
}

export async function getBlockNumber(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_blockNumber'>({
		method: 'eth_blockNumber',
		params: [],
	});
}

export async function getBalance(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_getBalance'>({
		method: 'eth_getBalance',
		params: [address, block],
	});
}

// TODO https://github.com/ethereum/execution-apis/issues/95
export async function getStorageAt(
	requestManager: Web3RequestManager,
	storageAddress: string,
	storagePosition: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_getStorageAt'>({
		method: 'eth_getStorageAt',
		params: [storageAddress, storagePosition, block],
	});
}

export async function getTransactionCount(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_getTransactionCount'>({
		method: 'eth_getTransactionCount',
		params: [address, block],
	});
}

export async function getBlockTransactionCountByHash(
	requestManager: Web3RequestManager,
	blockHash: string,
): Promise<string[]> {
	return requestManager.send<'eth_getBlockTransactionCountByHash'>({
		method: 'eth_getBlockTransactionCountByHash',
		params: [blockHash],
	});
}

export async function getBlockTransactionCountByNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
): Promise<string[]> {
	return requestManager.send<'eth_getBlockTransactionCountByNumber'>({
		method: 'eth_getBlockTransactionCountByNumber',
		params: [block],
	});
}

export async function getUncleCountByBlockHash(
	requestManager: Web3RequestManager,
	blockHash: string,
): Promise<string[]> {
	return requestManager.send<'eth_getUncleCountByBlockHash'>({
		method: 'eth_getUncleCountByBlockHash',
		params: [blockHash],
	});
}

export async function getUncleCountByBlockNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
): Promise<string[]> {
	return requestManager.send<'eth_getUncleCountByBlockNumber'>({
		method: 'eth_getUncleCountByBlockNumber',
		params: [block],
	});
}

export async function getCode(
	requestManager: Web3RequestManager,
	address: string,
	block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_getCode'>({
		method: 'eth_getCode',
		params: [address, block],
	});
}

export async function sign(
	requestManager: Web3RequestManager,
	address: string,
	data: string,
): Promise<string> {
	return requestManager.send<'eth_sign'>({
		method: 'eth_sign',
		params: [address, data],
	});
}

export async function signTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
): Promise<string> {
	return requestManager.send<'eth_signTransaction'>({
		method: 'eth_signTransaction',
		params: [transaction],
	});
}

export async function sendTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
): Promise<string> {
	return requestManager.send<'eth_sendTransaction'>({
		method: 'eth_sendTransaction',
		params: [transaction],
	});
}

export async function sendRawTransaction(
	requestManager: Web3RequestManager,
	signedTransaction: string,
): Promise<string> {
	return requestManager.send<'eth_sendRawTransaction'>({
		method: 'eth_sendRawTransaction',
		params: [signedTransaction],
	});
}

// TODO https://github.com/ethereum/execution-apis/issues/98
export async function call(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
	// block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_call'>({
		method: 'eth_call',
		// params: [transaction, block],
		params: [transaction],
	});
}

// TODO https://github.com/ethereum/execution-apis/issues/99
export async function estimateGas(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
	// block: BlockNumberOrTag,
): Promise<string> {
	return requestManager.send<'eth_estimateGas'>({
		method: 'eth_estimateGas',
		// params: [transaction, block],
		params: [transaction],
	});
}

export async function getBlockByHash(
	requestManager: Web3RequestManager,
	blockHash: string,
	hydrated: boolean,
): Promise<Block> {
	return requestManager.send<'eth_getBlockByHash'>({
		method: 'eth_getBlockByHash',
		params: [blockHash, hydrated],
	});
}

export async function getBlockByNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
	hydrated: boolean,
): Promise<Block> {
	return requestManager.send<'eth_getBlockByNumber'>({
		method: 'eth_getBlockByNumber',
		params: [block, hydrated],
	});
}

export async function getTransactionByHash(
	requestManager: Web3RequestManager,
	transactionHash: string,
): Promise<TransactionInfo> {
	return requestManager.send<'eth_getTransactionByHash'>({
		method: 'eth_getTransactionByHash',
		params: [transactionHash],
	});
}

export async function getTransactionByBlockHashAndIndex(
	requestManager: Web3RequestManager,
	blockHash: string,
	transactionIndex: string,
): Promise<TransactionInfo> {
	return requestManager.send<'eth_getTransactionByBlockHashAndIndex'>({
		method: 'eth_getTransactionByBlockHashAndIndex',
		params: [blockHash, transactionIndex],
	});
}

export async function getTransactionByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
	blockNumber: string,
	transactionIndex: string,
): Promise<TransactionInfo> {
	return requestManager.send<'eth_getTransactionByBlockNumberAndIndex'>({
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: [blockNumber, transactionIndex],
	});
}

export async function getTransactionReceipt(
	requestManager: Web3RequestManager,
	transactionHash: string,
): Promise<ReceiptInfo> {
	return requestManager.send<'eth_getTransactionReceipt'>({
		method: 'eth_getTransactionReceipt',
		params: [transactionHash],
	});
}

export async function getUncleByBlockHashAndIndex(
	requestManager: Web3RequestManager,
	blockHash: string,
	uncleIndex: string,
): Promise<Block> {
	return requestManager.send<'eth_getUncleByBlockHashAndIndex'>({
		method: 'eth_getUncleByBlockHashAndIndex',
		params: [blockHash, uncleIndex],
	});
}

export async function getUncleByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
	blockNumber: BlockNumberOrTag,
	uncleIndex: string,
): Promise<Block> {
	return requestManager.send<'eth_getUncleByBlockNumberAndIndex'>({
		method: 'eth_getUncleByBlockNumberAndIndex',
		params: [blockNumber, uncleIndex],
	});
}

// TODO https://github.com/ethereum/execution-apis/issues/100
// export async function getCompilers(
// 	requestManager: Web3RequestManager,
// ): Promise<Block> {
// 	return requestManager.send<'eth_getCompilers'>({
// 		method: 'eth_getCompilers',
// 		params: [],
// 	});
// }

// TODO https://github.com/ethereum/execution-apis/issues/101
// export async function compileSolidity(
// 	requestManager: Web3RequestManager,
//     sourceCode: string
// ): Promise<> {
// 	return requestManager.send<'eth_compileSolidity'>({
// 		method: 'eth_compileSolidity',
// 		params: [sourceCode],
// 	});
// }

// TODO https://github.com/ethereum/execution-apis/issues/101
// export async function compileLLL(
// 	requestManager: Web3RequestManager,
//     sourceCode: string
// ): Promise<> {
// 	return requestManager.send<'eth_compileLLL'>({
// 		method: 'eth_compileLLL',
// 		params: [sourceCode],
// 	});
// }

// TODO https://github.com/ethereum/execution-apis/issues/101
// export async function compileSerpent(
// 	requestManager: Web3RequestManager,
//     sourceCode: string
// ): Promise<> {
// 	return requestManager.send<'eth_compileSerpent'>({
// 		method: 'eth_compileSerpent',
// 		params: [sourceCode],
// 	});
// }

export async function newFilter(
	requestManager: Web3RequestManager,
	filter: Filter,
): Promise<string> {
	return requestManager.send<'eth_newFilter'>({
		method: 'eth_newFilter',
		params: [filter],
	});
}

export async function newBlockFilter(requestManager: Web3RequestManager): Promise<string> {
	return requestManager.send<'eth_newBlockFilter'>({
		method: 'eth_newBlockFilter',
		params: [],
	});
}

export async function newPendingTransactionFilter(
	requestManager: Web3RequestManager,
): Promise<string> {
	return requestManager.send<'eth_newPendingTransactionFilter'>({
		method: 'eth_newPendingTransactionFilter',
		params: [],
	});
}

export async function uninstallFilter(
	requestManager: Web3RequestManager,
	filterIdentifier: string,
): Promise<boolean> {
	return requestManager.send<'eth_uninstallFilter'>({
		method: 'eth_uninstallFilter',
		params: [filterIdentifier],
	});
}

export async function getFilterChanges(
	requestManager: Web3RequestManager,
	filterIdentifier: string,
): Promise<FilterResults> {
	return requestManager.send<'eth_getFilterChanges'>({
		method: 'eth_getFilterChanges',
		params: [filterIdentifier],
	});
}

export async function getFilterLogs(
	requestManager: Web3RequestManager,
	filterIdentifier: string,
): Promise<FilterResults> {
	return requestManager.send<'eth_getFilterLogs'>({
		method: 'eth_getFilterLogs',
		params: [filterIdentifier],
	});
}

export async function getLogs(
	requestManager: Web3RequestManager,
	filter: Filter,
): Promise<FilterResults> {
	return requestManager.send<'eth_getLogs'>({
		method: 'eth_getLogs',
		params: [filter],
	});
}

export async function getWork(
	requestManager: Web3RequestManager,
): Promise<[string, string, string]> {
	return requestManager.send<'eth_getWork'>({
		method: 'eth_getWork',
		params: [],
	});
}

export async function submitWork(
	requestManager: Web3RequestManager,
	powHash: string,
	seedHash: string,
	difficulty: string,
): Promise<boolean> {
	return requestManager.send<'eth_submitWork'>({
		method: 'eth_submitWork',
		params: [powHash, seedHash, difficulty],
	});
}

export async function submitHashrate(
	requestManager: Web3RequestManager,
	hashRate: string,
	id: string,
): Promise<boolean> {
	return requestManager.send<'eth_submitHashrate'>({
		method: 'eth_submitHashrate',
		params: [hashRate, id],
	});
}
