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
import { TransactionPollingTimeoutError, TransactionSendTimeoutError } from 'web3-errors';
import { Web3Eth } from '../../src';

import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
} from '../fixtures/system_test_utils';

describe('defaults', () => {
	let web3Eth: Web3Eth;
	let eth2: Web3Eth;
	let clientUrl: string;
	let tempAcc: { address: string; privateKey: string };

	beforeEach(() => {
		clientUrl = getSystemTestProvider();
		web3Eth = new Web3Eth(clientUrl);
	});

	afterEach(async () => {
		await closeOpenConnection(web3Eth);
		await closeOpenConnection(eth2);
	});
	beforeEach(async () => {
		tempAcc = await createTempAccount();
	});

	describe('defaults', () => {
		it('should fail if Ethereum Node did not respond because of a high nonce', async () => {
			const eth = new Web3Eth(clientUrl);

			// Make the test run faster by causing the timeout to happen after 0.2 second
			eth.transactionSendTimeout = 200;
			eth.transactionPollingTimeout = 200;

			const from = tempAcc.address;
			const to = (await createTempAccount()).address;
			const value = `0x1`;

			try {
				// Setting a high `nonce` when sending a transaction, to cause the RPC call to stuck at the Node
				await eth.sendTransaction({
					to,
					value,
					from,
					// Give a high nonce so the transaction stuck forever.
					// However, make this random to be able to run the test many times without receiving an error that indicate submitting the same transaction twice.
					nonce: Number.MAX_SAFE_INTEGER - Math.floor(Math.random() * 100000000),
				});
				expect(true).toBe(false); // the test should fail if there is no exception
			} catch (error) {
				// Some providers would not respond to the RPC request when sending a transaction (like Ganache v7.4.0)
				if (error instanceof TransactionSendTimeoutError) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(error.message).toContain(
						`connected Ethereum Node did not respond within ${
							eth.transactionSendTimeout / 1000
						} seconds`,
					);
				}
				// Some other providers would not respond when trying to get the transaction receipt (like Geth v1.10.22-unstable)
				else if (error instanceof TransactionPollingTimeoutError) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(error.message).toContain(
						`Transaction was not mined within ${
							eth.transactionPollingTimeout / 1000
						} seconds`,
					);
				} else {
					throw error;
				}
			}
			await closeOpenConnection(eth);
		});
	});
});
