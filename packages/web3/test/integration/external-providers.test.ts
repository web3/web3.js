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

// eslint-disable-next-line import/no-extraneous-dependencies
import ganache from 'ganache';

import Web3 from '../../src/index';
import { getSystemTestMnemonic } from '../shared_fixtures/system_tests_utils';

describe('compatibility with external providers', () => {
	it('should accept a simple EIP1193 provider', async () => {
		interface RequestArguments {
			readonly method: string;
			readonly params?: readonly unknown[] | object;
		}

		class Provider {
			// eslint-disable-next-line class-methods-use-this
			public async request(_: RequestArguments): Promise<unknown> {
				return undefined as unknown;
			}
		}

		const testProvider = new Provider();
		const { provider } = new Web3(testProvider);
		expect(provider).toBeDefined();
	});

	it('should accept a ganache provider', async () => {
		const { provider } = ganache.server({
			wallet: {
				mnemonic: getSystemTestMnemonic(),
			},
		});
		const web3 = new Web3(provider);

		const accounts = await web3.eth.getAccounts();

		const tx = web3.eth.sendTransaction({
			to: accounts[1],
			from: accounts[0],
			value: '1',
		});

		await expect(tx).resolves.not.toThrow();
	});
});
