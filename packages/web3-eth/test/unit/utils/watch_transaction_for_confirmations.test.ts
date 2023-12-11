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
import { Web3Context, Web3PromiEvent } from 'web3-core';
import { format } from 'web3-utils';
import { DEFAULT_RETURN_FORMAT, TransactionReceipt, Web3EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import {
	TransactionMissingReceiptOrBlockHashError,
	TransactionReceiptMissingBlockNumberError,
} from 'web3-errors';
import * as rpcMethodWrappers from '../../../src/rpc_method_wrappers';
import * as WaitForTransactionReceipt from '../../../src/utils/wait_for_transaction_receipt';

import * as WatchTransactionForConfirmations from '../../../src/utils/watch_transaction_for_confirmations';
import * as WatchTransactionByPolling from '../../../src/utils/watch_transaction_by_polling';
import * as WatchTransactionBySubscription from '../../../src/utils/watch_transaction_by_subscription';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from '../rpc_method_wrappers/fixtures/send_signed_transaction';
import { transactionReceiptSchema } from '../../../src/schemas';
import { SendSignedTransactionEvents } from '../../../src/types';

jest.mock('web3-rpc-methods');
jest.mock('../../../src/utils/wait_for_transaction_receipt');
jest.mock('../../../src/utils/watch_transaction_by_polling');
jest.mock('../../../src/utils/watch_transaction_by_subscription');

const testMessage =
	'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';
describe('watchTransactionForConfirmations', () => {
	describe('should throw when transaction receipt has something wrong', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeAll(() => {
			web3Context = new Web3Context(
				// dummy provider that does not supports subscription
				{
					request: jest.fn(),
					supportsSubscriptions: () => false,
				},
			);
		});

		afterEach(() => jest.resetAllMocks());

		it(`should throw when transactionReceipt is undefined`, () => {
			expect(() =>
				WatchTransactionForConfirmations.watchTransactionForConfirmations(
					web3Context,
					undefined as unknown as Web3PromiEvent<
						TransactionReceipt,
						SendSignedTransactionEvents<typeof DEFAULT_RETURN_FORMAT>
					>,
					undefined as unknown as TransactionReceipt,
					expectedTransactionHash,
					DEFAULT_RETURN_FORMAT,
				),
			).toThrow(TransactionMissingReceiptOrBlockHashError);
		});

		it(`should throw when transactionReceipt does not have a blockHash`, () => {
			expect(() =>
				WatchTransactionForConfirmations.watchTransactionForConfirmations(
					web3Context,
					undefined as any,
					{ blockHash: undefined } as unknown as TransactionReceipt,
					expectedTransactionHash,
					DEFAULT_RETURN_FORMAT,
				),
			).toThrow(TransactionMissingReceiptOrBlockHashError);
		});

		it(`should throw when transactionReceipt does not have a blockNumber`, () => {
			expect(() =>
				WatchTransactionForConfirmations.watchTransactionForConfirmations(
					web3Context,
					undefined as any,
					{ blockHash: '0x', blockNumber: undefined } as unknown as TransactionReceipt,
					expectedTransactionHash,
					DEFAULT_RETURN_FORMAT,
				),
			).toThrow(TransactionReceiptMissingBlockNumberError);
		});
	});

	describe('should call watchTransactionBySubscription when the provider supports subscription', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeAll(() => {
			web3Context = new Web3Context(
				// dummy provider that supports subscription
				{
					request: jest.fn(),
					supportsSubscriptions: () => true,
				},
			);
		});

		afterEach(() => jest.resetAllMocks());

		it.each(testData)(
			`watchTransactionForConfirmations logic\n ${testMessage}`,
			async (_, inputTransaction) => {
				const formattedTransactionReceipt = format(
					transactionReceiptSchema,
					expectedTransactionReceipt,
					DEFAULT_RETURN_FORMAT,
				);

				(
					WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
				).mockResolvedValueOnce(expectedTransactionReceipt);

				(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
					expectedTransactionHash,
				);

				const promiEvent = rpcMethodWrappers.sendSignedTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);

				jest.spyOn(
					WatchTransactionBySubscription,
					'watchTransactionBySubscription',
				).mockResolvedValueOnce(undefined as never);

				WatchTransactionForConfirmations.watchTransactionForConfirmations(
					web3Context,
					promiEvent,
					formattedTransactionReceipt,
					expectedTransactionHash,
					DEFAULT_RETURN_FORMAT,
				);

				await promiEvent;

				expect(
					WatchTransactionBySubscription.watchTransactionBySubscription,
				).toHaveBeenCalledWith({
					web3Context,
					transactionReceipt: formattedTransactionReceipt,
					transactionPromiEvent: promiEvent,
					returnFormat: DEFAULT_RETURN_FORMAT,
				});
			},
		);
	});

	describe('should call watchTransactionByPolling when the provider does not support subscription', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeAll(() => {
			web3Context = new Web3Context(
				// dummy provider that does not supports subscription
				{
					request: jest.fn(),
					supportsSubscriptions: () => false,
				},
			);
		});

		afterEach(() => jest.resetAllMocks());

		it.each(testData)(
			`watchTransactionForConfirmations logic\n ${testMessage}`,
			async (_, inputTransaction) => {
				const formattedTransactionReceipt = format(
					transactionReceiptSchema,
					expectedTransactionReceipt,
					DEFAULT_RETURN_FORMAT,
				);

				(
					WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
				).mockResolvedValueOnce(expectedTransactionReceipt);

				(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
					expectedTransactionHash,
				);

				const promiEvent = rpcMethodWrappers.sendSignedTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);

				jest.spyOn(
					WatchTransactionByPolling,
					'watchTransactionByPolling',
				).mockResolvedValueOnce(undefined as never);

				WatchTransactionForConfirmations.watchTransactionForConfirmations(
					web3Context,
					promiEvent,
					formattedTransactionReceipt,
					expectedTransactionHash,
					DEFAULT_RETURN_FORMAT,
				);

				await promiEvent;

				expect(WatchTransactionByPolling.watchTransactionByPolling).toHaveBeenCalledWith({
					web3Context,
					transactionReceipt: formattedTransactionReceipt,
					transactionPromiEvent: promiEvent,
					returnFormat: DEFAULT_RETURN_FORMAT,
				});
			},
		);
	});
});
