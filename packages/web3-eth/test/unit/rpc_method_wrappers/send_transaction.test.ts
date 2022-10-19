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
import { DEFAULT_RETURN_FORMAT, ETH_DATA_FORMAT, format } from 'web3-utils';
import { isNullish } from 'web3-validator';
import { Web3EthExecutionAPI } from 'web3-types';
import { formatTransaction, transactionReceiptSchema } from 'web3-eth-tx-utils';
import * as ethTxUtils from 'web3-eth-tx-utils';

import { sendTransaction } from '../../../src/rpc_method_wrappers';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from './fixtures/send_transaction';

jest.mock('web3-rpc-methods');
jest.mock('web3-eth-tx-utils', () => {
	const actualEthTxUtils = jest.requireActual('web3-eth-tx-utils');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return {
		...actualEthTxUtils,
		waitForTransactionReceipt: jest.fn(),
		getTransactionGasPricing: jest.fn(),
		trySendTransaction: jest.fn(),
		watchTransactionForConfirmations: jest.fn(),
	};
});

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputTransaction: %s\nsendTransactionOptions: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	afterEach(() => jest.resetAllMocks());

	it.each(testData)(
		`getTransactionGasPricing is called only when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const getTransactionGasPricingSpy = jest.spyOn(ethTxUtils, 'getTransactionGasPricing');
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);
			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);

			if (
				sendTransactionOptions?.ignoreGasPricing ||
				!isNullish(inputTransaction.gasPrice) ||
				(!isNullish(inputTransaction.maxPriorityFeePerGas) &&
					!isNullish(inputTransaction.maxFeePerGas))
			)
				// eslint-disable-next-line jest/no-conditional-expect
				expect(getTransactionGasPricingSpy).not.toHaveBeenCalled();
			// eslint-disable-next-line jest/no-conditional-expect
			else expect(getTransactionGasPricingSpy).toHaveBeenCalled();
		},
	);

	it.each(testData)(
		`sending event should emit with formattedTransaction\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const formattedTransaction = formatTransaction(inputTransaction, ETH_DATA_FORMAT);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);
			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			).on('sending', transaction => {
				expect(transaction).toStrictEqual(formattedTransaction);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should call ethRpcMethods.sendTransaction with expected parameters\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);
			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);
			expect(ethTxUtils.trySendTransaction).toHaveBeenCalled();
		},
	);

	it.each(testData)(
		`sent event should emit with formattedTransaction\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const formattedTransaction = formatTransaction(inputTransaction, ETH_DATA_FORMAT);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			).on('sent', transaction => {
				expect(transaction).toStrictEqual(formattedTransaction);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`transactionHash event should emit with expectedTransactionHash\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);
			(ethTxUtils.trySendTransaction as jest.Mock).mockResolvedValue(expectedTransactionHash);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			).on('transactionHash', transactionHash => {
				expect(transactionHash).toStrictEqual(expectedTransactionHash);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should call WaitForTransactionReceipt.waitForTransactionReceipt with expected parameters\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			(ethTxUtils.trySendTransaction as jest.Mock).mockResolvedValue(expectedTransactionHash);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValue(
				expectedTransactionReceipt,
			);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);
			expect(ethTxUtils.waitForTransactionReceipt).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);

	it.each(testData)(
		`waitForTransactionReceipt is called when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const waitForTransactionReceiptSpy = jest
				.spyOn(ethTxUtils, 'waitForTransactionReceipt')
				.mockResolvedValueOnce(expectedTransactionReceipt);

			(ethTxUtils.trySendTransaction as jest.Mock).mockResolvedValue(expectedTransactionHash);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);

			expect(waitForTransactionReceiptSpy).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);

	it.each(testData)(
		`receipt event should emit with expectedTransactionReceipt\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				formattedTransactionReceipt,
			);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			).on('receipt', receiptInfo => {
				expect(receiptInfo).toStrictEqual(formattedTransactionReceipt);
			});

			expect.assertions(1);
		},
	);

	it.each(testData)(
		`should resolve Web3PromiEvent with expectedTransactionReceipt\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				formattedTransactionReceipt,
			);
			expect(
				await sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				),
			).toStrictEqual(formattedTransactionReceipt);
		},
	);

	it.each(testData)(
		`watchTransactionForConfirmations is called when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions) => {
			const watchTransactionForConfirmationsSpy = jest.spyOn(
				ethTxUtils,
				'watchTransactionForConfirmations',
			);
			const formattedTransactionReceipt = format(
				transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			(ethTxUtils.trySendTransaction as jest.Mock).mockResolvedValue(expectedTransactionHash);
			(ethTxUtils.waitForTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				expectedTransactionReceipt,
			);

			const promiEvent = sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			).on('confirmation', () => undefined);

			await promiEvent;

			expect(ethTxUtils.waitForTransactionReceipt).toHaveBeenCalledWith(
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
			);
		},
	);
});
