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
import { Web3Context } from 'web3-core';
import { format } from 'web3-utils';
import { DEFAULT_RETURN_FORMAT, Web3EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';

import { sendSignedTransaction } from '../../../src/rpc_method_wrappers';
import * as WaitForTransactionReceipt from '../../../src/utils/wait_for_transaction_receipt';
import * as WatchTransactionForConfirmations from '../../../src/utils/watch_transaction_for_confirmations';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from './fixtures/send_signed_transaction';
import { transactionReceiptSchema } from '../../../src/schemas';
import { SendTxHelper } from '../../../src/utils/send_tx_helper';

jest.mock('web3-rpc-methods');
jest.mock('../../../src/utils/wait_for_transaction_receipt');
jest.mock('../../../src/utils/watch_transaction_for_confirmations');

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	afterEach(() => jest.resetAllMocks());

	it.each(testData)(
		`should remove signature part in transaction before checkRevertBeforeSending`,
		async (_, inputSignedTransaction) => {
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			const checkRevertBeforeSendingSpy = jest.fn().mockImplementation(transaction => {
				expect(transaction).toBeDefined();

				// verify signature part is removed before sending to revert check function
				expect(transaction).not.toHaveProperty('v');
				expect(transaction).not.toHaveProperty('r');
				expect(transaction).not.toHaveProperty('s');
			});

			SendTxHelper.prototype.checkRevertBeforeSending = checkRevertBeforeSendingSpy;

			const inputSignedTransactionFormatted = format(
				{ format: 'bytes' },
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			);
			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);

			// verify original tx params are intact
			expect(ethRpcMethods.sendRawTransaction).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputSignedTransactionFormatted,
			);

			expect(checkRevertBeforeSendingSpy).toHaveBeenCalledTimes(1);
		},
	);

	it.each(testData)(
		`sending event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			const inputSignedTransactionFormatted = format(
				{ format: 'bytes' },
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			);
			await sendSignedTransaction(
				web3Context,
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			).on('sending', signedTransaction => {
				expect(signedTransaction).toStrictEqual(inputSignedTransactionFormatted);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should call ethRpcMethods.sendRawTransaction with expected parameters\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			const inputSignedTransactionFormatted = format(
				{ format: 'bytes' },
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			);
			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(ethRpcMethods.sendRawTransaction).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputSignedTransactionFormatted,
			);
		},
	);

	it.each(testData)(
		`sent event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			const inputSignedTransactionFormatted = format(
				{ format: 'bytes' },
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			);

			await sendSignedTransaction(
				web3Context,
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			).on('sent', signedTransaction => {
				expect(signedTransaction).toStrictEqual(inputSignedTransactionFormatted);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`transactionHash event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);

			await sendSignedTransaction(
				web3Context,
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			).on('transactionHash', transactionHash => {
				expect(transactionHash).toStrictEqual(expectedTransactionHash);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should call WaitForTransactionReceipt.waitForTransactionReceipt with expected parameters\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(WaitForTransactionReceipt.waitForTransactionReceipt).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);

	it.each(testData)(
		`waitForTransactionReceipt is called when expected\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			const waitForTransactionReceiptSpy = jest
				.spyOn(WaitForTransactionReceipt, 'waitForTransactionReceipt')
				.mockResolvedValueOnce(expectedTransactionReceipt);

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);

			expect(waitForTransactionReceiptSpy).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);

	it.each(testData)(
		`receipt event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			await sendSignedTransaction(
				web3Context,
				inputSignedTransaction,
				DEFAULT_RETURN_FORMAT,
			).on('receipt', receiptInfo => {
				expect(receiptInfo).toStrictEqual(formattedTransactionReceipt);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should resolve Web3PromiEvent with expectedTransactionReceipt\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);
			expect(
				await sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
				),
			).toStrictEqual(formattedTransactionReceipt);
		},
	);

	it.each(testData)(
		`watchTransactionForConfirmations is called when expected\n ${testMessage}`,
		async (_, inputTransaction) => {
			const watchTransactionForConfirmationsSpy = jest.spyOn(
				WatchTransactionForConfirmations,
				'watchTransactionForConfirmations',
			);
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(
				WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
			).mockResolvedValueOnce(expectedTransactionReceipt);

			const promiEvent = sendSignedTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
			).on('confirmation', () => undefined);

			await promiEvent;

			expect(WaitForTransactionReceipt.waitForTransactionReceipt).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
			expect(watchTransactionForConfirmationsSpy).toHaveBeenCalledWith(
				web3Context,
				promiEvent,
				formattedTransactionReceipt,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
				undefined,
			);
		},
	);
});
