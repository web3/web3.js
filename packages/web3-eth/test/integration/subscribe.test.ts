import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import Web3Eth from '../../src/index';
import {
	NewHeadsSubscription,
	SyncingSubscription,
	NewPendingTransactionsSubscription,
	LogsSubscription,
} from '../../src/web3_subscriptions';

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

	describe('subscribe to', () => {
		it('newHeads', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('newHeads');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewHeadsSubscription);
		});
		it('syncing', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('syncing');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(SyncingSubscription);
		});
		it('newPendingTransactions', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('newPendingTransactions');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewPendingTransactionsSubscription);
		});
		it('logs', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('logs', {
				address: '0x8320fe7702b96808f7bbc0d4a888ed1468216cfd',
				topics: ['0xd78a0cb8bb633d06981248b816e7bd33c2a35a6089241d099fa519e361cab902'],
			});
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(LogsSubscription);
		});
	});
});
