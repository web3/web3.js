// import { Web3BaseProvider } from 'web3-common';
import WebSocketProvider from 'web3-providers-ws';
import Web3Eth from '../../src/index';
// import { NewHeadsSubscription } from '../../src/web3_subscriptions';

describe('unsubscribe', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth(
			new WebSocketProvider(
				'ws://127.0.0.1:8545',
				{},
				{ delay: 1, autoReconnect: true, maxAttempts: 1 },
			),
		);

		console.log(web3Eth); //  eslint-disable-line
	});

	describe('subscribe to', () => {
		it('test', () => {
			expect(true).toBe(true);
		});
		// it('newHeads', async () => {
		// 	await web3Eth.subscribe('newHeads');
		// 	const subs = web3Eth?.subscriptionManager?.subscriptions;
		// 	const inst = subs?.get(Array.from(subs.keys())[0]);
		// 	expect(inst).toBeInstanceOf(NewHeadsSubscription);
		// });
		// it('syncing', async () => {
		// 	await web3Eth.subscribe('syncing');
		// 	const subs = web3Eth?.subscriptionManager?.subscriptions;
		// 	const inst = subs?.get(Array.from(subs.keys())[0]);
		// 	expect(inst).toBeInstanceOf(NewHeadsSubscription);
		// });
		// it('newPendingTransactions', async () => {
		// 	await web3Eth.subscribe('newPendingTransactions');
		// 	const subs = web3Eth?.subscriptionManager?.subscriptions;
		// 	const inst = subs?.get(Array.from(subs.keys())[0]);
		// 	expect(inst).toBeInstanceOf(NewHeadsSubscription);
		// });
		// it('logs', async () => {
		// 	await web3Eth.subscribe('logs', {
		// 		address: '0x8320fe7702b96808f7bbc0d4a888ed1468216cfd',
		// 		topics: ['0xd78a0cb8bb633d06981248b816e7bd33c2a35a6089241d099fa519e361cab902'],
		// 	});
		// 	const subs = web3Eth?.subscriptionManager?.subscriptions;
		// 	const inst = subs?.get(Array.from(subs.keys())[0]);
		// 	expect(inst).toBeInstanceOf(NewHeadsSubscription);
		// });
	});
	afterAll(async () => {
		// return (web3Eth.requestManager.provider as Web3BaseProvider).disconnect(1000, 'exit');
	});
});

//
// import { Web3SubscriptionManager } from 'web3-core';
// import Web3Eth from '../../src/index';
// import {
// 	LogsSubscription,
// 	SyncingSubscription,
// 	NewHeadsSubscription,
// 	NewPendingTransactionsSubscription,
// } from '../../src/web3_subscriptions';
//
// describe('subscribe', () => {
// 	let web3Eth: Web3Eth;
// 	let addSubscriptionMock: jest.Mock;
//
// 	beforeEach(() => {
// 		web3Eth = new Web3Eth('http://127.0.0.1:8545');
// 		addSubscriptionMock = jest.fn(a => a);
// 		if (web3Eth.subscriptionManager instanceof Web3SubscriptionManager) {
// 			web3Eth.subscriptionManager.addSubscription = addSubscriptionMock;
// 		}
// 	});
//
// 	describe('subscribe to', () => {
// 		it('logs', async () => {
// 			await web3Eth.subscribe('logs', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(LogsSubscription);
// 		});
// 		it('newPendingTransactions', async () => {
// 			await web3Eth.subscribe('newPendingTransactions', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(
// 				NewPendingTransactionsSubscription,
// 			);
// 		});
// 		it('pendingTransactions', async () => {
// 			await web3Eth.subscribe('pendingTransactions', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(
// 				NewPendingTransactionsSubscription,
// 			);
// 		});
// 		it('newHeads', async () => {
// 			await web3Eth.subscribe('newHeads', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(NewHeadsSubscription);
// 		});
// 		it('newBlockHeaders', async () => {
// 			await web3Eth.subscribe('newBlockHeaders', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(NewHeadsSubscription);
// 		});
// 		it('syncing', async () => {
// 			await web3Eth.subscribe('syncing', jest.fn);
// 			expect(addSubscriptionMock).toHaveBeenCalled();
// 			expect(addSubscriptionMock.mock.results[0].value).toBeInstanceOf(SyncingSubscription);
// 		});
// 	});
// });
