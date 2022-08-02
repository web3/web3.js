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

/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Web3AccountProvider } from 'web3-types';
import { isBrowser, isElectron, itIf } from '../fixtures/system_test_utils';
import { Wallet } from '../../src';
import * as accountProvider from '../../src/account';
import { Web3Account } from '../../dist';

describe('Wallet', () => {
	let wallet: Wallet;
	beforeEach(() => {
		wallet = new Wallet(accountProvider as Web3AccountProvider<any>);
	});

	describe('constructor', () => {
		it('should create instance of the wallet', () => {
			expect(wallet).toBeInstanceOf(Wallet);
		});
	});

	describe('create', () => {
		it('should create given # of accounts using the account provider', () => {
			const numberOfAccounts = 10;
			const accounts = [];
			wallet.create(numberOfAccounts);
			for (let i = 0; i < numberOfAccounts; i += 1) {
				accounts.push(wallet.get(i));
			}
			expect(wallet).toHaveLength(numberOfAccounts);
			expect(accounts).toHaveLength(numberOfAccounts);
		});
	});

	describe('add', () => {
		it('should create account from private key if string value is given', () => {
			const { privateKey, address } = accountProvider.create();
			const result = wallet.add(privateKey);

			expect(result).toBeTruthy();

			expect(wallet).toHaveLength(1);
			expect(wallet.get(0)?.address).toBe(address);
		});

		it('should not create account from private key if object value is given', () => {
			const { address } = accountProvider.create();
			const result = wallet.add({ address } as never);

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(1);
			expect(wallet.get(0)?.address).toBe(address);
		});

		it('should add account with lowercase address', () => {
			const { address } = accountProvider.create();
			const result = wallet.add({ address } as never);

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(1);
			expect(wallet.get(address)?.address).toBe(address);
		});

		it('should override account object for existing address', () => {
			const temp1 = accountProvider.create();
			const account1 = { address: temp1.address, privateKey: temp1.privateKey } as never;
			const temp2 = accountProvider.create();
			const account2 = { address: temp1.address, privateKey: temp2.privateKey } as never;

			wallet.add(account1);
			expect(wallet.get(temp1.address)).toEqual(account1);

			wallet.add(account2);
			expect(wallet.get(temp1.address)).toEqual(account2);
		});
	});

	describe('get', () => {
		it('should get account for given index', () => {
			const account = accountProvider.create();

			wallet.add(account);

			expect(wallet.get(0)).toEqual(account);
		});

		it('should get account for given address', () => {
			const account = accountProvider.create();

			wallet.add(account);

			expect(wallet.get(account.address)).toEqual(account);
		});

		it('should get account with index', () => {
			const account = accountProvider.create();

			wallet.add(account);

			expect(wallet[0]).toEqual(account);
		});
	});

	describe('remove', () => {
		it('should remove account for given index', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove(0);

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});

		it('should return false if index not found', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove(2);

			expect(result).toBeFalsy();
			expect(wallet).toHaveLength(1);
		});

		it('should remove account for given address', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove(account.address);

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});

		it('should return false if given address not found', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove('my_address2');

			expect(result).toBeFalsy();
			expect(wallet).toHaveLength(1);
		});

		it('should remove account with the index', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			delete wallet[0];

			// Deleting objects dees not change the length
			expect(wallet).toHaveLength(1);
			expect(wallet[0]).toBeUndefined();
		});

		it('should remove account with array methods', () => {
			const account = accountProvider.create();
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			wallet.splice(0, 1);

			expect(wallet).toHaveLength(0);
			expect(wallet[0]).toBeUndefined();
		});

		it('should remove account added with private key with array methods', () => {
			const account = accountProvider.create();
			wallet.add(account.privateKey);
			expect(wallet).toHaveLength(1);

			wallet.splice(0, 1);

			expect(wallet).toHaveLength(0);
			expect(wallet[0]).toBeUndefined();
		});
	});

	describe('clear', () => {
		it('should remove all accounts', () => {
			const account1 = accountProvider.create();
			const account2 = accountProvider.create();
			wallet.add({ address: account1.address } as never);
			wallet.add({ address: account2.address } as never);
			expect(wallet).toHaveLength(2);

			wallet.clear();

			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});
	});

	describe('encrypt', () => {
		it('should encrypt all accounts and return array', async () => {
			const account1 = accountProvider.create();
			const account2 = accountProvider.create();
			const options = { myOptions: 'myOptions' };
			wallet.add(account1);
			wallet.add(account2);

			const result: string[] = await wallet.encrypt('password', options);
			expect(result).toHaveLength(2);
			expect(`0x${(JSON.parse(result[0]) as Web3Account)?.address.toLowerCase()}`).toBe(
				account1.address.toLowerCase(),
			);
			expect(`0x${(JSON.parse(result[1]) as Web3Account)?.address.toLowerCase()}`).toBe(
				account2.address.toLowerCase(),
			);
		});
	});

	describe('decrypt', () => {
		it('should decrypt all accounts and add to wallet', async () => {
			const account1 = accountProvider.create();
			const account2 = accountProvider.create();
			const options = { myOptions: 'myOptions' };
			wallet.add(account1);
			wallet.add(account2);
			const result = await wallet.encrypt('password', options);
			await wallet.decrypt(result, 'password', options);

			expect(wallet).toHaveLength(2);
			expect(wallet.get(0)?.address).toEqual(account1.address);
			expect(wallet.get(0)?.privateKey).toEqual(account1.privateKey);
			expect(wallet.get(1)?.address).toEqual(account2.address);
			expect(wallet.get(1)?.privateKey).toEqual(account2.privateKey);
		});
	});

	describe('save', () => {
		itIf(!(isBrowser || isElectron))(
			'should throw error if local storage not present',
			async () => {
				// eslint-disable-next-line jest/no-standalone-expect
				return expect(wallet.save('password')).rejects.toThrow(
					'Local storage not available.',
				);
			},
		);

		itIf(isBrowser || isElectron)(
			'should encrypt wallet and load it with given key',
			async () => {
				const account = accountProvider.create();
				wallet.add(account);
				// eslint-disable-next-line jest/no-standalone-expect
				expect(await wallet.save('password', 'myKey')).toBe(true);
				// eslint-disable-next-line jest/no-standalone-expect
				expect((await wallet.load('password', 'myKey')).get(0)?.address).toBe(
					account.address,
				);
			},
		);

		itIf(isBrowser || isElectron)(
			'should encrypt wallet and load it with default key',
			async () => {
				const account = accountProvider.create();
				wallet.add(account);
				// eslint-disable-next-line jest/no-standalone-expect
				expect(await wallet.save('password')).toBe(true);
				// eslint-disable-next-line jest/no-standalone-expect
				expect((await wallet.load('password')).get(0)?.address).toBe(account.address);
			},
		);
	});

	describe('load', () => {
		itIf(!(isBrowser || isElectron))(
			'should throw error if local storage not present',
			async () => {
				// eslint-disable-next-line jest/no-standalone-expect
				return expect(wallet.load('password')).rejects.toThrow(
					'Local storage not available.',
				);
			},
		);
	});
});
