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
import WebSocketProvider from 'web3-providers-ws';
import { Contract } from 'web3-eth-contract';
import { TransactionRevertError } from 'web3-errors';
import Web3 from '../../src/index';
import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	isWs,
} from '../shared_fixtures/system_tests_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';

Error.stackTraceLimit = Infinity;

describe('eth', () => {
	let web3: Web3;
	let accounts: string[] = [];
	let clientUrl: string;

	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeEach(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createTempAccount();
		const acc2 = await createTempAccount();
		accounts = [acc1.address, acc2.address];
		web3 = new Web3(getSystemTestProvider());
		if (isWs) {
			web3 = new Web3(
				new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			);
		} else {
			web3 = new Web3(clientUrl);
		}

		if (isWs) {
			contract = new web3.eth.Contract(BasicAbi, undefined, {
				provider: new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			});
		} else {
			contract = new web3.eth.Contract(BasicAbi, undefined, {
				provider: clientUrl,
			});
		}

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: accounts[0], gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	afterAll(async () => {
		await closeOpenConnection(web3);
		await closeOpenConnection(contract);
	});

	describe('handleRevert', () => {
		// todo enable when figure out what happening in eth_call (doesn't throw error)
		// eslint-disable-next-line jest/expect-expect
		it('should get revert reason', async () => {
			contract.handleRevert = true;
			await expect(contract.methods.reverts().send({ from: accounts[0] })).rejects.toThrow(
				new TransactionRevertError(
					'Returned error: execution reverted: REVERTED WITH REVERT',
				),
			);
		});

		it('should get revert reason for eth tx', async () => {
			web3.eth.handleRevert = true;
			await expect(
				web3.eth.sendTransaction({
					from: accounts[0],
					gas: '0x3d0900',
					gasPrice: '0x3B9ACBF4',
					input: '0x608060405234801561001057600080fdklkl',
					nonce: '0x10',
					to: undefined,
					value: '0x0',
					type: '0x0',
					v: '0xa96',
					r: '0x1ba80b16306d1de8ff809c00f67c305e8636326096aba282828d331aa2ec30a1',
					s: '0x39f77e0b68d5524826e4385ad4e1f01e748f32c177840184ae65d9592fdfe5c',
				}),
			).rejects.toThrow(
				new TransactionRevertError(
					'Returned error: invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field TransactionArgs.data of type hexutil.Bytes',
				),
			);
		});

		it('should execute transaction', async () => {
			web3.eth.handleRevert = true;
			await expect(
				web3.eth.sendTransaction({
					from: accounts[0],
					to: accounts[1],
					gas: '0x76c0',
					gasPrice: '0x9184e72a000',
					value: '0x9184e72a',
					data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
				}),
			).resolves.toBeDefined();
		});
	});
});
