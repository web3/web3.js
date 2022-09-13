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
import WebSocketProvider from 'web3-providers-ws/dist';
import { Web3BaseProvider } from 'web3-types';
/* eslint-disable import/no-named-as-default */
import Web3Eth from '../../src/index';
import { NewHeadsSubscription, SyncingSubscription } from '../../src/web3_subscriptions';
import { getSystemTestProvider, describeIf, isWs } from '../fixtures/system_test_utils';

describeIf(isWs)('unsubscribe', () => {
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider;
	beforeAll(() => {
		provider = new WebSocketProvider(getSystemTestProvider());
	});
	afterAll(() => {
		provider.disconnect();
	});

	describe('unsubscribe from', () => {
		it('should clearSubscriptions', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('newHeads');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewHeadsSubscription);
			await web3Eth.clearSubscriptions();
			expect(web3Eth?.subscriptionManager?.subscriptions?.size).toBe(0);
		});

		it('subscribe to all and clear all except syncing', async () => {
			web3Eth = new Web3Eth(provider as Web3BaseProvider);
			await web3Eth.subscribe('newHeads');
			await web3Eth.subscribe('newPendingTransactions');
			await web3Eth.subscribe('syncing');
			await web3Eth.subscribe('logs', {
				address: '0x8320fe7702b96808f7bbc0d4a888ed1468216cfd',
				topics: ['0xd78a0cb8bb633d06981248b816e7bd33c2a35a6089241d099fa519e361cab902'],
			});
			expect(web3Eth?.subscriptionManager?.subscriptions.size).toBe(4);
			await web3Eth.clearSubscriptions(true);

			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(SyncingSubscription);
			expect(web3Eth?.subscriptionManager?.subscriptions.size).toBe(1);
		});
	});
});
