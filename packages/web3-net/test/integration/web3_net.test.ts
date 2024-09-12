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

import { SupportedProviders, Web3NetAPI } from 'web3-types';
import Net from '../../src';

import { closeOpenConnection, getSystemTestProvider } from '../fixtures/system_tests_utils';

describe('Web3 net', () => {
	let clientUrl: string | SupportedProviders<Web3NetAPI>;
	let web3Net: Net;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
	});

	afterAll(async () => {
		await closeOpenConnection(web3Net);
	});

	it('should be able to create instance', () => {
		web3Net = new Net(clientUrl);

		expect(web3Net).toBeInstanceOf(Net);
	});

	it('should be able to get id', async () => {
		const networkId = await web3Net.getId();
		// eslint-disable-next-line jest/no-conditional-expect
		expect(networkId).toBe(BigInt(1337));
	});

	it('should be able to listen', async () => {
		const isListening = await web3Net.isListening();
		expect(isListening).toBeTruthy();
	});

	it('should fetch peer count', async () => {
		const peerCount = await web3Net.getPeerCount();
		expect(peerCount).toBe(BigInt(0));
	});
});
