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
import { Web3Eth } from '../../src';
import { Resolve } from './helper';
import { NewHeadsSubscription } from '../../src/web3_subscriptions';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProvider,
	isIpc,
	isSocket,
} from '../fixtures/system_test_utils';

const checkTxCount = 3;
type SubName = 'newHeads' | 'newBlockHeaders';
const subNames: Array<SubName> = ['newHeads', 'newBlockHeaders'];

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
		it.each(subNames)(`wait for ${checkTxCount} newBlockHeaders`, async (subName: SubName) => {
			const web3Eth = new Web3Eth(clientUrl);
			const sub: NewHeadsSubscription = await web3Eth.subscribe(subName);
			const tempAccForEachTest = await createTempAccount();
			const from = tempAccForEachTest.address;
			const to = tempAcc2.address;
			const value = `0x1`;

			let times = 0;
			const pr = new Promise((resolve: Resolve, reject) => {
				sub.on('data', (data: BlockHeaderOutput) => {
					if (data.parentHash) {
						times += 1;
					}
					expect(times).toBeGreaterThanOrEqual(times);
					if (times >= checkTxCount) {
						sub.off('data', () => {
							// no need to do anything
						});
						resolve();
					}
				});
				sub.on('error', error => {
					reject(error);
				});
			});
			for (let i = 0; i < checkTxCount * (isIpc ? 2 : 1); i += 1) {
				// eslint-disable-next-line no-await-in-loop
				await new Promise(resolve => {
					setTimeout(resolve, 1000);
				});
				web3Eth
					.sendTransaction({
						to,
						value,
						from,
					})
					.catch(console.error);
			}

			await pr;
			await web3Eth.subscriptionManager?.removeSubscription(sub);
			await closeOpenConnection(web3Eth);
		});
		it.each(subNames)(`clear`, async (subName: SubName) => {
			const web3Eth = new Web3Eth(clientUrl);
			const sub: NewHeadsSubscription = await web3Eth.subscribe(subName);
			expect(sub.id).toBeDefined();
			await web3Eth.subscriptionManager?.removeSubscription(sub);
			expect(sub.id).toBeUndefined();
			await closeOpenConnection(web3Eth);
		});
	});
});
