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

import Web3Eth from '../../../src';
import { getSystemTestAccounts, getSystemTestProvider } from '../../fixtures/system_test_utils';

describe('Web3Eth.sign', () => {
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

	it('should sign message', async () => {
		const message = '0x736f796c656e7420677265656e2069732070656f706c65';
		const expectedSignedMessage =
			'0x16d90c495507887340b6d4a16983ce4aa3bc11c6258c1e5564ceb11481ec3a890b5468e4e2e8655e6f0ac95abc35f51c66b003303f8e7375528bdc24b8a2b21b1b';
		const response = await web3Eth.sign(message, accounts[0]);
		expect(response).toBe(expectedSignedMessage);
	});
});
