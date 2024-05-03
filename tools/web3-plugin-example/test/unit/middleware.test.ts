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

import Web3, { TransactionCall } from 'web3';
import { jsonRpc } from 'web3-utils';
import { CustomRpcMethodsPlugin } from '../../src/custom_rpc_methods';

describe('CustomRpcMethodsPlugin Middleware', () => {
	it('should modify request and response using middleware plugin', async () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		const plugin = new CustomRpcMethodsPlugin(true);

		// Test mocks and spy - code block start
		const expectedResponse = {
			jsonrpc: '2.0',
			id: 1,
			result: '0x6a756e616964',
		};

		jsonRpc.setRequestIdStart(0);

		const mockRequest = jest.spyOn(web3.provider as any, 'request');
		mockRequest.mockResolvedValue(expectedResponse);
		// Test mocks and spy - code block end

		web3.registerPlugin(plugin);

		const transaction: TransactionCall = {
			from: '0xee815C0a7cD0Ab35273Bc5943a3c6839a680Eaf0',
			to: '0xe3342ae375e9B02F7D5513a1BB2276438D193e15',
			type: '0x0',
			data: '0x',
			nonce: '0x4',
			chain: 'mainnet',
			hardfork: 'berlin',
			chainId: '0x1',
		};
		const result = await web3.eth.call(transaction);
		expect(result).toBe('0x6a756e616964'); // result modified by response processor , so its 0x6a756e616964 instead of 0x0

		const expectedCall = {
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_call',
			params: [
				{ ...transaction },
				'latest',
				'0x0', // added by middleware by request processor
				'0x1', // added by middleware by request processor
			],
		};
		expect(mockRequest).toHaveBeenCalledWith(expectedCall);
	});
});
