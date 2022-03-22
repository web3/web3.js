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

import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';
import {
	getCoinbase,
	getProtocolVersion,
	isMining,
	isSyncing,
} from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_methods');

describe('web3_eth_methods_no_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with only request manager parameter', () => {
		it('getProtocolVersion', async () => {
			await getProtocolVersion(web3Eth);
			expect(rpcMethods.getProtocolVersion).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isSyncing', async () => {
			await isSyncing(web3Eth);
			expect(rpcMethods.getSyncing).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('getCoinbase', async () => {
			await getCoinbase(web3Eth);
			expect(rpcMethods.getCoinbase).toHaveBeenCalledWith(web3Eth.requestManager);
		});

		it('isMining', async () => {
			await isMining(web3Eth);
			expect(rpcMethods.getMining).toHaveBeenCalledWith(web3Eth.requestManager);
		});
	});
});
