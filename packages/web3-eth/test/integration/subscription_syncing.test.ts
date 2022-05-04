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
import { SupportedProviders } from 'web3-core';
import { SyncOutput } from 'web3-common';
import { Web3Eth } from '../../src';
// eslint-disable-next-line import/no-relative-packages
import { clientWsUrl, accounts } from '../../../../.github/test.config';
import { Resolve, setupWeb3, sendFewTxes } from './helper';
import { SyncingSubscription } from '../../src/web3_subscriptions';

const checkTxCount = 2;

describe('subscription', () => {
	let web3Eth: Web3Eth;
	let web3EthSecondNode: Web3Eth;
	let providerWs: WebSocketProvider;
	let providerWsSecondNode: WebSocketProvider;
	beforeAll(async () => {
		providerWs = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		providerWsSecondNode = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('syncing', () => {
		it(`wait for syncing`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			web3Eth.setConfig({ transactionPollingTimeout: 10000 });
			web3EthSecondNode = new Web3Eth(providerWsSecondNode as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: SyncingSubscription = await web3EthSecondNode.subscribe('syncing');
			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;
			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', async (data: SyncOutput) => {
					// console.log('!!!SYNC!!!', data);
					resolve(data);
				});
			});
			const pr2 = new Promise((resolve: Resolve) => {
				sub.on('changed', async (data: boolean) => {
					// console.log('!!!changed!!!', data);
					resolve(data);
				});
			});

			await sendFewTxes({ web3Eth, from, to, value, times: checkTxCount });
			// console.log('web3Eth isSyncing',await web3Eth.isSyncing())
			// console.log('web3EthSecondNode isSyncing',await web3EthSecondNode.isSyncing())
			// console.log([pr, pr2])
			await Promise.all([pr, pr2]);
		});
		it(`clear`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: SyncingSubscription = await web3Eth.subscribe('syncing');
			await web3Eth.clearSubscriptions();
			expect(sub.id).toBeUndefined();
		});
		it(`not clear if parameter passed`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: SyncingSubscription = await web3Eth.subscribe('syncing');
			await web3Eth.clearSubscriptions(true);
			expect(sub.id).toBeDefined();
		});
	});
});
