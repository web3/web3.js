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

import { EthExecutionAPI, Web3APIPayload, JsonRpcResponseWithResult } from 'web3-types';
import HttpProvider from '../../src/index';
import {
	getSystemTestProvider,
	describeIf,
	createTempAccount,
	isHttp,
} from '../fixtures/system_test_utils';

describeIf(isHttp)('HttpProvider - implemented methods', () => {
	let httpProvider: HttpProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	beforeAll(async () => {
		httpProvider = new HttpProvider(getSystemTestProvider());
		const tempAcc = await createTempAccount();
		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: [tempAcc.address, 'latest'],
		} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			const response = await httpProvider.request(jsonRpcPayload);
			expect(Number((response as JsonRpcResponseWithResult).id)).toBeGreaterThan(0);
		});
	});
});
