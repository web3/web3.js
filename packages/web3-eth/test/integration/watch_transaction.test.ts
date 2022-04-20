import WebSocketProvider from 'web3-providers-ws';
import HttpProvider from 'web3-providers-http';
import { SupportedProviders } from 'web3-core';
import { PromiEvent } from 'web3-common';
import { toWei } from 'web3-utils';
// eslint-disable-next-line
import { EthPersonal } from 'web3-eth-personal';
import { Web3Eth, SendTransactionEvents, ReceiptInfo } from '../../src';
import { accounts, clientUrl, clientWsUrl } from '../../../../.github/test.config'; // eslint-disable-line
type Resolve = (value?: unknown) => void;
const setupWeb3 = (web3Eth: Web3Eth) => {
	web3Eth.setConfig({ transactionConfirmationBlocks: 1 });

	const account = web3Eth?.accountProvider?.privateKeyToAccount(accounts[0].privateKey);
	if (account && web3Eth?.wallet?.add) {
		web3Eth?.wallet?.add(account);
	}
};

describe('watch transaction', () => {
	let web3Eth: Web3Eth;
	let providerWs: WebSocketProvider;
	let providerHttp: HttpProvider;
	let web3Personal: EthPersonal;
	beforeAll(async () => {
		providerHttp = new HttpProvider(clientUrl);
		providerWs = new WebSocketProvider(
			clientWsUrl,
			{},
			{ delay: 1, autoReconnect: false, maxAttempts: 1 },
		);
		web3Eth = new Web3Eth(clientUrl);
		await web3Eth.sendTransaction({
			from: await web3Eth.getCoinbase(),
			to: accounts[0].address,
			value: toWei(100, 'ether'),
		});
		web3Personal = new EthPersonal(clientUrl);
		const existsAccounts = (await web3Personal.getAccounts()).map((a: string) =>
			a.toUpperCase(),
		);
		if (
			!(
				existsAccounts?.length > 0 &&
				existsAccounts.includes(accounts[0].address.toUpperCase())
			)
		) {
			await web3Personal.importRawKey(accounts[0].privateKey.substring(2), '123456');
			await web3Personal.unlockAccount(accounts[0].address, '123456', 500);
		} else {
			await web3Personal.unlockAccount(accounts[0].address, '123456', 500);
		}
	});
	afterAll(() => {
		providerWs.disconnect();
	});

	describe('wait for confirmation', () => {
		it('polling', async () => {
			web3Eth = new Web3Eth(providerHttp as SupportedProviders<any>);
			setupWeb3(web3Eth);

			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;

			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction(
				{
					to,
					value,
					from,
				},
				undefined,
			);
			const confirmationPromise = new Promise((resolve: Resolve) => {
				sentTx.on(
					'confirmation',
					({ confirmationNumber }: { confirmationNumber: string | number | bigint }) => {
						expect(confirmationNumber).toBe('0x2');
						resolve();
					},
				);
			});
			await new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			// eslint-disable-next-line
			const sentTx2: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction(
				{
					to,
					value,
					from,
				},
			);

			await new Promise((resolve: Resolve) => {
				sentTx2.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			await confirmationPromise;
		});
		it('subscription to heads', async () => {
			web3Eth = new Web3Eth(providerWs as SupportedProviders<any>);
			setupWeb3(web3Eth);

			const from = accounts[0].address;
			const to = accounts[1].address;
			const value = `0x1`;
			const sentTx: PromiEvent<ReceiptInfo, SendTransactionEvents> = web3Eth.sendTransaction(
				{
					to,
					value,
					from,
				},
				undefined,
			);

			const receiptPromise = new Promise((resolve: Resolve) => {
				sentTx.on('receipt', (params: ReceiptInfo) => {
					expect(params.status).toBe('0x1');
					resolve();
				});
			});
			const cPromise = new Promise((resolve: Resolve) => {
				sentTx.on(
					'confirmation',
					({ confirmationNumber }: { confirmationNumber: string | number | bigint }) => {
						resolve(confirmationNumber);
					},
				);
			});
			await receiptPromise;
			// eslint-disable-next-line
			web3Eth.sendTransaction({
				to,
				value,
				from,
			});
			const confirmationNumber = await cPromise;
			expect(confirmationNumber).toBe('0x1');
		});
	});
});
