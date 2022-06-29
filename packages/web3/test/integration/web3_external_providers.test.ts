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
import { getSystemTestProvider, createNewAccount } from '../shared_fixtures/system_tests_utils';
import { Web3 } from '../../src/index';

describe('Create Web3 class instance with external providers', () => {
	let provider: HDWalletProvider;
	let clientUrl: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const account = await createNewAccount();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider = new HDWalletProvider({
			privateKeys: [account.privateKey],
			providerOrUrl: clientUrl,
		});
	});
	afterAll(async () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		provider.engine.stop();
	});
	it('should create instance with external wallet provider', async () => {
		web3 = new Web3(provider);
		expect(web3).toBeInstanceOf(Web3);
	});
});
