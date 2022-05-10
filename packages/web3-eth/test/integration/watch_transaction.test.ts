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
import { PromiEvent, Web3BaseProvider } from 'web3-common';
import { Web3Eth, SendTransactionEvents, ReceiptInfo } from '../../src';
import { sendFewTxes } from './helper';

import {
	getSystemTestProvider,
	describeIf,
	getSystemTestAccounts,
	// eslint-disable-next-line import/no-relative-packages
} from '../fixtures/system_test_utils';

const waitConfirmations = 5;

type Resolve = (value?: unknown) => void;

describeIf(getSystemTestProvider().startsWith('ws'))('watch subscription transaction', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let accounts: string[] = [];
	let clientUrl: string;

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

	describe('wait for confirmation subscription', () => {
		it('subscription to heads', async () => {
			web3Eth = new Web3Eth(providerWs as Web3BaseProvider);

			// setupWeb3(web3Eth, waitConfirmations);
			web3Eth.setConfig({ transactionConfirmationBlocks: waitConfirmations });

			const from = accounts[0];
			const to = accounts[1];
			const value = `0x1`;
			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
				to,
				value,
				from,
			});

			const receiptPromise = new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			let shouldBe = 2;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on('confirmation', ({ confirmationNumber }) => {
					expect(parseInt(String(confirmationNumber), 16)).toBe(shouldBe);
					shouldBe += 1;
					if (shouldBe >= waitConfirmations) {
						resolve();
					}
				});
			});
			await receiptPromise;
			await sendFewTxes({ web3Eth, from, to, value, times: waitConfirmations });
			await confirmationPromise;
		});
	});
});

describeIf(getSystemTestProvider().startsWith('http'))('watch polling transaction', () => {
	let web3Eth: Web3Eth;
	let accounts: string[] = [];
	let clientUrl: string;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
	});

	describe('wait for confirmation polling', () => {
		it('polling', async () => {
			web3Eth = new Web3Eth(clientUrl);
			web3Eth.setConfig({ transactionConfirmationBlocks: waitConfirmations });

			const from = accounts[0];
			const to = accounts[1];
			const value = `0x1`;

			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
				to,
				value,
				from,
			});
			let shouldBe = 2;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on('confirmation', ({ confirmationNumber }) => {
					expect(parseInt(String(confirmationNumber), 16)).toBe(shouldBe);
					shouldBe += 1;
					if (shouldBe >= waitConfirmations) {
						resolve();
					}
				});
			});
			await new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});

			await sendFewTxes({ web3Eth, from, to, value, times: waitConfirmations });
			await confirmationPromise;
		});
	});
});
