import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import { BlockOutput } from 'web3-common';
import { Web3Eth } from '../../src';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientWsUrl } from '../../../../.github/test.config';
import { prepareNetwork, sendFewTxes, setupWeb3, Resolve } from './helper';
import { NewHeadsSubscription } from '../../src/web3_subscriptions';

const checkTxCount = 5;

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

	describe('heads', () => {
		it(`wait for ${checkTxCount} heads`, async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, checkTxCount);
			const sub: NewHeadsSubscription = await web3Eth.subscribe('newHeads');
			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;

			let times = 0;
			const pr = new Promise((resolve: Resolve) => {
				sub.on('data', async (data: BlockOutput) => {
					console.log('data', data);
					if (data.parentHash) {
						times += 1;
					}
					if (times >= checkTxCount) {
						expect(times).toBeGreaterThanOrEqual(times);
						resolve();
					}
				});
			});

			await sendFewTxes({ web3Eth, from, to, value, times: checkTxCount });
			await pr;
		});
	});
});
