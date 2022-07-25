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
import HttpProvider from 'web3-providers-http';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract } from 'web3-eth-contract';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SupportedProviders } from 'web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import IpcProvider from 'web3-providers-ipc';
import { Web3Eth } from '../../src';

import {
	createNewAccount,
	getSystemTestProvider,
	isHttp,
	isWs,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { Web3EthExecutionAPI } from '../../src/web3_eth_execution_api';

describe('eth', () => {
	let web3Eth: Web3Eth;
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
		if (isWs) {
			web3Eth = new Web3Eth(
				new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			);
			contract = new Contract(BasicAbi, undefined, {
				provider: new WebSocketProvider(
					clientUrl,
					{},
					{ delay: 1, autoReconnect: false, maxAttempts: 1 },
				),
			});
		} else {
			web3Eth = new Web3Eth(clientUrl);
			contract = new Contract(BasicAbi, undefined, {
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
		if (isWs && web3Eth?.provider) {
			(web3Eth.provider as WebSocketProvider).disconnect();
			(contract.provider as WebSocketProvider).disconnect();
		}
	});

	describe('methods', () => {
		it('setProvider', () => {
			web3Eth.setProvider(contract.provider as SupportedProviders<Web3EthExecutionAPI>);
			expect(web3Eth.provider).toBe(contract.provider);
		});
		it('providers', () => {
			const res = web3Eth.providers;

			expect(res.HttpProvider).toBeDefined();
			expect(res.WebsocketProvider).toBeDefined();
			expect(res.IpcProvider).toBeDefined();
		});
		it('currentProvider', () => {
			const { currentProvider } = web3Eth;
			let checkWithClass;
			if (isWs) {
				checkWithClass = WebSocketProvider;
			} else if (isHttp) {
				checkWithClass = HttpProvider;
			} else {
				checkWithClass = IpcProvider;
			}
			expect(currentProvider).toBeInstanceOf(checkWithClass);
		});
		it('givenProvider', () => {
			const { givenProvider } = web3Eth;
			expect(givenProvider).toBeUndefined();
		});
	});
});
