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
import { SupportedProviders } from 'web3-core';
// eslint-disable-next-line import/no-extraneous-dependencies
import IpcProvider from 'web3-providers-ipc';
import { hexToNumber } from 'web3-utils';
import { Web3Eth } from '../../src';

import { createNewAccount, getSystemTestProvider } from '../fixtures/system_test_utils';
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
		web3Eth = new Web3Eth(clientUrl);

		contract = new Contract(BasicAbi, undefined, {
			provider: clientUrl,
		});

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: accounts[0], gas: '1000000' };

		contract = await contract.deploy(deployOptions).send(sendOptions);
	});
	afterAll(() => {
		if (clientUrl.startsWith('ws')) {
			(web3Eth.provider as WebSocketProvider).disconnect();
		}
	});

	describe('methods', () => {
		it('setProvider', async () => {
			const url = getSystemTestProvider();
			let newProvider;
			if (url.startsWith('http')) {
				newProvider = new HttpProvider(url);
			} else {
				newProvider = new WebSocketProvider(url);
			}
			web3Eth.setProvider(newProvider as SupportedProviders<Web3EthExecutionAPI>);

			expect(web3Eth.provider).toBe(newProvider);
		});
		it('providers', async () => {
			const res = web3Eth.providers;

			expect(res.HttpProvider).toBeDefined();
			expect(res.WebsocketProvider).toBeDefined();
			expect(res.IpcProvider).toBeDefined();
		});
		it('currentProvider', async () => {
			const { currentProvider } = web3Eth;
			const url = getSystemTestProvider();
			let checkWithClass;
			if (url.startsWith('ws')) {
				checkWithClass = WebSocketProvider;
			} else if (url.startsWith('http')) {
				checkWithClass = HttpProvider;
			} else {
				checkWithClass = IpcProvider;
			}
			expect(currentProvider).toBeInstanceOf(checkWithClass);
		});
		it('givenProvider', async () => {
			const { givenProvider } = web3Eth;
			expect(givenProvider).toBeUndefined();
		});
		it('BatchRequest', async () => {
			const batch = new web3Eth.BatchRequest();
			const request1 = {
				id: 10,
				method: 'eth_getBalance',
				params: [accounts[0], 'latest'],
			};
			const request2 = {
				id: 11,
				method: 'eth_getBalance',
				params: [accounts[1], 'latest'],
			};
			batch.add(request1).catch(console.error);
			batch.add(request2).catch(console.error);
			const [response1, response2] = await batch.execute();
			expect(response1.result).toBeDefined();
			expect(response2.result).toBeDefined();
// TODO: in future release add test for validation of returned results , ( match balance )
			expect(Number(hexToNumber(String(response1.result)))).toBeGreaterThan(0);
			expect(Number(hexToNumber(String(response2.result)))).toBeGreaterThan(0);
		});
		it('defaults', async () => {
// TODO: in future release add tests for setting default and matching with new values
			const config = web3Eth.getConfig();
			expect(config.defaultAccount).toBeNull();
			expect(config.handleRevert).toBe(false);
			expect(config.defaultBlock).toBe('latest');
			expect(config.transactionBlockTimeout).toBe(50);
			expect(config.transactionConfirmationBlocks).toBe(24);
			expect(config.transactionPollingInterval).toBe(1000);
			expect(config.transactionPollingTimeout).toBe(750);
			expect(config.transactionReceiptPollingInterval).toBeNull();
			expect(config.transactionConfirmationPollingInterval).toBeNull();
			expect(config.blockHeaderTimeout).toBe(10);
			expect(config.maxListenersWarningThreshold).toBe(100);
			expect(config.defaultNetworkId).toBeNull();
			expect(config.defaultChain).toBe('mainnet');
			expect(config.defaultCommon).toBeNull();
			expect(config.defaultTransactionType).toBe('0x0');
			expect(hexToNumber(config.defaultMaxPriorityFeePerGas as string)).toBeGreaterThan(0);
			expect(config.transactionBuilder).toBeUndefined();
			expect(config.transactionTypeParser).toBeUndefined();
		});
	});
});
