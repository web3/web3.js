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
import Web3, { Transaction } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
	itIf,
} from '../../shared_fixtures/system_tests_utils';
import {
	getAllowedSendTransaction,
	getE2ETestAccountAddress,
	getE2ETestAccountPrivateKey,
	getSystemE2ETestProvider,
} from '../e2e_utils';

describe(`${getSystemTestBackend()} tests - sendSignedTransaction`, () => {
	const provider = getSystemE2ETestProvider();

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	itIf(getAllowedSendTransaction())(
		'should send a simple value transfer - type 0x0',
		async () => {
			const transaction: Transaction = {
				from: getE2ETestAccountAddress(),
				to: getE2ETestAccountAddress(),
				value: 1,
				gas: 21000,
				type: 0,
			};
			const signedTransaction = await web3.eth.accounts.signTransaction(
				transaction,
				getE2ETestAccountPrivateKey(),
			);
			const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

			// TODO This should work, but throws a type error
			// for root not being included in expected object.
			// However, root is not apart of result object.
			// expect(result).toMatchObject<TransactionReceipt>({
			// eslint-disable-next-line jest/no-standalone-expect
			expect(result).toMatchObject({
				// root: expect.any(String),
				blockHash: expect.any(String),
				blockNumber: expect.any(BigInt),
				cumulativeGasUsed: expect.any(BigInt),
				effectiveGasPrice: expect.any(BigInt),
				from: getE2ETestAccountAddress().toLowerCase(),
				gasUsed: BigInt(21000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				status: BigInt(1),
				to: getE2ETestAccountAddress().toLowerCase(),
				transactionHash: expect.any(String),
				transactionIndex: expect.any(BigInt),
				type: BigInt(0),
			});
		},
	);

	itIf(getAllowedSendTransaction())(
		'should send a simple value transfer - type 0x1',
		async () => {
			const transaction: Transaction = {
				from: getE2ETestAccountAddress(),
				to: getE2ETestAccountAddress(),
				value: 1,
				gas: 21000,
				type: 1,
			};
			const signedTransaction = await web3.eth.accounts.signTransaction(
				transaction,
				getE2ETestAccountPrivateKey(),
			);
			const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

			// TODO This should work, but throws a type error
			// for root not being included in expected object.
			// However, root is not apart of result object.
			// expect(result).toMatchObject<TransactionReceipt>({
			// eslint-disable-next-line jest/no-standalone-expect
			expect(result).toMatchObject({
				// root: expect.any(String),
				blockHash: expect.any(String),
				blockNumber: expect.any(BigInt),
				cumulativeGasUsed: expect.any(BigInt),
				effectiveGasPrice: expect.any(BigInt),
				from: getE2ETestAccountAddress().toLowerCase(),
				gasUsed: BigInt(21000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				status: BigInt(1),
				to: getE2ETestAccountAddress().toLowerCase(),
				transactionHash: expect.any(String),
				transactionIndex: expect.any(BigInt),
				type: BigInt(1),
			});
		},
	);

	itIf(getAllowedSendTransaction())(
		'should send a simple value transfer - type 0x2',
		async () => {
			const transaction: Transaction = {
				from: getE2ETestAccountAddress(),
				to: getE2ETestAccountAddress(),
				value: 1,
				gas: 21000,
			};
			const signedTransaction = await web3.eth.accounts.signTransaction(
				transaction,
				getE2ETestAccountPrivateKey(),
			);
			const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

			// TODO This should work, but throws a type error
			// for root not being included in expected object.
			// However, root is not apart of result object.
			// expect(result).toMatchObject<TransactionReceipt>({
			// eslint-disable-next-line jest/no-standalone-expect
			expect(result).toMatchObject({
				// root: expect.any(String),
				blockHash: expect.any(String),
				blockNumber: expect.any(BigInt),
				cumulativeGasUsed: expect.any(BigInt),
				effectiveGasPrice: expect.any(BigInt),
				from: getE2ETestAccountAddress().toLowerCase(),
				gasUsed: BigInt(21000),
				logs: [],
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				status: BigInt(1),
				to: getE2ETestAccountAddress().toLowerCase(),
				transactionHash: expect.any(String),
				transactionIndex: expect.any(BigInt),
				type: BigInt(2),
			});
		},
	);
});
