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

import { Web3Eth } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
	getSystemTestProvider,
	itIf,
} from '../../fixtures/system_test_utils';

describe('Web3Eth.submitWork', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth(getSystemTestProvider());
	});

	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	// Geth doesn't support eth_submitWork
	itIf(getSystemTestBackend() !== 'geth')('should submit work', async () => {
		const response = await web3Eth.submitWork(
			'0x0000000000000001',
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
		);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(response).toBe(false);
	});
});
