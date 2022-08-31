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
// import { Web3BaseProvider } from 'web3-types';
// import { getSystemTestProvider, getSystemTestAccounts } from '../fixtures/system_tests_utils';
import { Contract } from 'web3-eth-contract';
import { setupENS } from '../fixtures/setupENS';
import ENSREGISTRY from '../fixtures/ens/ENSRegistry.json';

import { getSystemTestAccounts } from '../fixtures/system_tests_utils';

describe('ens', () => {
	describe('defaults', () => {
		let registry: Contract<typeof ENSREGISTRY.abi>;
		const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

		// let deployOptions: Record<string, unknown>;
		// let sendOptions: Record<string, unknown>;
		let accounts: string[];

		beforeAll(async () => {
			accounts = await getSystemTestAccounts();
			registry = await setupENS();
		});

		// accounts = await getSystemTestAccounts();

		// deployOptions = {
		// 	data: GreeterBytecode,
		// 	arguments: ['My Greeting'],
		// };

		// sendOptions = { from: accounts[0], gas: '1000000' };

		it('dummy test', async () => {
			const owner = await registry.methods.setOwner(ZERO_ADDRESS, accounts[1]).send();

			// console.log('Owner of registry:', owner);

			// console.log(registry.methods.setOwner);
		});
	});
});
