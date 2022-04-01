import { Web3SubscriptionManager } from 'web3-core';
import Web3Eth, { SubscriptionNames } from '../../src/index';
import {
	LogsSubscription,
	SyncingSubscription,
	NewHeadsSubscription,
	NewPendingTransactionsSubscription,
} from '../../src/web3_subscriptions';

type SomeInstance =
	| LogsSubscription
	| SyncingSubscription
	| NewHeadsSubscription
	| NewPendingTransactionsSubscription;
const subscribeMapping: [keyof typeof SubscriptionNames, SomeInstance][] = [
	['logs', LogsSubscription],
	['newPendingTransactions', NewPendingTransactionsSubscription],
	['pendingTransactions', NewPendingTransactionsSubscription],
	['newHeads', NewHeadsSubscription],
	['newBlockHeaders', NewHeadsSubscription],
	['syncing', SyncingSubscription],
];
describe('subscribe', () => {
	let web3Eth: Web3Eth;
	let addSubscriptionSpy: jest.Mock;

	beforeEach(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
		addSubscriptionSpy = jest.fn(a => a as SomeInstance);
		if (web3Eth.subscriptionManager instanceof Web3SubscriptionManager) {
			web3Eth.subscriptionManager.addSubscription = addSubscriptionSpy;
		}
	});

	describe('subscribe to', () => {
		it.each(subscribeMapping)('%p', async (name, instance) => {
			await web3Eth.subscribe(name, jest.fn);
			expect(addSubscriptionSpy).toHaveBeenCalled();
			expect(addSubscriptionSpy.mock.results[0].value).toBeInstanceOf(instance);
		});
	});
});
