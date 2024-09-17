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
import { SupportedProviders, Web3BaseProvider } from 'web3-types';
import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	isWs,
	waitForOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import Web3 from '../../src/index';

describe('Web3 instance', () => {
	let provider: string | SupportedProviders;
	let accounts: string[];
	let web3: Web3;
	let currentAttempt = 0;

	beforeEach(() => {
		currentAttempt = 0;
	});

	beforeAll(async () => {
		provider = getSystemTestProvider();
		const acc1 = await createTempAccount();
		const acc2 = await createTempAccount();
		accounts = [acc1.address, acc2.address];
		web3 = new Web3(provider);
	});
	afterAll(async () => {
		try {
			await closeOpenConnection(web3);
		} catch (e) {
			console.warn('Failed to close open con', e);
		}
	});

	afterEach(async () => {
		if (isWs) {
			// make sure we try to close the connection after it is established
			if (
				web3?.provider &&
				(web3.provider as unknown as Web3BaseProvider).getStatus() === 'connecting'
			) {
				await waitForOpenConnection(web3, currentAttempt);
			}

			if (web3?.provider) {
				(web3.provider as unknown as Web3BaseProvider).disconnect(1000, '');
			}
		}
	});

	it('should be send transaction, change for defaultTransactionType and successfully send transaction with different type', async () => {
		const transaction = {
			from: accounts[0],
			to: accounts[0],
			value: 100000,
		};

		const receipt = await web3.eth.sendTransaction(transaction);
		expect(receipt.type).toEqual(BigInt(2));

		web3.setConfig({ defaultTransactionType: '0x0' });

		const receipt2 = await web3.eth.sendTransaction(transaction);
		expect(receipt2.type).toEqual(BigInt(0));
	});
});
