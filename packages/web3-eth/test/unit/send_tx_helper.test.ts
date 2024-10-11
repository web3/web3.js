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
import {
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	EthExecutionAPI,
	JsonRpcResponse,
	TransactionReceipt,
	Web3BaseWalletAccount,
	TransactionCall,
} from 'web3-types';
import { Web3Context, Web3EventMap, Web3PromiEvent } from 'web3-core';
import {
	ContractExecutionError,
	InvalidResponseError,
	TransactionRevertInstructionError,
} from 'web3-errors';
import { SendTxHelper } from '../../src/utils/send_tx_helper';
import { getTransactionError } from '../../src/utils/get_transaction_error';
import { getTransactionGasPricing } from '../../src/utils/get_transaction_gas_pricing';
import { getRevertReason } from '../../src/utils/get_revert_reason';
import { trySendTransaction } from '../../src/utils/try_send_transaction';
import { ERC20TokenAbi } from '../fixtures/erc20';
import { SendSignedTransactionEvents, SendTransactionEvents } from '../../src';

const utils = {
	getTransactionError,
	getRevertReason,
	trySendTransaction,
	getTransactionGasPricing,
};
jest.mock('../../src/utils/get_transaction_gas_pricing');
jest.mock('../../src/utils/try_send_transaction');
jest.mock('../../src/utils/get_transaction_error');
jest.mock('../../src/utils/get_revert_reason');

type PromiEvent = Web3PromiEvent<
	TransactionReceipt,
	SendSignedTransactionEvents<DataFormat> | SendTransactionEvents<DataFormat>
>;
const receipt = {
	transactionHash: '0x559e12c4d679f66ff234ad2075a0953793692bdd3a9d9f12def5edc5d7cc2eec',
	transactionIndex: BigInt(0),
	blockNumber: BigInt(38),
	blockHash: '0xc238b3b27edd12846afc824e4f36ebd7e6dcf35914af631f181ebc05127dd553',
	from: '0x53a179dfe130c7b4054f7e6e7f1928777d7e7bbd',
	to: '0xead2356c468ce5443bd7cbb2caaeb48266b7f31f',
	cumulativeGasUsed: BigInt(47521),
	gasUsed: BigInt(47521),
	logs: [
		{
			address: '0xead2356c468ce5443bd7cbb2caaeb48266b7f31f',
			blockHash: '0xc238b3b27edd12846afc824e4f36ebd7e6dcf35914af631f181ebc05127dd553',
			blockNumber: BigInt(38),
			data: '0x000000000000000000000000000000000000000000000000000000000000000a',
			logIndex: BigInt(0),
			removed: false,
			topics: [
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				'0x00000000000000000000000051623651024932936d00d36a93594db5684fbbb3',
				'0x00000000000000000000000003095dc4857bb26f3a4550c5651df8b7f6b6b1ef',
			],
			transactionHash: '0x559e12c4d679f66ff234ad2075a0953793692bdd3a9d9f12def5edc5d7cc2eec',
			transactionIndex: BigInt(0),
		},
	],
	logsBloom:
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000800000000000008000000000000000000020000001000000002000000000000000000000000000200000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000008000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000',
	status: BigInt(1),
	effectiveGasPrice: BigInt(2506532645),
	type: BigInt(2),
};

