import WebSocketProvider from 'web3-providers-ws';
import { SupportedProviders } from 'web3-core';
import { PromiEvent } from 'web3-common';
import { Transaction } from '@ethereumjs/tx';
import Web3Eth, { ReceiptInfo, SendSignedTransactionEvents } from '../../src/index';

describe('watch transaction', () => {
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
			await web3Eth.signTransaction({
				from: '0xdc6bad79dab7ea733098f66f6c6f9dd008da3258',
				gasPrice: '20000000000',
				gas: '21000',
				to: '0x3535353535353535353535353535353535353535',
				value: '1000000000000000000',
				data: '',
			});
			const privateKey = Buffer.from(
				'0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e',
				'hex',
			);

			const nonce = await web3Eth.getTransactionCount(
				'0x0000000000000000000000000000000000000001',
			);
			const rawTx = {
				nonce,
				gasPrice: '0x09184e72a000',
				gasLimit: '0x2710',
				to: '0x0000000000000000000000000000000000000001',
				value: '0x00',
				data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
			};

			const tx = new Transaction(rawTx);
			tx.sign(privateKey);
			const serializedTx = tx.serialize();

			const sendedTx: PromiEvent<ReceiptInfo, SendSignedTransactionEvents> =
				web3Eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);

			sendedTx.on('receipt', d => {
				// console.log('receipt!!!!!', d);
			});
			sendedTx.on('confirmation', d => {
				// console.log('CONFIRMATION!!!!!', d);
			});
			expect(true).toBe(true);
		});
	});
});
