/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

/* eslint-disable jest/no-standalone-expect */
import Contract from 'web3-eth-contract';
import { ENS } from 'web3-eth-ens';
import Web3Eth from 'web3-eth';
import { JsonRpcOptionalRequest, Web3BaseProvider } from 'web3-common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { Web3 } from '../../src/index';

import { erc20Abi } from '../fixtures/erc20';

import {
	getSystemTestProvider,
	describeIf,
	getSystemTestAccounts,
	accounts as staticAccounts,
} from '../fixtures/system_test_utils';
import { externalHttpsStringProvider, externalWssStringProvider } from '../fixtures/config';

describe('Web3 instance', () => {
	let clientUrl: string;
	let accounts: string[];
	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		accounts = await getSystemTestAccounts();
	});
	describeIf(getSystemTestProvider().startsWith('http'))(
		'Create Web3 class instance with http string providers',
		() => {
			it('should create instance with string provider', async () => {
				const web3 = new Web3(clientUrl);
				expect(web3).toBeInstanceOf(Web3);
			});
			it('should create instance with string of external http provider', async () => {
				const web3 = new Web3(externalHttpsStringProvider);
				expect(web3).toBeInstanceOf(Web3);
			});
			// todo fix ipc test
			// https://ethereum.stackexchange.com/questions/52574/how-to-connect-to-ethereum-node-geth-via-ipc-from-outside-of-docker-container
			// https://github.com/ethereum/go-ethereum/issues/17907
			// itIf(clientUrl.includes('ipc'))(
			// 	'should create instance with string of IPC provider',
			// 	() => {
			// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// 		// eslint-disable-next-line no-new
			// 		const fullIpcPath = path.join(__dirname, ipcStringProvider);
			// 		const ipcProvider = new Web3.providers.IpcProvider(fullIpcPath);
			// 		const web3 = new Web3(ipcProvider);
			// 		expect(web3).toBeInstanceOf(Web3);
			// 	},
			// );
		},
	);

	describeIf(getSystemTestProvider().startsWith('ws'))(
		'Create Web3 class instance with ws string providers',
		() => {
			let web3: Web3;
			async function waitForSocketState(web3Inst: Web3, state: string) {
				return new Promise<void>(resolve => {
					setTimeout(() => {
						if ((web3Inst.currentProvider as Web3BaseProvider).getStatus() === state) {
							resolve();
						} else {
							// eslint-disable-next-line @typescript-eslint/no-empty-function
							waitForSocketState(web3Inst, state).then(resolve, () => {});
						}
					}, 5);
				});
			}
			afterEach(async () => {
				(web3.currentProvider as Web3BaseProvider).disconnect(1000, 'done');
				await waitForSocketState(web3, 'disconnected');
			});

			it('should create instance with string of ws provider', async () => {
				web3 = new Web3(clientUrl);
				expect(web3).toBeInstanceOf(Web3);
				await waitForSocketState(web3, 'connected');
			});

			it('should create instance with string of external ws provider', async () => {
				web3 = new Web3(externalWssStringProvider);
				expect(web3).toBeInstanceOf(Web3);
				await waitForSocketState(web3, 'connected');
			});
		},
	);
	describeIf(getSystemTestProvider().startsWith('http'))('Web3 providers', () => {
		it('should set the provider', async () => {
			const web3 = new Web3('http://dummy.com');

			web3.provider = clientUrl;

			expect(web3).toBeInstanceOf(Web3);

			const response = await web3.eth.getBalance(accounts[0]);

			expect(response).toMatch(/0[xX][0-9a-fA-F]+/);
		});
	});

	describe('Module instantiations', () => {
		it('should create module instances', () => {
			const web3 = new Web3(clientUrl);

			expect(web3.eth).toBeInstanceOf(Web3Eth);
			expect(web3.eth.ens).toBeInstanceOf(ENS);
			expect(web3.eth.abi).toEqual(
				expect.objectContaining({
					encodeEventSignature: expect.any(Function),
					encodeFunctionCall: expect.any(Function),
					encodeFunctionSignature: expect.any(Function),
					encodeParameter: expect.any(Function),
					encodeParameters: expect.any(Function),
					decodeParameter: expect.any(Function),
					decodeParameters: expect.any(Function),
					decodeLog: expect.any(Function),
				}),
			);
			expect(web3.eth.accounts).toEqual(
				expect.objectContaining({
					create: expect.any(Function),
					privateKeyToAccount: expect.any(Function),
					signTransaction: expect.any(Function),
					recoverTransaction: expect.any(Function),
					hashMessage: expect.any(Function),
					sign: expect.any(Function),
					recover: expect.any(Function),
					encrypt: expect.any(Function),
					decrypt: expect.any(Function),
				}),
			);
			const erc20Contract = new web3.eth.Contract(erc20Abi);
			expect(erc20Contract).toBeInstanceOf(Contract);
		});
		// it.skip('able to query via eth pacakge', async () => {
		// 	const web3 = new Web3(httpStringProvider);
		// 	const defaultAccount = accounts[0];

		// 	const acc = web3.eth.accounts.privateKeyToAccount(defaultAccount.privateKey);
		// 	// const nonce = await web3.eth.getTransactionCount(acc.address, 'latest'); // nonce starts counting from 0

		// 	// const common = Common.custom({ chainId: 15 });
		// 	const rawTx = {
		// 		// from: acc.address,
		// 		// to: accounts[1].address,
		// 		// value: toHex(toWei(1, 'ether')),
		// 		// gasLimit: toHex(21000),
		// 		// nonce,
		// 		/// //
		// 		to: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
		// 		value: '0x186A0',
		// 		gasLimit: 20e9,
		// 		gasPrice: 25e6,
		// 		data: '',
		// 		chainId: 15,
		// 		nonce: 0,
		// 	};

		// 	// const txOptions: TxOptions = {};
		// 	// const tx = new Transaction(rawTx, { common });
		// 	// tx.sign(Buffer.from(acc.privateKey.slice(2), 'hex'));

		// 	// const serializedTx = tx.serialize();

		// 	// const res = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);
		// 	const signedTx: signTransactionResult = acc.signTransaction(rawTx);

		// 	const res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
		// 	console.warn(res);
		// });
	});
	describeIf(getSystemTestProvider().startsWith('http'))(
		'Create Web3 class instance with external providers',
		() => {
			let provider: HDWalletProvider;
			beforeAll(() => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				provider = new HDWalletProvider({
					privateKeys: [staticAccounts[0].privateKey],
					providerOrUrl: clientUrl,
				});
			});
			// afterAll(() => server.close());
			it('should create instance with external wallet provider', async () => {
				const web3 = new Web3(provider);
				expect(web3).toBeInstanceOf(Web3); // toEqual(toWei(accounts[0].balance, 'ether'));
			});
		},
	);
	describeIf(getSystemTestProvider().startsWith('http'))('Batch Request', () => {
		let request1: JsonRpcOptionalRequest;
		let request2: JsonRpcOptionalRequest;
		beforeEach(() => {
			request1 = {
				id: 10,
				method: 'eth_getBalance',
				params: [accounts[0], 'latest'],
			};
			request2 = {
				id: 11,
				method: 'eth_getBalance',
				params: [accounts[1], 'latest'],
			};
		});

		it('should execute batch requests', async () => {
			const web3 = new Web3(clientUrl);

			const batch = new web3.BatchRequest();

			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			batch.add(request1);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			batch.add(request2);
			const response = await batch.execute();

			expect(response).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: request1.id,
						result: expect.stringMatching(/0[xX][0-9a-fA-F]+/),
					}),
					expect.objectContaining({
						id: request2.id,
						result: expect.stringMatching(/0[xX][0-9a-fA-F]+/),
					}),
				]),
			);
		});
	});
});
