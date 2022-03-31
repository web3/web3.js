import { Web3Context } from 'web3-core';

import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';
import * as rpcMethods from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { sendSignedTransaction } from '../../../src/rpc_method_wrappers';
import * as WaitForTransactionReceipt from '../../../src/utils/wait_for_transaction_receipt';
import * as WatchTransactionForConfirmations from '../../../src/utils/watch_transaction_for_confirmations';
import { testData } from './fixtures/send_signed_transaction';
import { receiptInfoSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');
jest.mock('../../../src/utils/wait_for_transaction_receipt');
jest.mock('../../../src/utils/watch_transaction_for_confirmations');

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedReceiptInfo: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	afterEach(() => jest.resetAllMocks());

	it.each(testData)(
		`sending event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction, __, ___) => {
			return new Promise(done => {
				const promiEvent = sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				promiEvent.on('sending', signedTransaction => {
					expect(signedTransaction).toStrictEqual(inputSignedTransaction);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`should call rpcMethods.sendRawTransaction with expected parameters\n ${testMessage}`,
		async (_, inputSignedTransaction, __, ___) => {
			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(rpcMethods.sendRawTransaction).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputSignedTransaction,
			);
		},
	);

	it.each(testData)(
		`sent event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction, __, ___) => {
			return new Promise(done => {
				const promiEvent = sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				promiEvent.on('sent', signedTransaction => {
					expect(signedTransaction).toStrictEqual(inputSignedTransaction);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`transactionHash event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction, expectedTransactionHash, ___) => {
			return new Promise(done => {
				(rpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
					expectedTransactionHash,
				);

				const promiEvent = sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
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
		async (_, inputSignedTransaction, expectedTransactionHash, ___) => {
			(rpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);
			expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedTransactionHash,
			);
		},
	);

	it.each(testData)(
		`waitForTransactionReceipt is called when expected\n ${testMessage}`,
		async (_, inputSignedTransaction, expectedTransactionHash, ___) => {
			const waitForTransactionReceiptSpy = jest.spyOn(
				WaitForTransactionReceipt,
				'waitForTransactionReceipt',
			);

			(rpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(null);

			await sendSignedTransaction(web3Context, inputSignedTransaction, DEFAULT_RETURN_FORMAT);

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
		`receipt event should emit with inputSignedTransaction\n ${testMessage}`,
		async (_, inputSignedTransaction, __, expectedReceiptInfo) => {
			return new Promise(done => {
				const formattedReceiptInfo = format(
					receiptInfoSchema,
					expectedReceiptInfo,
					DEFAULT_RETURN_FORMAT,
				);

				(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
					expectedReceiptInfo,
				);

				const promiEvent = sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
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
		async (_, inputSignedTransaction, __, expectedReceiptInfo) => {
			const formattedReceiptInfo = format(
				receiptInfoSchema,
				expectedReceiptInfo,
				DEFAULT_RETURN_FORMAT,
			);

			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				expectedReceiptInfo,
			);
			expect(
				await sendSignedTransaction(
					web3Context,
					inputSignedTransaction,
					DEFAULT_RETURN_FORMAT,
				),
			).toStrictEqual(formattedReceiptInfo);
		},
	);

	it.each(testData)(
		`watchTransactionForConfirmations is called when expected\n ${testMessage}`,
		async (_, inputTransaction, expectedTransactionHash, expectedReceiptInfo) => {
			const watchTransactionForConfirmationsSpy = jest.spyOn(
				WatchTransactionForConfirmations,
				'watchTransactionForConfirmations',
			);
			const formattedReceiptInfo = format(
				receiptInfoSchema,
				expectedReceiptInfo,
				DEFAULT_RETURN_FORMAT,
			);

			(rpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
				expectedTransactionHash,
			);
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				expectedReceiptInfo,
			);

			const promiEvent = sendSignedTransaction(
				web3Context,
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
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
