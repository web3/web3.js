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
import { isNumber } from 'web3-validator';

import Web3 from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import { closeOpenConnection, getSystemTestBackend } from '../shared_fixtures/system_tests_utils';

declare module 'web3' {
	interface Web3Context {
		L2Module: {
			getL2BlockInfo(): Promise<bigint>;
		};
	}
}

describe(`${getSystemTestBackend()} tests - Web3 extend`, () => {
	it('Web3 extend test - getL2BlockInfo', async () => {
		const provider = getSystemE2ETestProvider();
		const web3 = new Web3(provider);

		web3.extend({
			property: 'L2Module',
			methods: [
				{
					name: 'getL2BlockInfo',
					call: 'eth_blockNumber',
				},
			],
		});

		const result = await web3.L2Module.getL2BlockInfo();
		expect(isNumber(result)).toBeTruthy();

		await closeOpenConnection(web3);
	});
});
