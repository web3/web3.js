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
import { BlockHeaderOutput, Web3 } from 'web3';
import {
	closeOpenConnection,
	describeIf,
	getSystemTestProvider,
	isSocket,
	sendFewSampleTxs,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';
import { Resolve } from './helper';

const checkTxCount = 2;
describeIf(isSocket)('subscription on multiple events', () => {
	test(`catch the data of pendingTransactions and newHeads`, async () => {
		const web3 = new Web3(getSystemTestProvider());
		const web3Eth = web3.eth;
		await waitForOpenConnection(web3Eth);
		const pendingTransactionsSub = await web3Eth.subscribe('pendingTransactions');

		let pendingTransactionsCount = 0;
		const pendingTransactionsData = new Promise((resolve: Resolve, reject) => {
			(() => {
				pendingTransactionsSub.on('data', (data: string) => {
					expect(typeof data).toBe('string');

					pendingTransactionsCount += 1;
					if (pendingTransactionsCount >= checkTxCount) {
						resolve();
					}
				});
				pendingTransactionsSub.on('error', error => {
					reject(error);
				});
			})();
		});

		const newHeadsSub = await web3.eth.subscribe('newHeads');
		let newHeadsCount = 0;
		const newHeadsData = new Promise((resolve: Resolve, reject) => {
			newHeadsSub.on('data', (data: BlockHeaderOutput) => {
				expect(typeof data.parentHash).toBe('string');

				newHeadsCount += 1;
				if (newHeadsCount >= checkTxCount) {
					resolve();
				}
			});
			newHeadsSub.on('error', error => {
				reject(error);
			});
		});

		await sendFewSampleTxs(2);

		await pendingTransactionsData;
		await newHeadsData;

		await closeOpenConnection(web3Eth);
	});

	test(`catch the data of an event even after subscribing off another one`, async () => {
		const web3 = new Web3(getSystemTestProvider());
		const web3Eth = web3.eth;
		await waitForOpenConnection(web3Eth);
		const pendingTransactionsSub = await web3Eth.subscribe('pendingTransactions');

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		pendingTransactionsSub.on('data', () => {});
		pendingTransactionsSub.on('error', error => {
			throw error;
		});

		const newHeadsSub = await web3.eth.subscribe('newHeads');
		let times = 0;
		const newHeadsData = new Promise((resolve: Resolve, reject) => {
			newHeadsSub.on('data', (data: BlockHeaderOutput) => {
				expect(typeof data.parentHash).toBe('string');

				times += 1;
				if (times >= checkTxCount) {
					resolve();
				}
			});
			newHeadsSub.on('error', error => {
				reject(error);
			});
		});

		await pendingTransactionsSub.unsubscribe();

		await sendFewSampleTxs(2);

		await newHeadsData;

		await closeOpenConnection(web3Eth);
	});
});
