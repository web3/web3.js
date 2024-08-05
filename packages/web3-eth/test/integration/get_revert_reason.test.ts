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

/* eslint-disable jest/no-conditional-expect */

import { Address, Transaction, TransactionCall } from 'web3-types';

import Web3Eth from '../../src';
import { getRevertReason } from '../../src/utils/get_revert_reason';
import { SimpleRevertAbi, SimpleRevertDeploymentData } from '../fixtures/simple_revert';
import {
	createTempAccount,
	getSystemTestBackend,
	getSystemTestProvider,
	BACKEND,
	closeOpenConnection
} from '../fixtures/system_test_utils';

describe('Web3Eth.getRevertReason', () => {
	let tempAccount: { address: string; privateKey: string };
	let web3Eth: Web3Eth;
	let simpleRevertContractAddress: Address;

	beforeAll(async () => {
		tempAccount = await createTempAccount();
		web3Eth = new Web3Eth(getSystemTestProvider());

		const simpleRevertDeployTransaction: Transaction = {
			from: tempAccount.address,
			data: SimpleRevertDeploymentData,
		};
		simpleRevertDeployTransaction.gas = await web3Eth.estimateGas(
			simpleRevertDeployTransaction,
		);
		simpleRevertContractAddress = (await web3Eth.sendTransaction(simpleRevertDeployTransaction))
			.contractAddress as Address;
	});

	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	it('should return reason for a contract call', async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			data: '0xf38fb65b',
		};

		const response = await getRevertReason(web3Eth, transaction);

		switch (getSystemTestBackend()) {
			case BACKEND.GETH:
				expect(response).toMatchObject({
					reason: 'execution reverted: This is a call revert',
					signature: '0x08c379a0',
					data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612063616c6c207265766572740000000000000000000000',
				});
				break;
			case BACKEND.HARDHAT:
				expect(response).toMatchObject({
					reason: "Error: VM Exception while processing transaction: reverted with reason string 'This is a call revert'",
					signature: '0x08c379a0',
					data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612063616c6c207265766572740000000000000000000000',
				});
				break;
			default:
				throw new Error(
					`Unable to finish test, unknown backend: ${getSystemTestBackend()}`,
				);
		}
	});

	it('should return reason for a contract send', async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			data: '0xba57a511000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265766572740000000000000000000000000000000000000000000000000000',
		};

		const response = await getRevertReason(web3Eth, transaction);

		switch (getSystemTestBackend()) {
			case BACKEND.GETH:
				expect(response).toMatchObject({
					reason: 'execution reverted: This is a send revert',
					signature: '0x08c379a0',
					data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
				});
				break;
			case BACKEND.HARDHAT:
				expect(response).toMatchObject({
					reason: "Error: VM Exception while processing transaction: reverted with reason string 'This is a send revert'",
					signature: '0x08c379a0',
					data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
				});
				break;
			default:
				throw new Error(
					`Unable to finish test, unknown backend: ${getSystemTestBackend()}`,
				);
		}
	});

	it('should return out of gas reason', async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			gas: '0x0',
			data: '0xba57a511000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265766572740000000000000000000000000000000000000000000000000000',
		};

		const response = await getRevertReason(web3Eth, transaction);
		switch (getSystemTestBackend()) {
			case BACKEND.GETH:
				expect(response).toBe(
					'err: intrinsic gas too low: have 0, want 21544 (supplied gas 0)',
				);
				break;
			case BACKEND.HARDHAT:
				expect(response).toContain('Error: base fee exceeds gas limit');
				break;
			default:
				throw new Error(
					`Unable to finish test, unknown backend: ${getSystemTestBackend()}`,
				);
		}
	});

	it('should revert with custom error with no params', async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			data: '0x3ebf4d9c',
		};

		const response = await getRevertReason(web3Eth, transaction, SimpleRevertAbi);
		switch (getSystemTestBackend()) {
			case BACKEND.GETH:
				expect(response).toMatchObject({
					data: '',
					reason: 'execution reverted',
					signature: '0x72090e4d',
					customErrorName: 'ErrorWithNoParams',
					customErrorDecodedSignature: 'ErrorWithNoParams()',
					customErrorArguments: {},
				});
				break;
			case BACKEND.HARDHAT:
				expect(response).toMatchObject({
					data: '',
					reason: "Error: VM Exception while processing transaction: reverted with an unrecognized custom error (return data: 0x72090e4d)",
					signature: '0x72090e4d',
					customErrorName: 'ErrorWithNoParams',
					customErrorDecodedSignature: 'ErrorWithNoParams()',
					customErrorArguments: {},
				});
				break;
			default:
				throw new Error(
					`Unable to finish test, unknown backend: ${getSystemTestBackend()}`,
				);
		}
	});

	it('should revert with custom error with params', async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			data: '0x819f48fe',
		};

		const response = await getRevertReason(web3Eth, transaction, SimpleRevertAbi);
		switch (getSystemTestBackend()) {
			case BACKEND.GETH:
				expect(response).toMatchObject({
					data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
					reason: 'execution reverted',
					signature: '0xc85bda60',
					customErrorName: 'ErrorWithParams',
					customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
					customErrorArguments: {
						code: BigInt(42),
						message: 'This is an error with params',
					},
				});
				break;
			case BACKEND.HARDHAT:
				expect(response).toMatchObject({
					data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
					reason: "Error: VM Exception while processing transaction: reverted with an unrecognized custom error (return data: 0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000)",
					signature: '0xc85bda60',
					customErrorName: 'ErrorWithParams',
					customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
					customErrorArguments: {
						code: BigInt(42),
						message: 'This is an error with params',
					},
				});
				break;
			default:
				throw new Error(
					`Unable to finish test, unknown backend: ${getSystemTestBackend()}`,
				);
		}
	});

	it("shouldn't return a revert reason", async () => {
		const transaction: TransactionCall = {
			from: tempAccount.address,
			to: simpleRevertContractAddress,
			data: '0xba57a51100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000',
		};

		const response = await getRevertReason(web3Eth, transaction);
		expect(response).toBeUndefined();
	});
});
