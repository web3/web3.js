/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Web3RequestManager } from 'web3-core';

import {
	call,
	compileLLL,
	compileSerpent,
	compileSolidity,
	estimateGas,
	getBalance,
	getBlockByHash,
	getBlockByNumber,
	getBlockTransactionCountByHash,
	getBlockTransactionCountByNumber,
	getCode,
	getFeeHistory,
	getFilterChanges,
	getFilterLogs,
	getLogs,
	getProof,
	getStorageAt,
	getTransactionByBlockHashAndIndex,
	getTransactionByBlockNumberAndIndex,
	getTransactionByHash,
	getTransactionCount,
	getTransactionReceipt,
	getUncleByBlockHashAndIndex,
	getUncleByBlockNumberAndIndex,
	getUncleCountByBlockHash,
	getUncleCountByBlockNumber,
	newFilter,
	sendRawTransaction,
	sendTransaction,
	sign,
	signTransaction,
	submitHashrate,
	submitWork,
	uninstallFilter,
} from '../../src/rpc_methods';
import {
	callValidData,
	compileLLLValidData,
	compileSerpentValidData,
	compileSolidityValidData,
	estimateGasValidData,
	getBalanceValidData,
	getBlockByHashValidData,
	getBlockByNumberValidData,
	getBlockTransactionCountByHashValidData,
	getBlockTransactionCountByNumberValidData,
	getCodeValidData,
	getFeeHistoryValidData,
	getFilterChangesValidData,
	getFilterLogsValidData,
	getLogsValidData,
	getProofValidData,
	getStorageAtValidData,
	getTransactionByBlockHashAndIndexValidData,
	getTransactionByBlockNumberAndIndexValidData,
	getTransactionByHashValidData,
	getTransactionCountValidData,
	getTransactionReceiptValidData,
	getUncleByBlockHashAndIndexValidData,
	getUncleByBlockNumberAndIndexValidData,
	getUncleCountByBlockHashValidData,
	getUncleCountByBlockNumberValidData,
	newFilterValidData,
	sendRawTransactionValidData,
	sendTransactionValidData,
	signTransactionValidData,
	signValidData,
	submitHashrateValidData,
	submitWorkValidData,
	uninstallFilterValidData,
} from '../fixtures/rpc_methods_with_params';

