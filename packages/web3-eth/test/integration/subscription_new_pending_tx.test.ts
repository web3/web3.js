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
import { Web3Eth, NewPendingTransactionsSubscription } from '../../src';
import { sendFewTxes } from './helper';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProvider,
	isIpc,
	isSocket,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';

const checkTxCount = 2;

describeIf(isSocket && !isIpc)('subscription', () => {
	describe('new pending transaction', () => {
		it(`wait ${checkTxCount} transaction - %s`, async () => {
			const web3Eth = new Web3Eth(getSystemTestProvider());
			const [tempAcc, tempAcc2] = await Promise.all([
				createTempAccount(),
				createTempAccount(),
			]);
			await waitForOpenConnection(web3Eth);

			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(
				'pendingTransactions',
			);
			const from = tempAcc.address;
			const to = tempAcc2.address;
			const value = `0x1`;

			let times = 0;
			const txHashes: string[] = [];
			let receipts: string[] = [];

			const pr = new Promise((resolve: (s?: string) => void) => {
				(async () => {
					let waitList: string[] = [];
					sub.on('data', (data: string) => {
						if (receipts.length > 0 && waitList.length > 0) {
							for (const hash of waitList) {
								if (receipts.includes(hash)) {
									txHashes.push(hash);
									times += 1;
								}
							}
							waitList = [];
						}
						if (receipts.length > 0 && receipts.includes(data)) {
							txHashes.push(data);
							times += 1;
						} else {
							waitList.push(data);
						}

						if (times >= checkTxCount) {
							resolve();
						}
					});
					receipts = (
						await sendFewTxes({
							web3Eth,
							from,
							to,
							value,
							times: isIpc ? checkTxCount * 3 : checkTxCount,
						})
					).map(r => String(r?.transactionHash));
					if (receipts.length > 0 && waitList.length > 0) {
						for (const hash of waitList) {
							if (receipts.includes(hash)) {
								txHashes.push(hash);
								times += 1;
							}
						}
						waitList = [];
					}
					if (times >= checkTxCount) {
						sub.off('data', () => {
							// no need to do anything
						});
						resolve();
					}
				})().catch(console.error);
			});
			await pr;
			for (const hash of txHashes) {
				expect(receipts).toContain(hash);
			}
			await closeOpenConnection(web3Eth);
		});
		it(`clear`, async () => {
			const web3Eth = new Web3Eth(getSystemTestProvider());
			await waitForOpenConnection(web3Eth);
			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(
				'pendingTransactions',
			);
			expect(sub.id).toBeDefined();
			await web3Eth.subscriptionManager?.removeSubscription(sub);
			expect(sub.id).toBeUndefined();
			await closeOpenConnection(web3Eth);
		});
	});
});
