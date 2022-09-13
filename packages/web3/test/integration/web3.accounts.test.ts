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

import { Web3Account } from 'web3-eth-accounts';
import {
	getSystemTestProvider,
	createNewAccount,
	waitForOpenConnection,
	closeOpenConnection,
	createTempAccount,
} from '../shared_fixtures/system_tests_utils';
import Web3 from '../../src/index';

const hexRegx = /0[xX][0-9a-fA-F]+/;

describe('web3.accounts', () => {
	let clientUrl: string;
	let tempAccount: string;
	let web3: Web3;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		web3 = new Web3(clientUrl);
		await waitForOpenConnection(web3);
	});
	beforeEach(async () => {
		tempAccount = (await createTempAccount()).address;
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	describe('create', () => {
		it('should create account', () => {
			const account: Web3Account = web3.eth.accounts.create();

			expect(account).toEqual(
				expect.objectContaining({
					address: expect.stringMatching(hexRegx),
					privateKey: expect.stringMatching(hexRegx),
				}),
			);
		});

		describe('signTransaction', () => {
			it('should be able to sign the transaction from created account', async () => {
				const account: Web3Account = web3.eth.accounts.create();
				const tx = {
					from: account.address,
					to: tempAccount,
					value: web3.utils.toWei('0.1', 'ether'),
					gas: '0x5218',
					data: '0x1',
				};

				// Fund this account with some ether
				await expect(
					web3.eth.sendTransaction({
						from: tempAccount,
						to: account.address,
						value: web3.utils.toWei('0.5', 'ether'),
					}),
				).resolves.toBeDefined();

				// Sign the tx from that account
				const signedTx = await account.signTransaction(tx);

				expect(signedTx).toEqual(
					expect.objectContaining({
						messageHash: expect.stringMatching(hexRegx),
						rawTransaction: expect.stringMatching(hexRegx),
						transactionHash: expect.stringMatching(hexRegx),
						v: expect.stringMatching(hexRegx),
						r: expect.stringMatching(hexRegx),
						s: expect.stringMatching(hexRegx),
					}),
				);

				// The signed transaction is accepted by the node
				await expect(
					web3.eth.sendSignedTransaction(signedTx.rawTransaction),
				).resolves.toEqual(
					expect.objectContaining({ transactionHash: signedTx.transactionHash }),
				);
			});

			it('should throw error if gas is to low', async () => {
				const account: Web3Account = web3.eth.accounts.create();

				const tx = {
					from: account.address,
					to: tempAccount,
					value: web3.utils.toWei('0.1', 'ether'),
					gas: '0x1',
					data: '0x1',
				};

				await expect(account.signTransaction(tx)).rejects.toThrow('gasLimit is too low.');
			});

			// This test should fail, but it's not. Need to debug further to figure out why.
			it.skip('should throw error if signed by private key not associated with "from" field', async () => {
				const account: Web3Account = web3.eth.accounts.create();

				const tx = {
					from: tempAccount,
					to: account.address,
					value: web3.utils.toWei('0.1', 'ether'),
					gas: '0x1',
					data: '0x1',
				};

				await expect(account.signTransaction(tx)).rejects.toThrow('Error');
			});
		});
	});

	describe('signTransaction', () => {
		it('should be able to sign the transaction from created account', async () => {
			const account: Web3Account = web3.eth.accounts.create();

			const tx = {
				from: account.address,
				to: tempAccount,
				value: web3.utils.toWei('0.1', 'ether'),
				gas: '0x5218',
				data: '0x1',
			};

			// Fund this account with some ether
			await expect(
				web3.eth.sendTransaction({
					from: tempAccount,
					to: account.address,
					value: web3.utils.toWei('0.5', 'ether'),
				}),
			).resolves.toBeDefined();

			// Sign the tx from that account
			const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);

			expect(signedTx).toEqual(
				expect.objectContaining({
					messageHash: expect.stringMatching(hexRegx),
					rawTransaction: expect.stringMatching(hexRegx),
					transactionHash: expect.stringMatching(hexRegx),
					v: expect.stringMatching(hexRegx),
					r: expect.stringMatching(hexRegx),
					s: expect.stringMatching(hexRegx),
				}),
			);

			// The signed transaction is accepted by the node
			await expect(web3.eth.sendSignedTransaction(signedTx.rawTransaction)).resolves.toEqual(
				expect.objectContaining({ transactionHash: signedTx.transactionHash }),
			);
		});

		it('should throw error if gas is to low', async () => {
			const account: Web3Account = web3.eth.accounts.create();

			const tx = {
				from: account.address,
				to: tempAccount,
				value: web3.utils.toWei('0.1', 'ether'),
				gas: '0x1',
				data: '0x1',
			};

			await expect(web3.eth.accounts.signTransaction(tx, account.privateKey)).rejects.toThrow(
				'gasLimit is too low.',
			);
		});
	});

	describe('privateKeyToAccount', () => {
		it('should create account from private key', async () => {
			const acc = await createNewAccount();
			const createdAccount: Web3Account = web3.eth.accounts.privateKeyToAccount(
				acc.privateKey,
			);
			expect(acc.address.toLowerCase()).toBe(createdAccount.address.toLowerCase());
		});
	});
});
