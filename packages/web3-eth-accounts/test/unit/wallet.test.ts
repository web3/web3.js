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

import { when } from 'jest-when';
import { Web3AccountProvider, Web3BaseWalletAccount } from 'web3-common';
import { Wallet } from '../../src/wallet';

describe('Wallet', () => {
	let wallet: Wallet;
	let accountProvider: Web3AccountProvider<Web3BaseWalletAccount>;
	let localStorageSpy: {
		getItem: jest.MockedFunction<(key: string) => string>;
		setItem: jest.MockedFunction<(key: string, value: string) => string>;
	};
	let totalAccountsCreate = 0;
	let totalPrivatekeyCreate = 0;

	beforeEach(() => {
		localStorageSpy = { getItem: jest.fn(), setItem: jest.fn() };

		jest.spyOn(Wallet, 'getStorage').mockReturnValue(localStorageSpy as never);

		accountProvider = {
			privateKeyToAccount: jest.fn().mockImplementation(() => {
				totalPrivatekeyCreate += 1;
				return { address: `privatekey_create_${totalPrivatekeyCreate}` };
			}),
			decrypt: jest.fn(),
			create: jest.fn().mockImplementation(() => {
				totalAccountsCreate += 1;
				return { address: `account_create_${totalAccountsCreate}` };
			}),
		};
		wallet = new Wallet(accountProvider);
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
			expect(accounts).toMatchSnapshot();
			expect(accountProvider.create).toHaveBeenCalledTimes(numberOfAccounts);
		});
	});

	describe('add', () => {
		it('should create account from private key if string value is given', () => {
			const privateKey = 'private key';
			const result = wallet.add(privateKey);

			expect(result).toBeTruthy();

			expect(accountProvider.privateKeyToAccount).toHaveBeenCalledTimes(1);
			expect(accountProvider.privateKeyToAccount).toHaveBeenCalledWith(privateKey);
			expect(wallet).toHaveLength(1);
			expect(wallet.get(0)).toEqual({ address: 'privatekey_create_1' });
		});

		it('should not create account from private key if object value is given', () => {
			const result = wallet.add({ address: 'my_address' } as never);

			expect(result).toBeTruthy();
			expect(accountProvider.privateKeyToAccount).toHaveBeenCalledTimes(0);
			expect(wallet).toHaveLength(1);
			expect(wallet.get(0)).toEqual({ address: 'my_address' });
		});

		it('should add account with lowercase address', () => {
			const result = wallet.add({ address: 'myAddress' } as never);

			expect(result).toBeTruthy();
			expect(accountProvider.privateKeyToAccount).toHaveBeenCalledTimes(0);
			expect(wallet).toHaveLength(1);
			expect(wallet.get('myaddress')).toEqual({ address: 'myAddress' });
		});

		it('should override account object for existing address', () => {
			const account1 = { address: 'address', privateKey: 'pkey1' } as never;
			const account2 = { address: 'address', privateKey: 'pkey2' } as never;

			wallet.add(account1);
			expect(wallet.get('address')).toEqual(account1);

			wallet.add(account2);
			expect(wallet.get('address')).toEqual(account2);
		});
	});

	describe('get', () => {
		it('should get account for given index', () => {
			const account = { address: 'my_address' } as never;

			wallet.add(account);

			expect(wallet.get(0)).toEqual(account);
		});

		it('should get account for given address', () => {
			const account = { address: 'my_address' } as never;

			wallet.add(account);

			expect(wallet.get('my_address')).toEqual(account);
		});

		it('should get account for given address only in lower case', () => {
			const account = { address: 'my_Address' } as never;

			wallet.add(account);

			expect(wallet.get('my_address')).toEqual(account);
			expect(wallet.get('my_Address')).toBeUndefined();
		});
	});

	describe('remove', () => {
		it('should remove account for given index', () => {
			const account = { address: 'my_address' } as never;
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove(0);

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});

		it('should return false if index not found', () => {
			const account = { address: 'my_address' } as never;
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove(2);

			expect(result).toBeFalsy();
			expect(wallet).toHaveLength(1);
		});

		it('should remove account for given address', () => {
			const account = { address: 'my_address' } as never;
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove('my_address');

			expect(result).toBeTruthy();
			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});

		it('should return false if given address not found', () => {
			const account = { address: 'my_address' } as never;
			wallet.add(account);
			expect(wallet).toHaveLength(1);

			const result = wallet.remove('my_address2');

			expect(result).toBeFalsy();
			expect(wallet).toHaveLength(1);
		});
	});

	describe('clear', () => {
		it('should remove all accounts', () => {
			wallet.add({ address: 'my_address' } as never);
			wallet.add({ address: 'my_address2' } as never);
			expect(wallet).toHaveLength(2);

			wallet.clear();

			expect(wallet).toHaveLength(0);
			expect(wallet.get(0)).toBeUndefined();
		});
	});

	describe('encrypt', () => {
		it('should encrypt all accounts and return array', async () => {
			const account1 = {
				address: 'my_address1',
				encrypt: jest.fn().mockResolvedValue('encrypted_account1'),
			} as any;
			const account2 = {
				address: 'my_address2',
				encrypt: jest.fn().mockResolvedValue('encrypted_account2'),
			} as any;
			const options = { myOptions: 'myOptions' };
			wallet.add(account1);
			wallet.add(account2);

			const result = await wallet.encrypt('password', options);

			expect(account1.encrypt).toHaveBeenCalledTimes(1);
			expect(account1.encrypt).toHaveBeenCalledWith('password', options);
			expect(account2.encrypt).toHaveBeenCalledTimes(1);
			expect(account2.encrypt).toHaveBeenCalledWith('password', options);
			expect(result).toEqual(['encrypted_account1', 'encrypted_account2']);
		});
	});

	describe('decrypt', () => {
		it('should decrypt all accounts and add to wallet', async () => {
			const encryptedAccount1 = 'encrypted_account1';
			const encryptedAccount2 = 'encrypted_account2';
			const account1 = { address: 'my_address1' } as any;
			const account2 = { address: 'my_address2' } as any;
			const options = { myOptions: 'myOptions' };

			when(accountProvider.decrypt)
				.calledWith(encryptedAccount1, 'password', options)
				.mockResolvedValue(account1);
			when(accountProvider.decrypt)
				.calledWith(encryptedAccount2, 'password', options)
				.mockResolvedValue(account2);

			await wallet.decrypt([encryptedAccount1, encryptedAccount2], 'password', options);

			expect(accountProvider.decrypt).toHaveBeenCalledTimes(2);
			expect(accountProvider.decrypt).toHaveBeenCalledWith(
				encryptedAccount1,
				'password',
				options,
			);
			expect(accountProvider.decrypt).toHaveBeenCalledWith(
				encryptedAccount2,
				'password',
				options,
			);
			expect(wallet).toHaveLength(2);
			expect(wallet.get(0)).toEqual(account1);
			expect(wallet.get(1)).toEqual(account2);
		});
	});

	describe('save', () => {
		it('should throw error if local storage not present', async () => {
			jest.spyOn(Wallet, 'getStorage').mockReturnValue(undefined);

			return expect(wallet.save('password')).rejects.toThrow('Local storage not available.');
		});

		it('should encrypt wallet and store with local storage for given key', async () => {
			const encryptedWallet = ['encryptedWallet'];
			jest.spyOn(wallet, 'encrypt').mockResolvedValue(encryptedWallet);

			await wallet.save('password', 'myKey');

			expect(wallet.encrypt).toHaveBeenCalledTimes(1);
			expect(wallet.encrypt).toHaveBeenCalledWith('password');
			expect(localStorageSpy.setItem).toHaveBeenCalledTimes(1);
			expect(localStorageSpy.setItem).toHaveBeenCalledWith(
				'myKey',
				JSON.stringify(encryptedWallet),
			);
		});

		it('should encrypt wallet and store with local storage with default key', async () => {
			const encryptedWallet = ['encryptedWallet'];
			jest.spyOn(wallet, 'encrypt').mockResolvedValue(encryptedWallet);

			await wallet.save('password');

			expect(wallet.encrypt).toHaveBeenCalledTimes(1);
			expect(wallet.encrypt).toHaveBeenCalledWith('password');
			expect(localStorageSpy.setItem).toHaveBeenCalledTimes(1);
			expect(localStorageSpy.setItem).toHaveBeenCalledWith(
				'web3js_wallet',
				JSON.stringify(encryptedWallet),
			);
		});
	});

	describe('load', () => {
		it('should throw error if local storage not present', async () => {
			jest.spyOn(Wallet, 'getStorage').mockReturnValue(undefined);

			return expect(wallet.load('password')).rejects.toThrow('Local storage not available.');
		});

		it('should load wallet from local storage for given key and decrypt', async () => {
			const encryptedWallet = JSON.stringify(['encryptedWallet']);

			when(localStorageSpy.getItem).calledWith('myKey').mockReturnValue(encryptedWallet);
			jest.spyOn(wallet, 'decrypt').mockResolvedValue({} as never);

			await wallet.load('password', 'myKey');

			expect(wallet.decrypt).toHaveBeenCalledTimes(1);
			expect(wallet.decrypt).toHaveBeenCalledWith(['encryptedWallet'], 'password');
			expect(localStorageSpy.getItem).toHaveBeenCalledTimes(1);
			expect(localStorageSpy.getItem).toHaveBeenCalledWith('myKey');
		});

		it('should load wallet from local storage for default key and decrypt', async () => {
			const encryptedWallet = JSON.stringify(['encryptedWallet']);

			when(localStorageSpy.getItem)
				.calledWith('web3js_wallet')
				.mockReturnValue(encryptedWallet);
			jest.spyOn(wallet, 'decrypt').mockResolvedValue({} as never);

			await wallet.load('password');

			expect(wallet.decrypt).toHaveBeenCalledTimes(1);
			expect(wallet.decrypt).toHaveBeenCalledWith(['encryptedWallet'], 'password');
			expect(localStorageSpy.getItem).toHaveBeenCalledTimes(1);
			expect(localStorageSpy.getItem).toHaveBeenCalledWith('web3js_wallet');
		});
	});
});
