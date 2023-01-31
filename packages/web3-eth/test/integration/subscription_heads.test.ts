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
import { BlockHeaderOutput } from 'web3-types';
import { Web3Eth, NewHeadsSubscription } from '../../src';
import { Resolve, sendFewTxesWithoutReceipt } from './helper';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProvider,
	isSocket,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';

const checkTxCount = 3;

describeIf(isSocket)('subscription', () => {
	let clientUrl: string;
	let tempAcc2: { address: string; privateKey: string };

	beforeEach(async () => {
		tempAcc2 = await createTempAccount();
	});
	beforeAll(() => {
		clientUrl = getSystemTestProvider();
	});
	describe('heads', () => {
		it(`wait for ${checkTxCount} newHeads`, async () => {
			const web3Eth = new Web3Eth(clientUrl);
			const sub: NewHeadsSubscription = await web3Eth.subscribe('newHeads');
			const tempAccForEachTest = await createTempAccount();
			const from = tempAccForEachTest.address;
			const to = tempAcc2.address;
			const value = `0x10000`;
			await waitForOpenConnection(web3Eth);
			let times = 0;
			const pr = new Promise((resolve: Resolve, reject) => {
				sub.on('data', (data: BlockHeaderOutput) => {
					if (data.parentHash) {
						times += 1;
					}
					expect(times).toBeGreaterThanOrEqual(times);
					if (times >= checkTxCount) {
						// sub.off('data', () => {
						// 	no need to do anything
						// });
						resolve();
					}
				});
				sub.on('error', error => {
					reject(error);
				});
			});
			await sendFewTxesWithoutReceipt({
				web3Eth,
				from,
				to,
				value,
				times: checkTxCount,
			});

			await pr;
			await web3Eth.subscriptionManager?.removeSubscription(sub);
			await closeOpenConnection(web3Eth);
		});
		it(`clear`, async () => {
			const web3Eth = new Web3Eth(clientUrl);
			await waitForOpenConnection(web3Eth);
			const sub: NewHeadsSubscription = await web3Eth.subscribe('newHeads');
			expect(sub.id).toBeDefined();
			await web3Eth.subscriptionManager?.removeSubscription(sub);
			expect(sub.id).toBeUndefined();
			await closeOpenConnection(web3Eth);
		});
	});
});
