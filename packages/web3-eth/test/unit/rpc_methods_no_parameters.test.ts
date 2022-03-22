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
	getAccounts,
	getBlockNumber,
	getChainId,
	getCoinbase,
	getCompilers,
	getGasPrice,
	getHashRate,
	getMining,
	getNodeInfo,
	getPendingTransactions,
	getProtocolVersion,
	getSyncing,
	getWork,
	newBlockFilter,
	newPendingTransactionFilter,
	requestAccounts,
} from '../../src/rpc_methods';

describe('rpc_methods_no_parameters', () => {
	const requestManagerSendSpy = jest.fn();

	let requestManager: Web3RequestManager;

	beforeAll(() => {
		requestManager = new Web3RequestManager();
		requestManager.setProvider('http://127.0.0.1:8545');
		requestManager.send = requestManagerSendSpy;
	});

	describe('should make call with expected parameters', () => {
		it('getProtocolVersion', async () => {
			await getProtocolVersion(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_protocolVersion',
				params: [],
			});
		});

		it('getSyncing', async () => {
			await getSyncing(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_syncing',
				params: [],
			});
		});

		it('getCoinbase', async () => {
			await getCoinbase(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_coinbase',
				params: [],
			});
		});

		it('getMining', async () => {
			await getMining(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_mining',
				params: [],
			});
		});

		it('getHashRate', async () => {
			await getHashRate(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_hashrate',
				params: [],
			});
		});
		it('getGasPrice', async () => {
			await getGasPrice(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_gasPrice',
				params: [],
			});
		});
		it('getAccounts', async () => {
			await getAccounts(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_accounts',
				params: [],
			});
		});
		it('getBlockNumber', async () => {
			await getBlockNumber(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_blockNumber',
				params: [],
			});
		});
		it('getCompilers', async () => {
			await getCompilers(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getCompilers',
				params: [],
			});
		});
		it('newBlockFilter', async () => {
			await newBlockFilter(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_newBlockFilter',
				params: [],
			});
		});
		it('newPendingTransactionFilter', async () => {
			await newPendingTransactionFilter(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_newPendingTransactionFilter',
				params: [],
			});
		});
		it('getWork', async () => {
			await getWork(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getWork',
				params: [],
			});
		});
		it('getPendingTransactions', async () => {
			await getPendingTransactions(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_pendingTransactions',
				params: [],
			});
		});
		it('requestAccounts', async () => {
			await requestAccounts(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_requestAccounts',
				params: [],
			});
		});
		it('getChainId', async () => {
			await getChainId(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_chainId',
				params: [],
			});
		});
		it('getNodeInfo', async () => {
			await getNodeInfo(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'web3_clientVersion',
				params: [],
			});
		});
	});
});
