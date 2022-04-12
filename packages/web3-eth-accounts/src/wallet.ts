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

type BrowserError = { code: number; name: string };

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
				storage !== undefined &&
				storage.length !== 0
				? storage
				: undefined;
		}
	}

	public get length() {
		return Object.keys(this._accounts).length;
	}

	public create(numberOfAccounts: number) {
		for (let i = 0; i < numberOfAccounts; i += 1) {
			this.add(this._accountProvider.create());
		}

		return this;
	}

	public add(account: T | string): boolean {
		if (typeof account === 'string') {
			return this.add(this._accountProvider.privateKeyToAccount(account));
		}

		this._accounts[account.address.toLowerCase()] = account;

		return true;
	}

	public get(addressOrIndex: string | number): T {
		if (typeof addressOrIndex === 'string') {
			return this._accounts[addressOrIndex];
		}

		return Object.values(this._accounts)[addressOrIndex];
	}

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

	public clear() {
		for (const key of Object.keys(this._accounts)) {
			delete this._accounts[key];
		}

		return this;
	}

	public async encrypt(password: string, options?: Record<string, unknown> | undefined) {
		return Promise.all(
			Object.values(this._accounts).map(async account => account.encrypt(password, options)),
		);
	}

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
