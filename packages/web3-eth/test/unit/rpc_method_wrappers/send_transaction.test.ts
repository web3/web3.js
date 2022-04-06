import { Web3Context } from 'web3-core';

import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';
import * as rpcMethods from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { sendTransaction } from '../../../src/rpc_method_wrappers';
import { formatTransaction } from '../../../src';
import * as GetTransactionGasPricing from '../../../src/utils/get_transaction_gas_pricing';
import * as WaitForTransactionReceipt from '../../../src/utils/wait_for_transaction_receipt';
import * as WatchTransactionForConfirmations from '../../../src/utils/watch_transaction_for_confirmations';
import { testData } from './fixtures/send_transaction';
import { receiptInfoSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');
jest.mock('../../../src/utils/wait_for_transaction_receipt');
jest.mock('../../../src/utils/watch_transaction_for_confirmations');

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputTransaction: %s\nsendTransactionOptions: %s\nexpectedTransactionHash: %s\nexpectedReceiptInfo: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	afterEach(() => jest.resetAllMocks());

	it.each(testData)(
		`getTransactionGasPricing is called only when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, ___) => {
			const getTransactionGasPricingSpy = jest.spyOn(
				GetTransactionGasPricing,
				'getTransactionGasPricing',
			);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);

			if (
				sendTransactionOptions?.ignoreGasPricing ||
				inputTransaction.gasPrice !== undefined ||
				(inputTransaction.maxPriorityFeePerGas !== undefined &&
					inputTransaction.maxFeePerGas !== undefined)
			)
				// eslint-disable-next-line jest/no-conditional-expect
				expect(getTransactionGasPricingSpy).not.toHaveBeenCalled();
			// eslint-disable-next-line jest/no-conditional-expect
			else expect(getTransactionGasPricingSpy).toHaveBeenCalled();
		},
	);

	it.each(testData)(
		`sending event should emit with formattedTransaction\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, ___) => {
			return new Promise(done => {
				const formattedTransaction = formatTransaction(
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				);
				promiEvent.on('sending', transaction => {
					expect(transaction).toStrictEqual(formattedTransaction);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`should call rpcMethods.sendTransaction with expected parameters\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, ___) => {
			const formattedTransaction = formatTransaction(inputTransaction, DEFAULT_RETURN_FORMAT);
			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);
			expect(rpcMethods.sendTransaction).toHaveBeenCalledWith(
				web3Context.requestManager,
				formattedTransaction,
			);
		},
	);

	it.each(testData)(
		`sent event should emit with formattedTransaction\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, ___) => {
			return new Promise(done => {
				const formattedTransaction = formatTransaction(
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				);
				promiEvent.on('sent', transaction => {
					expect(transaction).toStrictEqual(formattedTransaction);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`transactionHash event should emit with expectedTransactionHash\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, expectedTransactionHash, __) => {
			return new Promise(done => {
				(rpcMethods.sendTransaction as jest.Mock).mockResolvedValueOnce(
					expectedTransactionHash,
				);

				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				);
				promiEvent.on('transactionHash', transactionHash => {
					expect(transactionHash).toStrictEqual(expectedTransactionHash);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`should call rpcMethods.getTransactionReceipt with expected parameters\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, expectedTransactionHash, __) => {
			(rpcMethods.sendTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);
			expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedTransactionHash,
			);
		},
	);

	it.each(testData)(
		`waitForTransactionReceipt is called when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, expectedTransactionHash, __) => {
			const waitForTransactionReceiptSpy = jest.spyOn(
				WaitForTransactionReceipt,
				'waitForTransactionReceipt',
			);

			(rpcMethods.sendTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(null);

			await sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);

			expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedTransactionHash,
			);
			expect(waitForTransactionReceiptSpy).toHaveBeenCalledWith(
				web3Context,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);

	it.each(testData)(
		`receipt event should emit with expectedReceiptInfo\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, expectedReceiptInfo) => {
			return new Promise(done => {
				const formattedReceiptInfo = format(
					receiptInfoSchema,
					expectedReceiptInfo,
					DEFAULT_RETURN_FORMAT,
				);
				(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
					formattedReceiptInfo,
				);
				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				);
				promiEvent.on('receipt', receiptInfo => {
					expect(receiptInfo).toStrictEqual(formattedReceiptInfo);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`should resolve promiEvent with expectedReceiptInfo\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, expectedReceiptInfo) => {
			const formattedReceiptInfo = format(
				receiptInfoSchema,
				expectedReceiptInfo,
				DEFAULT_RETURN_FORMAT,
			);
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				formattedReceiptInfo,
			);
			expect(
				await sendTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
					sendTransactionOptions,
				),
			).toStrictEqual(formattedReceiptInfo);
		},
	);

	it.each(testData)(
		`watchTransactionForConfirmations is called when expected\n ${testMessage}`,
		async (
			_,
			inputTransaction,
			sendTransactionOptions,
			expectedTransactionHash,
			expectedReceiptInfo,
		) => {
			const watchTransactionForConfirmationsSpy = jest.spyOn(
				WatchTransactionForConfirmations,
				'watchTransactionForConfirmations',
			);
			const formattedReceiptInfo = format(
				receiptInfoSchema,
				expectedReceiptInfo,
				DEFAULT_RETURN_FORMAT,
			);

			(rpcMethods.sendTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				expectedReceiptInfo,
			);

			const promiEvent = sendTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
				sendTransactionOptions,
			);
			promiEvent.on('confirmation', () => undefined);
			await promiEvent;

			expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedTransactionHash,
			);
			expect(watchTransactionForConfirmationsSpy).toHaveBeenCalledWith(
				web3Context,
				promiEvent,
				formattedReceiptInfo,
				expectedTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);
		},
	);
});
