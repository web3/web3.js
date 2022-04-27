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

import { Web3Net } from '../../src';
import { getIdValidData, getPeerCountValidData } from '../fixtures/rpc_method_wrappers';
import * as rpcMethods from '../../src/rpc_methods';
import { getId, getPeerCount, isListening } from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_methods');

describe('rpc_method_wrappers', () => {
	let web3Net: Web3Net;

	beforeAll(() => {
		web3Net = new Web3Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		describe('getId', () => {
			it.each(getIdValidData)(
				'returnType: %s mockRpcResponse: %s output: %s',
				async (returnType, mockRpcResponse, output) => {
					(rpcMethods.getId as jest.Mock).mockResolvedValueOnce(mockRpcResponse);
					const result = await getId(web3Net, returnType);

					expect(result).toBe(output);
					expect(rpcMethods.getId).toHaveBeenCalledWith(web3Net.requestManager);
				},
			);
		});

		describe('getPeerCount', () => {
			it.each(getPeerCountValidData)(
				'returnType: %s mockRpcResponse: %s output: %s',
				async (returnType, mockRpcResponse, output) => {
					(rpcMethods.getPeerCount as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

					expect(await getPeerCount(web3Net, returnType)).toBe(output);
					expect(rpcMethods.getPeerCount).toHaveBeenCalledWith(web3Net.requestManager);
				},
			);
		});

		it('isListening', async () => {
			await isListening(web3Net);
			expect(rpcMethods.isListening).toHaveBeenCalledWith(web3Net.requestManager);
		});
	});
});
