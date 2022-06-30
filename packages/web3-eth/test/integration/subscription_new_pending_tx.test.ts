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
import WebSocketProvider from 'web3-providers-ws';
import { ReceiptInfo, Web3BaseProvider } from 'web3-common';
import { Web3Eth } from '../../src';
import { sendFewTxes, Resolve } from './helper';
import { NewPendingTransactionsSubscription } from '../../src/web3_subscriptions';
import {
	describeIf,
	getSystemTestAccounts,
	getSystemTestProvider,
	isWs,
} from '../fixtures/system_test_utils';

const checkTxCount = 5;

type SubName = 'pendingTransactions' | 'newPendingTransactions';
const subNames: SubName[] = ['pendingTransactions', 'newPendingTransactions'];

describeIf(isWs)('subscription', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let clientUrl: string;
	let accounts: string[] = [];
	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
		providerWs = new WebSocketProvider(
			clientUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('new pending transaction', () => {
		it.each(subNames)(`wait ${checkTxCount} transaction - ${subNames[0]}`, async subName => {
			web3Eth = new Web3Eth(providerWs as Web3BaseProvider);
			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(subName);
			const from = accounts[0];
			const to = accounts[1];
			const value = `0x1`;

			let times = 0;
			const txHashes: string[] = [];
			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', (data: string) => {
					txHashes.push(data);
					times += 1;
					if (times >= checkTxCount) {
						resolve();
					}
				});
			});

			const receipts = (await sendFewTxes({
				web3Eth,
				from,
				to,
				value,
				times: checkTxCount,
			})) as ReceiptInfo[];
			await pr;
			expect(receipts.map((r: ReceiptInfo) => r?.transactionHash)).toEqual(txHashes);
			await web3Eth.clearSubscriptions();
		});
		it.each(subNames)(`clear`, async (subName: SubName) => {
			web3Eth = new Web3Eth(providerWs as Web3BaseProvider);
			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(subName);
			expect(sub.id).toBeDefined();
			await web3Eth.clearSubscriptions();
			expect(sub.id).toBeUndefined();
		});
	});
});
