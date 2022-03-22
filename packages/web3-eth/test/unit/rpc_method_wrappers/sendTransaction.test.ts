import { Web3Context } from 'web3-core';

import * as rpcMethods from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { sendTransaction } from '../../../src/rpc_method_wrappers';
import { formatTransaction } from '../../../src';
import * as GetTransactionGasPricing from '../../../src/utils/get_transaction_gas_pricing';
import { testData } from './fixtures/sendTransaction';

jest.mock('../../../src/rpc_methods');

describe('sendTransaction', () => {
	const testMessage =
		'Title: %s\ninputTransaction: %s\nsendTransactionOptions: %s\nexpectedTransactionHash: %s\nexpectedReceiptInfo: %s\n';

	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`getTransactionGasPricing is called only when expected\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, ___) => {
			const getTransactionGasPricingSpy = jest.spyOn(
				GetTransactionGasPricing,
				'getTransactionGasPricing',
			);

			await sendTransaction(web3Context, inputTransaction, sendTransactionOptions);

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
					web3Context.defaultReturnType,
				);
				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
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
			const formattedTransaction = formatTransaction(
				inputTransaction,
				web3Context.defaultReturnType,
			);
			await sendTransaction(web3Context, inputTransaction, sendTransactionOptions);
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
					web3Context.defaultReturnType,
				);
				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
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
			await sendTransaction(web3Context, inputTransaction, sendTransactionOptions);
			expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedTransactionHash,
			);
		},
	);

	// TODO - test waitForTransactionReceipt

	it.each(testData)(
		`receipt event should emit with expectedReceiptInfo\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, expectedReceiptInfo) => {
			return new Promise(done => {
				(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
					expectedReceiptInfo,
				);

				const promiEvent = sendTransaction(
					web3Context,
					inputTransaction,
					sendTransactionOptions,
				);
				promiEvent.on('receipt', receiptInfo => {
					expect(receiptInfo).toStrictEqual(expectedReceiptInfo);
					done(null);
				});
			});
		},
	);

	it.each(testData)(
		`should resolve promiEvent with expectedReceiptInfo\n ${testMessage}`,
		async (_, inputTransaction, sendTransactionOptions, __, expectedReceiptInfo) => {
			(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
				expectedReceiptInfo,
			);
			expect(
				await sendTransaction(web3Context, inputTransaction, sendTransactionOptions),
			).toStrictEqual(expectedReceiptInfo);
		},
	);

	// TODO - test watchTransactionForConfirmations
});
