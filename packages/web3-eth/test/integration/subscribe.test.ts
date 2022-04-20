import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import Web3Eth from '../../src/index';
import {
	NewHeadsSubscription,
	SyncingSubscription,
	NewPendingTransactionsSubscription,
	LogsSubscription,
} from '../../src/web3_subscriptions';
// eslint-disable-next-line
import { clientWsUrl } from '../../../../.github/test.config';

describe('unsubscribe', () => {
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider;
	beforeAll(() => {
		provider = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
	});
	afterAll(() => {
		provider.disconnect();
	});

	describe('subscribe to', () => {
		it('newHeads', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('newHeads');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewHeadsSubscription);
			await web3Eth.clearSubscriptions();
		});
		it('syncing', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('syncing');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(SyncingSubscription);
			await web3Eth.clearSubscriptions();
		});
		it('newPendingTransactions', async () => {
			web3Eth = new Web3Eth(provider as SupportedProviders<any>);
			await web3Eth.subscribe('newPendingTransactions');
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(NewPendingTransactionsSubscription);
			await web3Eth.clearSubscriptions();
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
			await web3Eth.clearSubscriptions();
		});
	});
});
