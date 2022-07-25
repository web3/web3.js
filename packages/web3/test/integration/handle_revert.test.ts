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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
import { TransactionRevertedError } from 'web3-errors';
import Web3 from '../../src/index';
import {
	createNewAccount,
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

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createNewAccount({ unlock: true, refill: true });
		const acc2 = await createNewAccount({ unlock: true, refill: true });
		accounts = [acc1.address, acc2.address];
		// web3 = new Web3(getSystemTestProvider());
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

		web3.eth.Contract.handleRevert = true;
		web3.eth.handleRevert = true;
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
	afterAll(() => {
		if (isWs && web3?.provider) {
			(web3.provider as WebSocketProvider).disconnect();
			(contract.provider as WebSocketProvider).disconnect();
		}
	});

	describe('handleRevert', () => {
		// todo enable when figure out what happening in eth_call (doesn't throw error)
		// eslint-disable-next-line jest/expect-expect
		it.skip('should get revert reason', async () => {
			await contract.methods.reverts().send({ from: accounts[0] });
		});

		it('should get revert reason for eth tx', async () => {
			await expect(
				web3.eth.sendTransaction({
					from: accounts[0],
					gas: '0x3d0900',
					gasPrice: '0x3B9ACBF4',
					// hash: '0x7c3a42c614689e905f894042ad6f74b456bab4b984f40a3b1718fef43d39b7fe',
					input: '0x6080604052..3480156100105..7600080fd.klkl',
					nonce: '0x10',
					to: undefined,
					value: '0x0',
					type: '0x0',
					v: '0xa96',
					r: '0x1ba80b16306d1de8ff809c00f67c305e8636326096aba282828d331aa2ec30a1',
					s: '0x39f77e0b68d5524826e4385ad4e1f01e748f32c177840184ae65d9592fdfe5c',
				}),
			).rejects.toThrow(
				new TransactionRevertedError(
					'cannot unmarshal hex string of odd length into Go struct field TransactionArgs.data of type hexutil.Bytes',
				),
			);
		});
	});
});
