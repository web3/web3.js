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

	// describe('handleRevert', () => {
	// 	it('should get revert reason', async () => {
	// 		// debugger;
	// 		await contract.methods.reverts().call({ from: accounts[0] });
	// 	});
	// });
	describe('handleRevert2', () => {
		it('should get revert reason', async () => {
			await contract.methods.reverts().send({ from: accounts[0] });
		});
	});
});
