import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import Web3Eth from '../../src/index';
import {
	NewHeadsSubscription,
	SyncingSubscription,
	NewPendingTransactionsSubscription,
	LogsSubscription,
} from '../../src/web3_subscriptions';
import {
	getSystemTestProvider,
	describeIf,
	getSystemTestAccounts,
} from '../fixtures/system_test_utils';

describeIf(getSystemTestProvider().startsWith('ws'))('subscribe', () => {
	let web3Eth: Web3Eth;
	let provider: WebSocketProvider;
	let accounts: string[];

	beforeAll(async () => {
		accounts = await getSystemTestAccounts();
		provider = new WebSocketProvider(
			getSystemTestProvider(),
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
	});

	afterAll(() => {
		provider.disconnect();
	});

	afterEach(async () => {
		await web3Eth.clearSubscriptions();
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
				address: accounts[0],
			});
			const subs = web3Eth?.subscriptionManager?.subscriptions;
			const inst = subs?.get(Array.from(subs.keys())[0]);
			expect(inst).toBeInstanceOf(LogsSubscription);
		});
	});
});
