import WebSocketProvider from 'web3-providers-ws';
import HttpProvider from 'web3-providers-http';
import { SupportedProviders } from 'web3-core';
import { PromiEvent } from 'web3-common';
import { Web3Eth, SendTransactionEvents, ReceiptInfo } from '../../src';
// eslint-disable-next-line import/no-relative-packages
import { accounts, clientUrl, clientWsUrl } from '../../../../.github/test.config';
import { prepareNetwork, sendFewTxes, setupWeb3, Resolve } from './helper';

const waitConfirmations = 5;

describe('watch transaction', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let providerHttp: HttpProvider;
	beforeAll(async () => {
		providerHttp = new HttpProvider(clientUrl);
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

	describe('wait for confirmation', () => {
		it('polling', async () => {
			web3Eth = new Web3Eth(providerHttp as SupportedProviders<any>);
			setupWeb3(web3Eth, waitConfirmations);

			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;

			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
				to,
				value,
				from,
			});
			let shouldBe = 2;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on('confirmation', ({ confirmationNumber }) => {
					expect(parseInt(String(confirmationNumber), 16)).toBe(shouldBe);
					shouldBe += 1;
					if (shouldBe >= waitConfirmations) {
						resolve();
					}
				});
			});
			await new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});

			await sendFewTxes({ web3Eth, from, to, value, times: waitConfirmations });
			await confirmationPromise;
		});
		it('subscription to heads', async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth, waitConfirmations);

			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;
			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction({
				to,
				value,
				from,
			});

			const receiptPromise = new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			let shouldBe = 2;
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on('confirmation', ({ confirmationNumber }) => {
					expect(parseInt(String(confirmationNumber), 16)).toBe(shouldBe);
					shouldBe += 1;
					if (shouldBe >= waitConfirmations) {
						resolve();
					}
				});
			});
			await receiptPromise;
			await sendFewTxes({ web3Eth, from, to, value, times: waitConfirmations });
			await confirmationPromise;
		});
	});
});
