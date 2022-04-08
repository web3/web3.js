import WebSocketProvider from 'web3-providers-ws/dist';
import { SupportedProviders } from 'web3-core';
import Web3Eth from '../../src/index';
import { NewHeadsSubscription, SyncingSubscription } from '../../src/web3_subscriptions';

describe('unsubscribe', () => {
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider;
	beforeAll(() => {
		provider = new WebSocketProvider(
			'ws://127.0.0.1:8545',
			{},
			{ delay: 1, autoReconnect: true, maxAttempts: 1 },
		);
	});

	describe('unsubscribe from', () => {
		it('should clearSubscriptions', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('newHeads');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewHeadsSubscription);
			await web3Eth.clearSubscriptions();
			expect(web3Eth?.subscriptionManager?.subscriptions?.size).toBe(0);
		});

		it('subscribe to all and clear all except syncing', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
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
