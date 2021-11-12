import { BlockNumberOrTag, TransactionWithSender, Filter, TransactionCall } from 'web3-common';
import { Web3RequestManager } from 'web3-core';
import { Address, Uint256, HexString32Bytes, HexStringBytes, Uint } from 'web3-utils';

export async function getProtocolVersion(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_protocolVersion'>({
		method: 'eth_protocolVersion',
		params: [],
	});
}

export async function getSyncing(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_syncing'>({
		method: 'eth_syncing',
		params: [],
	});
}

export async function getCoinbase(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_coinbase'>({
		method: 'eth_coinbase',
		params: [],
	});
}

export async function getMining(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_mining'>({
		method: 'eth_mining',
		params: [],
	});
}

export async function getHashRate(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_hashrate'>({
		method: 'eth_hashrate',
		params: [],
	});
}

export async function getGasPrice(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_gasPrice'>({
		method: 'eth_gasPrice',
		params: [],
	});
}

export async function getAccounts(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_accounts'>({
		method: 'eth_accounts',
		params: [],
	});
}

export async function getBlockNumber(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_blockNumber'>({
		method: 'eth_blockNumber',
		params: [],
	});
}

export async function getBalance(
	requestManager: Web3RequestManager,
	address: Address,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getBalance'>({
		method: 'eth_getBalance',
		params: [address, blockNumber],
	});
}

export async function getStorageAt(
	requestManager: Web3RequestManager,
	address: Address,
	storageSlot: Uint256,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getStorageAt'>({
		method: 'eth_getStorageAt',
		params: [address, storageSlot, blockNumber],
	});
}

export async function getTransactionCount(
	requestManager: Web3RequestManager,
	address: Address,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getTransactionCount'>({
		method: 'eth_getTransactionCount',
		params: [address, blockNumber],
	});
}

export async function getBlockTransactionCountByHash(
	requestManager: Web3RequestManager,
	blockHash: HexString32Bytes,
) {
	return requestManager.send<'eth_getBlockTransactionCountByHash'>({
		method: 'eth_getBlockTransactionCountByHash',
		params: [blockHash],
	});
}

export async function getBlockTransactionCountByNumber(
	requestManager: Web3RequestManager,
	block: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getBlockTransactionCountByNumber'>({
		method: 'eth_getBlockTransactionCountByNumber',
		params: [block],
	});
}

export async function getUncleCountByBlockHash(
	requestManager: Web3RequestManager,
	blockHash: HexString32Bytes,
) {
	return requestManager.send<'eth_getUncleCountByBlockHash'>({
		method: 'eth_getUncleCountByBlockHash',
		params: [blockHash],
	});
}

export async function getUncleCountByBlockNumber(
	requestManager: Web3RequestManager,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getUncleCountByBlockNumber'>({
		method: 'eth_getUncleCountByBlockNumber',
		params: [blockNumber],
	});
}

export async function getCode(
	requestManager: Web3RequestManager,
	address: Address,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_getCode'>({
		method: 'eth_getCode',
		params: [address, blockNumber],
	});
}

export async function sign(
	requestManager: Web3RequestManager,
	address: Address,
	message: HexStringBytes,
) {
	return requestManager.send<'eth_sign'>({
		method: 'eth_sign',
		params: [address, message],
	});
}

export async function signTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
) {
	return requestManager.send<'eth_signTransaction'>({
		method: 'eth_signTransaction',
		params: [transaction],
	});
}

export async function sendTransaction(
	requestManager: Web3RequestManager,
	transaction: TransactionWithSender,
) {
	return requestManager.send<'eth_sendTransaction'>({
		method: 'eth_sendTransaction',
		params: [transaction],
	});
}

export async function sendRawTransaction(
	requestManager: Web3RequestManager,
	transaction: HexStringBytes,
) {
	return requestManager.send<'eth_sendRawTransaction'>({
		method: 'eth_sendRawTransaction',
		params: [transaction],
	});
}

export async function call(
	requestManager: Web3RequestManager,
	transaction: TransactionCall,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_call'>({
		method: 'eth_call',
		params: [transaction, blockNumber],
	});
}

export async function estimateGas(
	requestManager: Web3RequestManager,
	transaction: Partial<TransactionWithSender>,
	blockNumber: BlockNumberOrTag,
) {
	return requestManager.send<'eth_estimateGas'>({
		method: 'eth_estimateGas',
		params: [transaction, blockNumber],
	});
}

export async function getBlockByHash(
	requestManager: Web3RequestManager,
	blockHash: HexString32Bytes,
	hydrated: boolean,
) {
	return requestManager.send<'eth_getBlockByHash'>({
		method: 'eth_getBlockByHash',
		params: [blockHash, hydrated],
	});
}

export async function getBlockByNumber(
	requestManager: Web3RequestManager,
	blockNumber: BlockNumberOrTag,
	hydrated: boolean,
) {
	return requestManager.send<'eth_getBlockByNumber'>({
		method: 'eth_getBlockByNumber',
		params: [blockNumber, hydrated],
	});
}

