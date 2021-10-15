/* eslint-disable no-underscore-dangle */

import {
	Web3BaseWallet,
	Web3BaseWalletAccount,
	Web3AccountProvider,
	Web3EncryptedWallet,
} from 'web3-common';

type BrowserError = { code: number; name: string };

export class LocalStorageWallet<
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

	public create(numberOfAccounts: number, entropy: string) {
		for (let i = 0; i < numberOfAccounts; i += 1) {
			this.add(this._accountProvider.create(entropy));
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

	public encrypt(password: string, options?: Record<string, unknown> | undefined) {
		return Object.values(this._accounts).map(account => account.encrypt(password, options));
	}

	public decrypt(
		encryptedWallets: string[],
		password: string,
		options?: Record<string, unknown> | undefined,
	) {
		for (const wallet of encryptedWallets) {
			this.add(this._accountProvider.decrypt(wallet, password, options));
		}

		return this;
	}

	public save(password: string, keyName?: string) {
		const storage = LocalStorageWallet.getStorage();

		if (!storage) {
			throw new Error('Local storage not available.');
		}

		storage.setItem(keyName ?? this._defaultKeyName, JSON.stringify(this.encrypt(password)));

		return true;
	}

	public load(password: string, keyName?: string) {
		const storage = LocalStorageWallet.getStorage();

		if (!storage) {
			throw new Error('Local storage not available.');
		}

		const keystore = storage.getItem(keyName ?? this._defaultKeyName);

		if (keystore) {
			this.decrypt((JSON.parse(keystore) as Web3EncryptedWallet[]) || [], password);
		}

		return this;
	}
}
