import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import { ReceiptInfo } from 'web3-common';
import { Web3Eth } from '../../src';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientWsUrl } from '../../../../.github/test.config';
import { prepareNetwork, sendFewTxes, setupWeb3, Resolve } from './helper';
import { NewPendingTransactionsSubscription } from '../../src/web3_subscriptions';

const checkTxCount = 5;

type SubName = 'pendingTransactions' | 'newPendingTransactions';
const subNames: SubName[] = ['pendingTransactions', 'newPendingTransactions'];

describe('subscription', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	beforeAll(async () => {
		providerWs = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		await prepareNetwork();
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('new pending transaction', () => {
		it.each(subNames)(`wait ${checkTxCount} transaction - ${subNames[0]}`, async subName => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(subName);
			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;

			let times = 0;
			const txHashes: string[] = [];
			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', async (data: string) => {
					txHashes.push(data);
					times += 1;
					if (times >= checkTxCount) {
						resolve();
					}
				});
			});

			const receipts = (await sendFewTxes({
				web3Eth,
				from,
				to,
				value,
				times: checkTxCount,
			})) as ReceiptInfo[];
			await pr;
			expect(receipts.map((r: ReceiptInfo) => r?.transactionHash)).toEqual(txHashes);
			await web3Eth.clearSubscriptions();
		});
		it.each(subNames)(`clear`, async (subName: SubName) => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: NewPendingTransactionsSubscription = await web3Eth.subscribe(subName);
			expect(sub.id).toBeDefined();
			await web3Eth.clearSubscriptions();
			expect(sub.id).toBeUndefined();
		});
	});
});
