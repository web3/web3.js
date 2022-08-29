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
import WebSocketProvider from 'web3-providers-ws';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hexToNumber } from 'web3-utils';
import { Web3Eth } from '../../src';

import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	isWs,
} from '../fixtures/system_test_utils';

describe('eth', () => {
	let web3Eth: Web3Eth;

	let clientUrl: string;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();

		if (isWs) {
			web3Eth = new Web3Eth(
				new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			);
		} else {
			web3Eth = new Web3Eth(clientUrl);
		}
	});
	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	describe('methods', () => {
		it('BatchRequest', async () => {
			const acc1 = await createTempAccount();
			const acc2 = await createTempAccount();
			const batch = new web3Eth.BatchRequest();
			const request1 = {
				id: 10,
				method: 'eth_getBalance',
				params: [acc1.address, 'latest'],
			};
			const request2 = {
				id: 11,
				method: 'eth_getBalance',
				params: [acc2.address, 'latest'],
			};
			const r1 = batch.add(request1).catch(console.error);
			const r2 = batch.add(request2).catch(console.error);
			const [response1, response2] = await batch.execute();

			// eslint-disable-next-line jest/no-standalone-expect
			expect(response1.result).toBeDefined();
			// eslint-disable-next-line jest/no-standalone-expect
			expect(response2.result).toBeDefined();
			// TODO: in future release add test for validation of returned results , ( match balance )
			// eslint-disable-next-line jest/no-standalone-expect
			expect(Number(hexToNumber(String(response1.result)))).toBeGreaterThan(0);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(Number(hexToNumber(String(response2.result)))).toBeGreaterThan(0);
			const [res1, res2] = await Promise.all([r1, r2]);
			expect(res1).toBe(response1.result);
			expect(res2).toBe(response2.result);
		});
	});
});