// Invalid data is not being tested for each method, because that
// would be retesting the validation methods which are tested in web3-utils
describe('rpc_methods_with_parameters', () => {
	const requestManagerSendSpy = jest.fn();

	let requestManager: Web3RequestManager;

	beforeAll(() => {
		requestManager = new Web3RequestManager();
		requestManager.setProvider('http://127.0.0.1:8545');
		requestManager.send = requestManagerSendSpy;
	});

	describe('getBalance', () => {
		it.each(getBalanceValidData)('%s', async (address, blockNumber) => {
			await getBalance(requestManager, address, blockNumber);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBalance',
				params: [address, blockNumber],
			});
		});
	});

	describe('getStorageAt', () => {
		it.each(getStorageAtValidData)('%s', async (address, storageSlot, blockNumber) => {
			await getStorageAt(requestManager, address, storageSlot, blockNumber);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getStorageAt',
				params: [address, storageSlot, blockNumber],
			});
		});
	});

	describe('getTransactionCount', () => {
		it.each(getTransactionCountValidData)('%s', async (address, block) => {
			await getTransactionCount(requestManager, address, block);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getTransactionCount',
				params: [address, block],
			});
		});
	});

	describe('getBlockTransactionCountByHash', () => {
		it.each(getBlockTransactionCountByHashValidData)('%s', async blockHash => {
			await getBlockTransactionCountByHash(requestManager, blockHash);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBlockTransactionCountByHash',
				params: [blockHash],
			});
		});
	});

	describe('getBlockTransactionCountByNumber', () => {
		it.each(getBlockTransactionCountByNumberValidData)('%s', async block => {
			await getBlockTransactionCountByNumber(requestManager, block);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBlockTransactionCountByNumber',
				params: [block],
			});
		});
	});

	describe('getUncleCountByBlockHash', () => {
		it.each(getUncleCountByBlockHashValidData)('%s', async blockHash => {
			await getUncleCountByBlockHash(requestManager, blockHash);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getUncleCountByBlockHash',
				params: [blockHash],
			});
		});
	});

	describe('getUncleCountByBlockNumber', () => {
		it.each(getUncleCountByBlockNumberValidData)('%s', async block => {
			await getUncleCountByBlockNumber(requestManager, block);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getUncleCountByBlockNumber',
				params: [block],
			});
		});
	});

	describe('getCode', () => {
		it.each(getCodeValidData)('%s', async (address, block) => {
			await getCode(requestManager, address, block);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getCode',
				params: [address, block],
			});
		});
	});

	describe('sign', () => {
		it.each(signValidData)('%s', async (address, message) => {
			await sign(requestManager, address, message);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_sign',
				params: [address, message],
			});
		});
	});

	describe('signTransaction', () => {
		it.each(signTransactionValidData())('%s', async transaction => {
			await signTransaction(requestManager, transaction);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_signTransaction',
				params: [transaction],
			});
		});
	});

	describe('sendTransaction', () => {
		it.each(sendTransactionValidData())('%s', async transaction => {
			await sendTransaction(requestManager, transaction);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_sendTransaction',
				params: [transaction],
			});
		});
	});

	describe('sendRawTransaction', () => {
		it.each(sendRawTransactionValidData)('%s', async transaction => {
			await sendRawTransaction(requestManager, transaction);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_sendRawTransaction',
				params: [transaction],
			});
		});
	});

	describe('call', () => {
		it.each(callValidData())('%s', async (transaction, blockNumber) => {
			await call(requestManager, transaction, blockNumber);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_call',
				params: [transaction, blockNumber],
			});
		});
	});

	describe('estimateGas', () => {
		it.each(estimateGasValidData())('%s', async (transaction, blockNumber) => {
			await estimateGas(requestManager, transaction, blockNumber);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_estimateGas',
				params: [transaction, blockNumber],
			});
		});
	});

	describe('getBlockByHash', () => {
		it.each(getBlockByHashValidData)('%s', async (blockHash, hydrated) => {
			await getBlockByHash(requestManager, blockHash, hydrated);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBlockByHash',
				params: [blockHash, hydrated],
			});
		});
	});

	describe('getBlockByNumber', () => {
		it.each(getBlockByNumberValidData)('%s', async (block, hydrated) => {
			await getBlockByNumber(requestManager, block, hydrated);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBlockByNumber',
				params: [block, hydrated],
			});
		});
	});

	describe('getTransactionByHash', () => {
		it.each(getTransactionByHashValidData)('%s', async transactionHash => {
			await getTransactionByHash(requestManager, transactionHash);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getTransactionByHash',
				params: [transactionHash],
			});
		});
	});

	describe('getTransactionByBlockHashAndIndex', () => {
		it.each(getTransactionByBlockHashAndIndexValidData)('%s', async (blockHash, index) => {
			await getTransactionByBlockHashAndIndex(requestManager, blockHash, index);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getTransactionByBlockHashAndIndex',
				params: [blockHash, index],
			});
		});
	});

	describe('getTransactionByBlockNumberAndIndex', () => {
		it.each(getTransactionByBlockNumberAndIndexValidData)('%s', async (block, index) => {
			await getTransactionByBlockNumberAndIndex(requestManager, block, index);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getTransactionByBlockNumberAndIndex',
				params: [block, index],
			});
		});
	});

	describe('getTransactionReceipt', () => {
		it.each(getTransactionReceiptValidData)('%s', async transactionHash => {
			await getTransactionReceipt(requestManager, transactionHash);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getTransactionReceipt',
				params: [transactionHash],
			});
		});
	});

	describe('getUncleByBlockHashAndIndex', () => {
		it.each(getUncleByBlockHashAndIndexValidData)('%s', async (blockHash, index) => {
			await getUncleByBlockHashAndIndex(requestManager, blockHash, index);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getUncleByBlockHashAndIndex',
				params: [blockHash, index],
			});
		});
	});

	describe('getUncleByBlockNumberAndIndex', () => {
		it.each(getUncleByBlockNumberAndIndexValidData)('%s', async (block, index) => {
			await getUncleByBlockNumberAndIndex(requestManager, block, index);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getUncleByBlockNumberAndIndex',
				params: [block, index],
			});
		});
	});

	describe('compileSolidity', () => {
		it.each(compileSolidityValidData)('%s', async code => {
			await compileSolidity(requestManager, code);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_compileSolidity',
				params: [code],
			});
		});
	});

	describe('compileLLL', () => {
		it.each(compileLLLValidData)('%s', async code => {
			await compileLLL(requestManager, code);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_compileLLL',
				params: [code],
			});
		});
	});

	describe('compileSerpent', () => {
		it.each(compileSerpentValidData)('%s', async code => {
			await compileSerpent(requestManager, code);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_compileSerpent',
				params: [code],
			});
		});
	});

	describe('newFilter', () => {
		it.each(newFilterValidData())('%s', async filter => {
			await newFilter(requestManager, filter);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_newFilter',
				params: [filter],
			});
		});
	});

	describe('uninstallFilter', () => {
		it.each(uninstallFilterValidData)('%s', async filterId => {
			await uninstallFilter(requestManager, filterId);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_uninstallFilter',
				params: [filterId],
			});
		});
	});

	describe('getFilterChanges', () => {
		it.each(getFilterChangesValidData)('%s', async filterId => {
			await getFilterChanges(requestManager, filterId);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getFilterChanges',
				params: [filterId],
			});
		});
	});

	describe('getFilterLogs', () => {
		it.each(getFilterLogsValidData)('%s', async filterId => {
			await getFilterLogs(requestManager, filterId);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getFilterLogs',
				params: [filterId],
			});
		});
	});

	describe('getLogs', () => {
		it.each(getLogsValidData())('%s', async filter => {
			await getLogs(requestManager, filter);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getLogs',
				params: [filter],
			});
		});
	});

	describe('submitWork', () => {
		it.each(submitWorkValidData)('%s', async (nonce, hash, digest) => {
			await submitWork(requestManager, nonce, hash, digest);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_submitWork',
				params: [nonce, hash, digest],
			});
		});
	});

	describe('submitHashrate', () => {
		it.each(submitHashrateValidData)('%s', async (hashRate, id) => {
			await submitHashrate(requestManager, hashRate, id);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_submitHashrate',
				params: [hashRate, id],
			});
		});
	});

	describe('getFeeHistory', () => {
		it.each(getFeeHistoryValidData)(
			'%s',
			async (blockCount, newestBlock, rewardPercentiles) => {
				await getFeeHistory(requestManager, blockCount, newestBlock, rewardPercentiles);
				expect(requestManagerSendSpy).toHaveBeenCalledWith({
					method: 'eth_feeHistory',
					params: [blockCount, newestBlock, rewardPercentiles],
				});
			},
		);
	});

	describe('getProof', () => {
		it.each(getProofValidData)('%s', async (address, storageKey, blockNumberOrTag) => {
			await getProof(requestManager, address, storageKey, blockNumberOrTag);
			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getProof',
				params: [address, storageKey, blockNumberOrTag],
			});
		});
	});
});
