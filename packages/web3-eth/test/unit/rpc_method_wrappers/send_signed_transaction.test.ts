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
import { DEFAULT_RETURN_FORMAT, format } from 'web3-utils';
import { Web3EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import * as web3TxUtils from 'web3-eth-tx-utils';
import * as ethTxUtils from 'web3-eth-tx-utils';

import { sendSignedTransaction } from '../../../src/rpc_method_wrappers';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from './fixtures/send_signed_transaction';

jest.mock('web3-rpc-methods');
jest.mock('web3-eth-tx-utils');

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	afterEach(() => jest.resetAllMocks());

	it.each(testData)(
		`sending event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);

			const inputSignedTransactionFormatted = format(
				{ eth: 'bytes' },
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
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);
			const trySendTransactionSpy = jest
				.spyOn(ethTxUtils, 'trySendTransaction')
				.mockResolvedValueOnce(expectedTransactionHash);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(trySendTransactionSpy).toHaveBeenCalled();
		},
	);

	it.each(testData)(
		`sent event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);

			const inputSignedTransactionFormatted = format(
				{ eth: 'bytes' },
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
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);
			jest.spyOn(ethTxUtils, 'trySendTransaction').mockResolvedValueOnce(
				expectedTransactionHash,
			);

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
		`should call waitForTransactionReceipt with expected parameters\n ${testMessage}`,
		async (_, inputSignedTransaction) => {
			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);
			jest.spyOn(ethTxUtils, 'trySendTransaction').mockResolvedValueOnce(
				expectedTransactionHash,
			);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(ethTxUtils.waitForTransactionReceipt).toHaveBeenCalledWith(
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
				.spyOn(web3TxUtils, 'waitForTransactionReceipt')
				.mockResolvedValueOnce(expectedTransactionReceipt);

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			jest.spyOn(ethTxUtils, 'trySendTransaction').mockResolvedValueOnce(
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
				ethTxUtils.transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);

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
				ethTxUtils.transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);
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
				web3TxUtils,
				'watchTransactionForConfirmations',
			);
			const formattedTransactionReceipt = format(
				ethTxUtils.transactionReceiptSchema,
				expectedTransactionReceipt,
				DEFAULT_RETURN_FORMAT,
			);

			(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			jest.spyOn(ethTxUtils, 'waitForTransactionReceipt').mockResolvedValueOnce(
				expectedTransactionReceipt,
			);
			jest.spyOn(ethTxUtils, 'trySendTransaction').mockResolvedValueOnce(
				expectedTransactionHash,
			);

			const promiEvent = sendSignedTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
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
