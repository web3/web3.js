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

import HDWalletProvider from '@truffle/hdwallet-provider';

import { performBasicRpcCalls } from './helper';
import {
	createNewAccount,
	describeIf,
	getSystemTestProvider,
	isIpc,
} from '../../shared_fixtures/system_tests_utils';
import Web3 from '../../../src';

describeIf(!isIpc)('compatibility with `truffle` `HDWalletProvider` provider', () => {
	let provider: HDWalletProvider;

	beforeAll(async () => {
		const clientUrl = getSystemTestProvider();
		const account1 = await createNewAccount({ unlock: true, refill: true });
		const account2 = await createNewAccount({ unlock: true, refill: true });
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider = new HDWalletProvider({
			privateKeys: [account1.privateKey, account2.privateKey],
			providerOrUrl: clientUrl,
		});
	});
	afterAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider?.engine?.stop();
	});
	test('should create instance with external wallet provider', () => {
		const web3 = new Web3(provider);
		expect(web3).toBeInstanceOf(Web3);
	});
	test('should initialize Web3, get accounts & block number and send a transaction', async () => {
		await performBasicRpcCalls(provider);
	});
});
