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
import { DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { Web3PromiEvent } from 'web3-core';
import { TransactionReceipt } from 'web3-types';
import { TransactionBlockTimeoutError } from 'web3-errors';
import { SendTransactionEvents, Web3Eth } from '../../src';

import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	isSocket,
	itIf,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';

import { sendFewTxesWithoutReceipt } from './helper';

const MAX_32_SIGNED_INTEGER = 2147483647;
/* eslint-disable jest/no-standalone-expect */
describe('defaults', () => {
	let web3Eth: Web3Eth;
	let eth2: Web3Eth;
	let clientUrl: string;

	beforeEach(() => {
		clientUrl = getSystemTestProvider();
		web3Eth = new Web3Eth(clientUrl);
	});

	afterEach(async () => {
		await closeOpenConnection(web3Eth);
		await closeOpenConnection(eth2);
	});

	describe('defaults', () => {
		it('should fail if transaction was not mined within `transactionBlockTimeout` blocks', async () => {
			const eth = new Web3Eth(clientUrl);
			const tempAcc1 = await createTempAccount();
			const tempAcc2 = await createTempAccount();

			// Make the test run faster by casing the polling to start after 2 blocks
			eth.transactionBlockTimeout = 2;

			// Increase other timeouts so only `transactionBlockTimeout` would be reached
			eth.transactionSendTimeout = MAX_32_SIGNED_INTEGER;
			eth.transactionPollingTimeout = MAX_32_SIGNED_INTEGER;
			eth.blockHeaderTimeout = MAX_32_SIGNED_INTEGER / 1000;

			const from = tempAcc1.address;
			const to = tempAcc2.address;
			const value = `0x0`;

			// Setting a high `nonce` when sending a transaction, to cause the RPC call to stuck at the Node
			const sentTx: Web3PromiEvent<
				TransactionReceipt,
				SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
			> = eth.sendTransaction({
				to,
				value,
				from,
				// Give a high nonce so the transaction stuck forever.
				// However, make this random to be able to run the test many times without receiving an error that indicate submitting the same transaction twice.
				nonce: Number.MAX_SAFE_INTEGER - Math.floor(Math.random() * 100000000),
			});

			// Some providers (mostly used for development) will make blocks only when there are new transactions
			// So, send 2 transactions, one after another, because in this test `transactionBlockTimeout = 2`.
			// eslint-disable-next-line no-void
			void sendFewTxesWithoutReceipt({
				web3Eth: eth,
				from: tempAcc2.address,
				to: tempAcc1.address,
				times: 2,
				value: '0x1',
			});

			try {
				await sentTx;
				throw new Error(
					'The test should fail if there is no exception when sending a transaction that could not be mined within transactionBlockTimeout',
				);
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error).toBeInstanceOf(TransactionBlockTimeoutError);
				// eslint-disable-next-line jest/no-conditional-expect
				expect((error as Error).message).toMatch(/was not mined within [0-9]+ blocks/);
			}
			await closeOpenConnection(eth);
		});

		// The code of this test case is identical to the pervious one except for `eth.enableExperimentalFeatures = true`
		// 	And this test case will be removed once https://github.com/web3/web3.js/issues/5521 is implemented.
		itIf(isSocket)(
			'should fail if transaction was not mined within `transactionBlockTimeout` blocks - when subscription is used',
			async () => {
				const eth = new Web3Eth(clientUrl);
				await waitForOpenConnection(eth);
				// using subscription to get the new blocks and fire `TransactionBlockTimeoutError` is currently supported only
				//	with `enableExperimentalFeatures.useSubscriptionWhenCheckingBlockTimeout` equal true.
				eth.enableExperimentalFeatures.useSubscriptionWhenCheckingBlockTimeout = true;

				const tempAcc1 = await createTempAccount();
				const tempAcc2 = await createTempAccount();

				// Make the test run faster by casing the polling to start after 2 blocks
				eth.transactionBlockTimeout = 2;

				// Increase other timeouts so only `transactionBlockTimeout` would be reached
				eth.transactionSendTimeout = MAX_32_SIGNED_INTEGER;
				eth.transactionPollingTimeout = MAX_32_SIGNED_INTEGER;
				eth.blockHeaderTimeout = MAX_32_SIGNED_INTEGER / 1000;

				const from = tempAcc1.address;
				const to = tempAcc2.address;
				const value = `0x0`;

				// Setting a high `nonce` when sending a transaction, to cause the RPC call to stuck at the Node
				const sentTx: Web3PromiEvent<
					TransactionReceipt,
					SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
				> = eth.sendTransaction({
					to,
					value,
					from,
					// Give a high nonce so the transaction stuck forever.
					// However, make this random to be able to run the test many times without receiving an error that indicate submitting the same transaction twice.
					nonce: Number.MAX_SAFE_INTEGER - Math.floor(Math.random() * 100000000),
				});

				// Some providers (mostly used for development) will make blocks only when there are new transactions
				// So, send 2 transactions, one after another, because in this test `transactionBlockTimeout = 2`.
				// eslint-disable-next-line no-void
				void sendFewTxesWithoutReceipt({
					web3Eth: eth,
					from: tempAcc2.address,
					to: tempAcc1.address,
					times: 2,
					value: '0x1',
				});

				try {
					await sentTx;
					throw new Error(
						'The test should fail if there is no exception when sending a transaction that could not be mined within transactionBlockTimeout',
					);
				} catch (error) {
					// eslint-disable-next-line jest/no-conditional-expect, jest/no-standalone-expect
					expect(error).toBeInstanceOf(TransactionBlockTimeoutError);
					// eslint-disable-next-line jest/no-conditional-expect, jest/no-standalone-expect
					expect((error as Error).message).toMatch(/was not mined within [0-9]+ blocks/);
				}
				await closeOpenConnection(eth);
			},
		);
	});
});
