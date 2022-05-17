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
import { Address } from 'web3-utils';

import Web3Eth, { Transaction } from '../../../src';
import { getSystemTestAccounts, getSystemTestProvider } from '../../fixtures/system_test_utils';

describe('Web3Eth.sendTransaction', () => {
	let web3Eth: Web3Eth;
	let accounts: Address[];

	beforeAll(async () => {
		web3Eth = new Web3Eth(getSystemTestProvider());
		accounts = await getSystemTestAccounts();
	});

	afterAll(() => {
		if (getSystemTestProvider().startsWith('ws')) {
			(web3Eth.provider as WebSocketProvider).disconnect();
		}
	});

	it('should make a simple value transfer', async () => {
		const transaction: Transaction = {
			from: accounts[0],
			to: '0x0000000000000000000000000000000000000000',
			value: '0x1',
		};
		const response = await web3Eth.sendTransaction(transaction);
		expect(response.status).toBe('0x1');
	});
});
