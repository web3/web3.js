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
	closeOpenConnection,
	createTempAccount,
	getSystemTestProvider,
	isHttp,
	isWs,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { Web3EthExecutionAPI } from '../../src/web3_eth_execution_api';

describe('eth', () => {
	let web3Eth: Web3Eth;
	let clientUrl: string;

	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let tempAcc: { address: string; privateKey: string };

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		web3Eth = new Web3Eth(clientUrl);
		contract = new Contract(BasicAbi, {
			provider: clientUrl,
		});
	});
	beforeEach(async () => {
		tempAcc = await createTempAccount();
	});
	afterAll(async () => {
		await closeOpenConnection(web3Eth);
		await closeOpenConnection(contract);
	});

	describe('methods', () => {
		it('setProvider', async () => {
			deployOptions = {
				data: BasicBytecode,
				arguments: [10, 'string init value'],
			};

			sendOptions = { from: tempAcc.address, gas: '1000000' };

			const deoloyedContract = await contract.deploy(deployOptions).send(sendOptions);
			const { provider } = web3Eth;
			web3Eth.setProvider(
				deoloyedContract.provider as SupportedProviders<Web3EthExecutionAPI>,
			);

			expect(web3Eth.provider).toBe(deoloyedContract.provider);
			web3Eth.setProvider(provider as SupportedProviders<Web3EthExecutionAPI>);
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
