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
import { ethRpcMethods } from 'web3-rpc-methods';

import Web3Eth from '../../src/index';

jest.mock('web3-rpc-methods');

describe('web3_eth_methods_no_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with only request manager parameter', () => {
		it('getProtocolVersion', async () => {
			await web3Eth.getProtocolVersion();
			expect(ethRpcMethods.getProtocolVersion).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isSyncing', async () => {
			await web3Eth.isSyncing();
			expect(ethRpcMethods.getSyncing).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getCoinbase', async () => {
			await web3Eth.getCoinbase();
			expect(ethRpcMethods.getCoinbase).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isMining', async () => {
			await web3Eth.isMining();
			expect(ethRpcMethods.getMining).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getAccounts', async () => {
			await web3Eth.getAccounts();
			expect(ethRpcMethods.getAccounts).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getWork', async () => {
			await web3Eth.getWork();
			expect(ethRpcMethods.getWork).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getPendingTransactions', async () => {
			(ethRpcMethods.getPendingTransactions as jest.Mock).mockResolvedValueOnce([]);

			await web3Eth.getPendingTransactions();
			expect(ethRpcMethods.getPendingTransactions).toHaveBeenCalledWith(
				web3Eth.requestManager,
			);
		});

		it('requestAccounts', async () => {
			await web3Eth.requestAccounts();
			expect(ethRpcMethods.requestAccounts).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getNodeInfo', async () => {
			await web3Eth.getNodeInfo();
			expect(ethRpcMethods.getNodeInfo).toHaveBeenCalledWith(web3Eth.requestManager);
		});
	});
});
