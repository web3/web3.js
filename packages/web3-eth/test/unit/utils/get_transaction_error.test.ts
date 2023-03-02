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
import {
	InvalidResponseError,
	TransactionRevertedWithoutReasonError,
	TransactionRevertInstructionError,
	TransactionRevertWithCustomError,
} from 'web3-errors';

import * as GetRevertReasonUtils from '../../../src/utils/get_revert_reason';
import { getTransactionError } from '../../../src/utils/get_transaction_error';
import { SimpleRevertAbi } from '../../fixtures/simple_revert';

describe('getTransactionError', () => {
	let web3Context: Web3Context;

	beforeEach(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call parseTransactionError to get error from receivedError', async () => {
		const parseTransactionErrorSpy = jest.spyOn(GetRevertReasonUtils, 'parseTransactionError');

		const receivedError = new InvalidResponseError(
			{
				jsonrpc: '2.0',
				id: '3f839900-afdd-4553-bca7-b4e2b835c687',
				error: { code: -32000, message: 'intrinsic gas too low' },
			},
			{
				jsonrpc: '2.0',
				id: '2568856d-8ee5-43f4-a8db-dbd22cf97a53',
				method: 'eth_sendTransaction',
				params: [
					{
						from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
						to: '0x0000000000000000000000000000000000000000',
						value: '0x1',
						gas: '0x1',
						gasPrice: '0x15b61074',
						maxPriorityFeePerGas: undefined,
						maxFeePerGas: undefined,
					},
				],
			},
		);
		await getTransactionError(web3Context, undefined, undefined, receivedError);
		expect(parseTransactionErrorSpy).toHaveBeenCalledWith(receivedError);
	});

	it('should call getRevertReason to get error from transactionFormatted without contractAbi', async () => {
		const getRevertReasonSpy = jest
			.spyOn(GetRevertReasonUtils, 'getRevertReason')
			.mockImplementation();

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		web3Context.handleRevert = true;
		await getTransactionError(web3Context, transaction);
		expect(getRevertReasonSpy).toHaveBeenCalledWith(web3Context, transaction, undefined);
	});

	it('should call getRevertReason to get error from transactionFormatted with contractAbi', async () => {
		const getRevertReasonSpy = jest
			.spyOn(GetRevertReasonUtils, 'getRevertReason')
			.mockImplementation();

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		web3Context.handleRevert = true;
		await getTransactionError(web3Context, transaction, undefined, undefined, SimpleRevertAbi);
		expect(getRevertReasonSpy).toHaveBeenCalledWith(web3Context, transaction, SimpleRevertAbi);
	});

	describe('TransactionRevertedWithoutReasonError', () => {
		it('should throw TransactionRevertedWithoutReasonError without receipt', async () => {
			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};

			expect(await getTransactionError(web3Context, transaction)).toMatchObject(
				new TransactionRevertedWithoutReasonError(),
			);
		});

		it('should throw TransactionRevertedWithoutReasonError with receipt', async () => {
			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};
			const receipt = {
				transactionHash:
					'0x55de60905fb9efdaa5dc5ac6a2e05736e92067d44b8a3077c80ec849545cbcf0',
				transactionIndex: BigInt(0),
				blockHash: '0xc150c0a7f7f5c9014ea965d19b1be5f5ced07a6b17ea3b1126769d745dde9b2d',
				blockNumber: BigInt(16738176),
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				cumulativeGasUsed: BigInt(23605),
				gasUsed: BigInt(23605),
				effectiveGasPrice: BigInt(2000000000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				root: '',
				status: BigInt(0),
				type: BigInt(0),
			};

			expect(await getTransactionError(web3Context, transaction, receipt)).toMatchObject(
				new TransactionRevertedWithoutReasonError(receipt),
			);
		});
	});

	describe('TransactionRevertInstructionError', () => {
		it('should throw TransactionRevertInstructionError without transaction and receipt', async () => {
			const receivedError = new InvalidResponseError(
				{
					jsonrpc: '2.0',
					id: '3f839900-afdd-4553-bca7-b4e2b835c687',
					error: { code: -32000, message: 'intrinsic gas too low' },
				},
				{
					jsonrpc: '2.0',
					id: '2568856d-8ee5-43f4-a8db-dbd22cf97a53',
					method: 'eth_sendTransaction',
					params: [
						{
							from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
							to: '0x0000000000000000000000000000000000000000',
							value: '0x1',
							gas: '0x1',
							gasPrice: '0x15b61074',
							maxPriorityFeePerGas: undefined,
							maxFeePerGas: undefined,
						},
					],
				},
			);

			expect(
				await getTransactionError(web3Context, undefined, undefined, receivedError),
			).toMatchObject(new TransactionRevertInstructionError('intrinsic gas too low'));
		});

		it('should throw TransactionRevertInstructionError without transaction and with receipt', async () => {
			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};
			const receipt = {
				transactionHash:
					'0x55de60905fb9efdaa5dc5ac6a2e05736e92067d44b8a3077c80ec849545cbcf0',
				transactionIndex: BigInt(0),
				blockHash: '0xc150c0a7f7f5c9014ea965d19b1be5f5ced07a6b17ea3b1126769d745dde9b2d',
				blockNumber: BigInt(16738176),
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				cumulativeGasUsed: BigInt(23605),
				gasUsed: BigInt(23605),
				effectiveGasPrice: BigInt(2000000000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				root: '',
				status: BigInt(0),
				type: BigInt(0),
			};
			const receivedError = new InvalidResponseError(
				{
					jsonrpc: '2.0',
					id: '3f839900-afdd-4553-bca7-b4e2b835c687',
					error: { code: -32000, message: 'intrinsic gas too low' },
				},
				{
					jsonrpc: '2.0',
					id: '2568856d-8ee5-43f4-a8db-dbd22cf97a53',
					method: 'eth_sendTransaction',
					params: [
						{
							from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
							to: '0x0000000000000000000000000000000000000000',
							value: '0x1',
							gas: '0x1',
							gasPrice: '0x15b61074',
							maxPriorityFeePerGas: undefined,
							maxFeePerGas: undefined,
						},
					],
				},
			);

			expect(
				await getTransactionError(web3Context, transaction, receipt, receivedError),
			).toMatchObject(
				new TransactionRevertInstructionError('intrinsic gas too low', undefined, receipt),
			);
		});

		it('should throw TransactionRevertInstructionError without receipt', async () => {
			jest.spyOn(GetRevertReasonUtils, 'getRevertReason').mockResolvedValueOnce({
				reason: 'execution reverted',
				signature: '0xc85bda60',
				data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
			});

			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};

			web3Context.handleRevert = true;
			expect(
				await getTransactionError(
					web3Context,
					transaction,
					undefined,
					undefined,
					SimpleRevertAbi,
				),
			).toMatchObject(
				new TransactionRevertInstructionError(
					'execution reverted',
					'0xc85bda60',
					undefined,
					'000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				),
			);
		});

		it('should throw TransactionRevertInstructionError with receipt', async () => {
			jest.spyOn(GetRevertReasonUtils, 'getRevertReason').mockResolvedValueOnce({
				reason: 'execution reverted',
				signature: '0xc85bda60',
				data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
			});

			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};
			const receipt = {
				transactionHash:
					'0x55de60905fb9efdaa5dc5ac6a2e05736e92067d44b8a3077c80ec849545cbcf0',
				transactionIndex: BigInt(0),
				blockHash: '0xc150c0a7f7f5c9014ea965d19b1be5f5ced07a6b17ea3b1126769d745dde9b2d',
				blockNumber: BigInt(16738176),
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				cumulativeGasUsed: BigInt(23605),
				gasUsed: BigInt(23605),
				effectiveGasPrice: BigInt(2000000000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				root: '',
				status: BigInt(0),
				type: BigInt(0),
			};

			web3Context.handleRevert = true;
			expect(
				await getTransactionError(
					web3Context,
					transaction,
					receipt,
					undefined,
					SimpleRevertAbi,
				),
			).toMatchObject(
				new TransactionRevertInstructionError(
					'execution reverted',
					'0xc85bda60',
					receipt,
					'000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				),
			);
		});
	});

	describe('TransactionRevertWithCustomError', () => {
		it('should throw TransactionRevertWithCustomError without receipt', async () => {
			jest.spyOn(GetRevertReasonUtils, 'getRevertReason').mockResolvedValueOnce({
				reason: 'execution reverted',
				signature: '0xc85bda60',
				data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				customErrorName: 'ErrorWithParams',
				customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
				customErrorArguments: {
					code: BigInt(42),
					message: 'This is an error with params',
				},
			});

			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};

			web3Context.handleRevert = true;
			expect(
				await getTransactionError(
					web3Context,
					transaction,
					undefined,
					undefined,
					SimpleRevertAbi,
				),
			).toMatchObject(
				new TransactionRevertWithCustomError(
					'execution reverted',
					'ErrorWithParams',
					'ErrorWithParams(uint256,string)',
					{
						code: BigInt(42),
						message: 'This is an error with params',
					},
					'0xc85bda60',
					undefined,
					'000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				),
			);
		});

		it('should throw TransactionRevertWithCustomError with receipt', async () => {
			jest.spyOn(GetRevertReasonUtils, 'getRevertReason').mockResolvedValueOnce({
				reason: 'execution reverted',
				signature: '0xc85bda60',
				data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				customErrorName: 'ErrorWithParams',
				customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
				customErrorArguments: {
					code: BigInt(42),
					message: 'This is an error with params',
				},
			});

			const transaction = {
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				data: '0x819f48fe',
				gasPrice: '0x15ab8f14',
				maxPriorityFeePerGas: undefined,
				maxFeePerGas: undefined,
			};
			const receipt = {
				transactionHash:
					'0x55de60905fb9efdaa5dc5ac6a2e05736e92067d44b8a3077c80ec849545cbcf0',
				transactionIndex: BigInt(0),
				blockHash: '0xc150c0a7f7f5c9014ea965d19b1be5f5ced07a6b17ea3b1126769d745dde9b2d',
				blockNumber: BigInt(16738176),
				from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
				to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
				cumulativeGasUsed: BigInt(23605),
				gasUsed: BigInt(23605),
				effectiveGasPrice: BigInt(2000000000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				root: '',
				status: BigInt(0),
				type: BigInt(0),
			};

			web3Context.handleRevert = true;
			expect(
				await getTransactionError(
					web3Context,
					transaction,
					receipt,
					undefined,
					SimpleRevertAbi,
				),
			).toMatchObject(
				new TransactionRevertWithCustomError(
					'execution reverted',
					'ErrorWithParams',
					'ErrorWithParams(uint256,string)',
					{
						code: BigInt(42),
						message: 'This is an error with params',
					},
					'0xc85bda60',
					receipt,
					'000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
				),
			);
		});
	});
});