export async function getTransactionByHash(
	requestManager: Web3RequestManager,
	transactionHash: HexString32Bytes,
) {
	return requestManager.send<'eth_getTransactionByHash'>({
		method: 'eth_getTransactionByHash',
		params: [transactionHash],
	});
}

export async function getTransactionByBlockHashAndIndex(
	requestManager: Web3RequestManager,
	blockHash: HexString32Bytes,
	transactionIndex: Uint,
) {
	return requestManager.send<'eth_getTransactionByBlockHashAndIndex'>({
		method: 'eth_getTransactionByBlockHashAndIndex',
		params: [blockHash, transactionIndex],
	});
}

export async function getTransactionByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
	blockNumber: BlockNumberOrTag,
	transactionIndex: Uint,
) {
	return requestManager.send<'eth_getTransactionByBlockNumberAndIndex'>({
		method: 'eth_getTransactionByBlockNumberAndIndex',
		params: [blockNumber, transactionIndex],
	});
}

export async function getTransactionReceipt(
	requestManager: Web3RequestManager,
	transactionHash: HexString32Bytes,
) {
	return requestManager.send<'eth_getTransactionReceipt'>({
		method: 'eth_getTransactionReceipt',
		params: [transactionHash],
	});
}

export async function getUncleByBlockHashAndIndex(
	requestManager: Web3RequestManager,
	blockHash: HexString32Bytes,
	uncleIndex: Uint,
) {
	return requestManager.send<'eth_getUncleByBlockHashAndIndex'>({
		method: 'eth_getUncleByBlockHashAndIndex',
		params: [blockHash, uncleIndex],
	});
}

export async function getUncleByBlockNumberAndIndex(
	requestManager: Web3RequestManager,
	blockNumber: BlockNumberOrTag,
	uncleIndex: Uint,
) {
	return requestManager.send<'eth_getUncleByBlockNumberAndIndex'>({
		method: 'eth_getUncleByBlockNumberAndIndex',
		params: [blockNumber, uncleIndex],
	});
}

export async function getCompilers(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_getCompilers'>({
		method: 'eth_getCompilers',
		params: [],
	});
}

export async function compileSolidity(requestManager: Web3RequestManager, code: string) {
	return requestManager.send<'eth_compileSolidity'>({
		method: 'eth_compileSolidity',
		params: [code],
	});
}

export async function compileLLL(requestManager: Web3RequestManager, code: string) {
	return requestManager.send<'eth_compileLLL'>({
		method: 'eth_compileLLL',
		params: [code],
	});
}

export async function compileSerpent(requestManager: Web3RequestManager, code: string) {
	return requestManager.send<'eth_compileSerpent'>({
		method: 'eth_compileSerpent',
		params: [code],
	});
}

export async function newFilter(requestManager: Web3RequestManager, filter: Filter) {
	return requestManager.send<'eth_newFilter'>({
		method: 'eth_newFilter',
		params: [filter],
	});
}

export async function newBlockFilter(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_newBlockFilter'>({
		method: 'eth_newBlockFilter',
		params: [],
	});
}

export async function newPendingTransactionFilter(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_newPendingTransactionFilter'>({
		method: 'eth_newPendingTransactionFilter',
		params: [],
	});
}

export async function uninstallFilter(requestManager: Web3RequestManager, filterIdentifier: Uint) {
	return requestManager.send<'eth_uninstallFilter'>({
		method: 'eth_uninstallFilter',
		params: [filterIdentifier],
	});
}

export async function getFilterChanges(requestManager: Web3RequestManager, filterIdentifier: Uint) {
	return requestManager.send<'eth_getFilterChanges'>({
		method: 'eth_getFilterChanges',
		params: [filterIdentifier],
	});
}

export async function getFilterLogs(requestManager: Web3RequestManager, filterIdentifier: Uint) {
	return requestManager.send<'eth_getFilterLogs'>({
		method: 'eth_getFilterLogs',
		params: [filterIdentifier],
	});
}

export async function getLogs(requestManager: Web3RequestManager, filter: Filter) {
	return requestManager.send<'eth_getLogs'>({
		method: 'eth_getLogs',
		params: [filter],
	});
}

export async function getWork(requestManager: Web3RequestManager) {
	return requestManager.send<'eth_getWork'>({
		method: 'eth_getWork',
		params: [],
	});
}

export async function submitWork(
	requestManager: Web3RequestManager,
	powHash: HexString32Bytes,
	seedHash: HexString32Bytes,
	difficulty: HexString32Bytes,
) {
	return requestManager.send<'eth_submitWork'>({
		method: 'eth_submitWork',
		params: [powHash, seedHash, difficulty],
	});
}

export async function submitHashrate(
	requestManager: Web3RequestManager,
	hashRate: HexString32Bytes,
	id: HexString32Bytes,
) {
	return requestManager.send<'eth_submitHashrate'>({
		method: 'eth_submitHashrate',
		params: [hashRate, id],
	});
}

export async function getFeeHistory(
	requestManager: Web3RequestManager,
	blockCount: Uint,
	newestBlock: BlockNumberOrTag,
	rewardPercentiles: number[],
) {
	return requestManager.send<'eth_feeHistory'>({
		method: 'eth_feeHistory',
		params: [blockCount, newestBlock, rewardPercentiles],
	});
}
