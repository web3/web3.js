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
import { BlockHeaderOutput, SupportedProviders } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3 } from 'web3';
import { Web3Eth, NewHeadsSubscription } from '../../src';
import { Resolve } from './helper';
import {
	closeOpenConnection,
	describeIf,
	getSystemTestProvider,
	isSocket,
	sendFewSampleTxs,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';

const checkTxCount = 2;
describeIf(isSocket)('subscription', () => {
	let clientUrl: string | SupportedProviders;
	let web3: Web3;
	beforeEach(() => {
		clientUrl = getSystemTestProvider();
	});
	describe('heads', () => {
		it(`wait for ${checkTxCount} newHeads`, async () => {
			web3 = new Web3(clientUrl);
			const sub = await web3.eth.subscribe('newHeads');
			await waitForOpenConnection(web3.eth);
			let times = 0;
			const pr = new Promise((resolve: Resolve, reject) => {
				sub.on('data', (data: BlockHeaderOutput) => {
					if (data.parentHash) {
						times += 1;
					}
					expect(times).toBeGreaterThanOrEqual(times);
					if (times >= checkTxCount) {
						resolve();
					}
				});
				sub.on('error', error => {
					reject(error);
				});
			});
			// eslint-disable-next-line no-void
			void sendFewSampleTxs(checkTxCount);

			await pr;
			sub.off('data', () => {
				// do nothing
			});
			await web3.eth.subscriptionManager?.removeSubscription(sub);
			await closeOpenConnection(web3.eth);
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
