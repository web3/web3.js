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

import {
	Web3BaseWallet,
	Web3BaseWalletAccount,
	Web3AccountProvider,
	Web3EncryptedWallet,
} from 'web3-common';
import { isNullish } from 'web3-validator';

type BrowserError = { code: number; name: string };

/**
 * Wallet is an in memory `wallet` that can hold multiple accounts.
 * These accounts can be used when using web3.eth.sendTransaction().
 *
 * @param {Web3AccountProvider}
 */
export class Wallet<
	T extends Web3BaseWalletAccount = Web3BaseWalletAccount,
> extends Web3BaseWallet<T> {
	private readonly _accounts: { [key: string]: T };
	private readonly _defaultKeyName = 'web3js_wallet';

	public constructor(accountProvider: Web3AccountProvider<T>) {
		super(accountProvider);
		this._accounts = {};
	}

	public static getStorage(): Storage | undefined {
		let storage: Storage | undefined;

		try {
			storage = window.localStorage;
			const x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);

			return storage;
		} catch (e: unknown) {
			return (e as BrowserError) &&
				// everything except Firefox
				((e as BrowserError).code === 22 ||
					// Firefox
					(e as BrowserError).code === 1014 ||
					// test name field too, because code might not be present
					// everything except Firefox
					(e as BrowserError).name === 'QuotaExceededError' ||
					// Firefox
					(e as BrowserError).name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// acknowledge QuotaExceededError only if there's something already stored
				!isNullish(storage) &&
				storage.length !== 0
				? storage
				: undefined;
		}
	}

	public get length() {
		return Object.keys(this._accounts).length;
	}

	/**
	 * @param numberOfAccounts Number of accounts to create. Leave empty to create an empty wallet.
	 * @returns {Wallet} The wallet Object
	 */
	public create(numberOfAccounts: number) {
		for (let i = 0; i < numberOfAccounts; i += 1) {
			this.add(this._accountProvider.create());
		}

		return this;
	}

	/**
	 * Adds an account using a private key or account object to the wallet.
	 *
	 * @param account A private key or account object {T}
	 * @returns The added account
	 */
	public add(account: T | string): boolean {
		if (typeof account === 'string') {
			return this.add(this._accountProvider.privateKeyToAccount(account));
		}

		this._accounts[account.address.toLowerCase()] = account;

		return true;
	}
	/**
	 * Get the account of the wallet with either the index or public address.
	 *
	 * @param addressOrIndex A string of the address or number index within the wallet.
	 * @returns The account object {T}
	 */
	public get(addressOrIndex: string | number): T {
		if (typeof addressOrIndex === 'string') {
			return this._accounts[addressOrIndex];
		}

		return Object.values(this._accounts)[addressOrIndex];
	}

	/**
	 *
	 * @param addressOrIndex - {String|Number}: The account address, or index in the wallet.
	 * @returns true if the wallet was removed. false if it couldn’t be found.
	 */
	public remove(addressOrIndex: string | number): boolean {
		const result =
			typeof addressOrIndex === 'string'
				? { address: addressOrIndex }
				: Object.values(this._accounts)[addressOrIndex];

		if (result && this._accounts[result.address]) {
			delete this._accounts[result.address];
			return true;
		}

		return false;
	}

	/**
	 * Securely empties the wallet and removes all its accounts.
	 *
	 * @returns The wallet object
	 */
	public clear() {
		for (const key of Object.keys(this._accounts)) {
			delete this._accounts[key];
		}

		return this;
	}

	/**
	 * Encrypts all wallet accounts to an array of encrypted keystore v3 objects.
	 *
	 * @param password `string` - The password which will be used for encryption
	 * @param options - encryption options
	 * @returns An array of the encrypted keystore v3.
	 */
	public async encrypt(password: string, options?: Record<string, unknown> | undefined) {
		return Promise.all(
			Object.values(this._accounts).map(async account => account.encrypt(password, options)),
		);
	}

	/**
	 *
	 * @param encryptedWallets `string[]` An array of encrypted keystore v3 objects to decrypt
	 * @param password `String` The password to encrypt with
	 * @param options decrypt options for the wallets
	 * @returns The decrypted wallet object
	 */
	public async decrypt(
		encryptedWallets: string[],
		password: string,
		options?: Record<string, unknown> | undefined,
	) {
		const results = await Promise.all(
			encryptedWallets.map(async wallet =>
				this._accountProvider.decrypt(wallet, password, options),
			),
		);

		for (const res of results) {
			this.add(res);
		}

		return this;
	}

	/**
	 *
	 * @param password `String` The password to encrypt the wallet
	 * @param keyName `String` (optional) The key used for the local storage position, defaults to `"web3js_wallet"`.
	 * @returns Will return boolean value true if saved properly
	 */
	public async save(password: string, keyName?: string) {
		const storage = Wallet.getStorage();

		if (!storage) {
			throw new Error('Local storage not available.');
		}

		storage.setItem(
			keyName ?? this._defaultKeyName,
			JSON.stringify(await this.encrypt(password)),
		);

		return true;
	}

	/**
	 * Loads a wallet from local storage and decrypts it.
	 *
	 * @param password `String` The password to decrypt the wallet.
	 * @param keyName `String` (optional)The key used for local storage position, defaults to `web3js_wallet"`
	 * @returns Returns the wallet object
	 */
	public async load(password: string, keyName?: string) {
		const storage = Wallet.getStorage();

		if (!storage) {
			throw new Error('Local storage not available.');
		}

		const keystore = storage.getItem(keyName ?? this._defaultKeyName);

		if (keystore) {
			await this.decrypt((JSON.parse(keystore) as Web3EncryptedWallet[]) || [], password);
		}

		return this;
	}
}
