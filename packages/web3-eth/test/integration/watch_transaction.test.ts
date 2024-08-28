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
import { SupportedProviders, TransactionReceipt, DEFAULT_RETURN_FORMAT } from 'web3-types';
import { Web3PromiEvent } from 'web3-core';
import { Web3Account } from 'web3-eth-accounts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3 } from 'web3';
import { SendTransactionEvents } from '../../src';
import {
	getSystemTestProvider,
	describeIf,
	closeOpenConnection,
	isSocket,
	createLocalAccount,
	isIpc,
	sendFewSampleTxs,
	createAccount,
	waitForCondition,
} from '../fixtures/system_test_utils';

const waitConfirmations = 2;
const gas = 30000;
type Resolve = (value?: unknown) => void;

describeIf(isSocket)('watch subscription transaction', () => {
	let web3: Web3;
	let clientUrl: string | SupportedProviders;
	let account1: Web3Account;
	let account2: Web3Account;
	beforeEach(async () => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3(clientUrl);
		account1 = await createLocalAccount(web3);
		account2 = createAccount();
	});
	describe('wait for confirmation subscription', () => {
		it('subscription to heads', async () => {
			web3.eth.setConfig({ transactionConfirmationBlocks: waitConfirmations });

			const sentTx: Web3PromiEvent<
				TransactionReceipt,
				SendTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
			> = web3.eth.sendTransaction({
				from: account1.address,
				to: account2.address,
				value: '0x1',
				gas,
			});

			const receiptPromise = new Promise((resolve: Resolve) => {
				// Tx promise is handled separately
				// eslint-disable-next-line no-void
				void sentTx.on('receipt', (params: TransactionReceipt) => {
					expect(params.status).toBe(BigInt(1));
					resolve();
				});
			});

			let shouldBe = 1;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				// Tx promise is handled separately
				// eslint-disable-next-line no-void
				void sentTx.on('confirmation', ({ confirmations }) => {
					expect(Number(confirmations)).toBeGreaterThanOrEqual(shouldBe);
					shouldBe += 1;
					if (shouldBe >= waitConfirmations) {
						resolve();
					}
				});
			});

			await receiptPromise;
			await sendFewSampleTxs(isIpc ? 2 * waitConfirmations : waitConfirmations);

			const resourcePromise = waitForCondition(
				() => shouldBe >= waitConfirmations,
				async () => {
					sentTx.removeAllListeners();
					await closeOpenConnection(web3);
				},
			);

			await Promise.all([confirmationPromise, resourcePromise]);
		});
	});
});
