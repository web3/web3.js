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
import { Web3Eth } from '../../src';
import {
	closeOpenConnection,
	createTempAccount,
	createNewAccount,
	describeIf,
	getSystemTestProvider,
	isSocket,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';

describeIf(isSocket)('subscription', () => {
	let clientUrl: string;
	let tempAcc2: { address: string; privateKey: string };

	beforeEach(async () => {
		tempAcc2 = await createTempAccount();
	});
	beforeAll(() => {
		clientUrl = getSystemTestProvider();
	});
	describe('error', () => {
		it(`test`, async () => {
			const web3Eth = new Web3Eth(clientUrl);
			const tempAccForEachTest = await createNewAccount({ unlock: true });
			const from = tempAccForEachTest.address;
			const to = tempAcc2.address;
			const value = `0x1`;
			await waitForOpenConnection(web3Eth);

			await web3Eth.sendTransaction({
				to,
				value,
				from,
			});
			await closeOpenConnection(web3Eth);
		});
	});
});