describe('sendTxHelper class', () => {
	let sendTxHelper: SendTxHelper<DataFormat>;
	let promiEvent: Web3PromiEvent<TransactionReceipt, Web3EventMap>;
	let web3Context: Web3Context<EthExecutionAPI>;
	beforeEach(() => {
		jest.clearAllMocks();
		web3Context = new Web3Context<EthExecutionAPI>();
		promiEvent = new Web3PromiEvent<TransactionReceipt, Web3EventMap>(resolve => {
			resolve({} as unknown as TransactionReceipt);
		});
		sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {
				contractAbi: ERC20TokenAbi,
			},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});
	});
	it('constructor', () => {
		expect(sendTxHelper).toBeDefined();
		// @ts-expect-error get private property
		expect(sendTxHelper.promiEvent).toBe(promiEvent);
		// @ts-expect-error get private property
		expect(sendTxHelper.web3Context).toBe(web3Context);
		// @ts-expect-error get private property
		expect(sendTxHelper.returnFormat).toBe(DEFAULT_RETURN_FORMAT);
	});
	it('getReceiptWithEvents', () => {
		const res = sendTxHelper.getReceiptWithEvents(receipt as unknown as TransactionReceipt);
		expect(res?.events?.Transfer.address).toBeDefined();
	});
	it('emit sending', async () => {
		const f = jest.fn();
		await promiEvent.on('sending', f);
		sendTxHelper.emitSending(receipt);
		expect(f).toHaveBeenCalledWith(receipt);
		promiEvent.off('sending', f);
	});
	it('emit emitSent', async () => {
		const f = jest.fn();
		await promiEvent.on('sent', f);
		sendTxHelper.emitSent(receipt);
		expect(f).toHaveBeenCalledWith(receipt);
		promiEvent.off('sent', f);
	});
	it('emit emitTransactionHash', async () => {
		const f = jest.fn();
		await promiEvent.on('transactionHash', f);
		sendTxHelper.emitTransactionHash(receipt.transactionHash as string & Uint8Array);
		expect(f).toHaveBeenCalledWith(receipt.transactionHash);
		promiEvent.off('transactionHash', f);
	});
	it('emit emitReceipt', async () => {
		const f = jest.fn();
		await promiEvent.on('receipt', f);
		sendTxHelper.emitReceipt(receipt as TransactionReceipt);
		expect(f).toHaveBeenCalledWith(receipt);
		promiEvent.off('receipt', f);
	});
	it('emit handleError', async () => {
		const f = jest.fn();
		await promiEvent.on('error', f);
		const error = new InvalidResponseError({} as JsonRpcResponse);
		await sendTxHelper.handleError({ error, tx: receipt });
		expect(f).toHaveBeenCalledWith(error);
		promiEvent.off('error', f);
	});

	it('add gas to simple transaction in checkRevertBeforeSending', async () => {
		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {
				checkRevertBeforeSending: true,
			},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});

		const tx = { from: '0x' } as TransactionCall;

		await _sendTxHelper.checkRevertBeforeSending(tx);

		const expectedTx = {
			...tx,
			gas: 21000,
		};
		expect(utils.getRevertReason).toHaveBeenCalledWith(web3Context, expectedTx, undefined);
	});
	it('emit handleError with handleRevert', async () => {
		const error = new ContractExecutionError({ code: 1, message: 'error' });
		web3Context.handleRevert = true;
		jest.spyOn(utils, 'getTransactionError').mockResolvedValue(
			error as unknown as TransactionRevertInstructionError,
		);
		await sendTxHelper.handleError({ error, tx: receipt });
		expect(utils.getTransactionError).toHaveBeenCalled();
	});
	it('emit handleResolve', async () => {
		const f = jest.fn();
		const error = new TransactionRevertInstructionError('error');
		jest.spyOn(utils, 'getTransactionError').mockResolvedValue(error);
		await promiEvent.on('error', f);

		await expect(async () => {
			await sendTxHelper.handleResolve({
				receipt: { ...receipt, status: BigInt(0) } as TransactionReceipt,
				tx: receipt,
			});
			expect(utils.getTransactionError).toHaveBeenCalled();
			expect(f).toHaveBeenCalledWith(error);
			promiEvent.off('error', f);
		}).rejects.toThrow();
	});
	it('emit checkRevertBeforeSending', async () => {
		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {
				checkRevertBeforeSending: true,
			},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});
		const error = new TransactionRevertInstructionError('error');
		jest.spyOn(utils, 'getRevertReason').mockResolvedValue(error);
		await expect(_sendTxHelper.checkRevertBeforeSending(receipt)).rejects.toThrow();
		expect(utils.getRevertReason).toHaveBeenCalled();
	});
	it('emit handleResolve with transactionResolver', async () => {
		const f = jest.fn();

		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {
				transactionResolver: f,
			},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});

		await _sendTxHelper.handleResolve({ receipt: receipt as TransactionReceipt, tx: receipt });
		expect(f).toHaveBeenCalledWith(receipt);
	});
	it('emit populateGasPrice', async () => {
		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {
				ignoreGasPricing: false,
			},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});
		const receiptWithoutGas = {
			...receipt,
			gasPrice: undefined,
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};
		const populatedReceipt = { ...receiptWithoutGas, gasPrice: 1 };
		jest.spyOn(utils, 'getTransactionGasPricing').mockResolvedValue(populatedReceipt);
		const result = await _sendTxHelper.populateGasPrice({
			transaction: receiptWithoutGas,
			transactionFormatted: receiptWithoutGas,
		});
		expect(result).toStrictEqual(populatedReceipt);
		expect(utils.getTransactionGasPricing).toHaveBeenCalled();
	});
	it('emit signAndSend', async () => {
		jest.spyOn(utils, 'trySendTransaction').mockResolvedValue('success');
		const wallet = {
			signTransaction: jest.fn(() => ({
				transactionHash: receipt.transactionHash,
				rawTransaction: receipt,
			})),
		};
		const result = await sendTxHelper.signAndSend({
			tx: receipt,
			wallet: wallet as unknown as Web3BaseWalletAccount,
		});
		expect(result).toBe('success');
		expect(utils.trySendTransaction).toHaveBeenCalled();
		expect(wallet.signTransaction).toHaveBeenCalledWith(receipt);
	});
	it('should not call getTransactionGasPricing when ignoreGasPricing is true', async () => {
		web3Context.config.ignoreGasPricing = true;
		const transaction = {
			from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
			input: '0x68656c6c6f21',
			nonce: '0x15',
			to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
			value: '0xf3dbb76162000',
			type: '0x0',
			chainId: '0x1',
		};
		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});
		await _sendTxHelper.populateGasPrice({
			transactionFormatted: transaction,
			transaction,
		});
		expect(getTransactionGasPricing).not.toHaveBeenCalled();
	});
	it('should call getTransactionGasPricing when ignoreGasPricing is false', async () => {
		web3Context.config.ignoreGasPricing = false;
		const transaction = {
			from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
			input: '0x68656c6c6f21',
			nonce: '0x15',
			to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
			value: '0xf3dbb76162000',
			type: '0x0',
			chainId: '0x1',
		};
		const _sendTxHelper = new SendTxHelper({
			web3Context,
			promiEvent: promiEvent as PromiEvent,
			options: {},
			returnFormat: DEFAULT_RETURN_FORMAT,
		});
		await _sendTxHelper.populateGasPrice({
			transactionFormatted: transaction,
			transaction,
		});
		expect(getTransactionGasPricing).toHaveBeenCalled();
	});
});
