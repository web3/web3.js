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
 * @param Web3AccountProvider - AccountProvider for wallet
 *
 * ```ts
 * import Web3 from 'web3';
 * const web3 = new Web3("https://localhost:8454")
 * web3.eth.accounts.wallet
 * > Wallet {
 * _accountProvider: {
 *   create: [Function: create],
 *   privateKeyToAccount: [Function: privateKeyToAccount],
 *   decrypt: [Function: decrypt]
 * },
 * _defaultKeyName: 'web3js_wallet',
 * _accounts: {}
 * }
 * ```
 *
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

	/**
	 * Get the storage object of the browser
	 * @returns the storage
	 */
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
	/**
	 * @returns the number of accounts stored in the wallets
	 */
	public get length() {
		return Object.keys(this._accounts).length;
	}

	/**
	 * Generates one or more accounts in the wallet. If wallets already exist they will not be overridden.
	 * @param numberOfAccounts Number of accounts to create. Leave empty to create an empty wallet.
	 * @returns The wallet
	 * ```ts
	 * import Web3 from 'web3';
	 *
	 * const web3 = new Web3("https://localhost:8454")
	 * web3.eth.accounts.wallet.create(3)
	 * > Wallet {
	 *   _accountProvider: {
	 *	create: [Function: create],
	 *	privateKeyToAccount: [Function: privateKeyToAccount],
	 *	decrypt: [Function: decrypt]
	 *       },
	 *    _defaultKeyName: 'web3js_wallet',
	 *   _accounts: {
	 *	    '0x5d01efd47a37ca79bb63834fc105835c3d1cdcb5': {
	 *	    address: '0x5D01eFd47A37CA79bB63834fc105835c3d1CDcb5',
	 *	    privateKey: '0x02684a681146848fd0ff9c69e63e955bd9cc26020737e3762f0bf6280464aa20',
	 *		signTransaction: [Function: signTransaction],
	 *		sign: [Function: sign],
	 *		encrypt: [Function: encrypt]
	 *		},
	 *	'0x85d70633b90e03e0276b98880286d0d055685ed7': {
	 *		address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
	 *		privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
	 *		signTransaction: [Function: signTransaction],
	 *		sign: [Function: sign],
	 *		encrypt: [Function: encrypt]
	 *	},
	 *	'0x2c3dd207645e2c0a10956124d21920f104f0b06d': {
	 *	address: '0x2C3dd207645e2c0a10956124d21920F104f0b06D',
	 *	privateKey: '0x9d66bece56a14b4017900b2113334db14ebf240fb4e5abc93f1d9e701ddd3108',
	 *	signTransaction: [Function: signTransaction],
	 *	sign: [Function: sign],
	 *	encrypt: [Function: encrypt]
	 *		}
	 *	}
	 * }
	 *
	 * ```
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
	 * @param account A private key or account object
	 * @returns The wallet
	 *
	 * ```ts
	 * web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387');
	 * web3.eth.accounts
	 * Wallet {
	 * _accountProvider: {
	 *	create: [Function: create],
	 *	privateKeyToAccount: [Function: privateKeyToAccount],
	 *	decrypt: [Function: decrypt]
	 * },
	 * _defaultKeyName: 'web3js_wallet',
	 * _accounts: {
	 *	'0x85d70633b90e03e0276b98880286d0d055685ed7': {
	 *	address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
	 * 	privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
	 *  signTransaction: [Function: signTransaction],
	 *	sign: [Function: sign],
	 *	encrypt: [Function: encrypt]
	 *	}
	 * }
	 * }
	 *
	 */
	public add(account: T | string): this {
		if (typeof account === 'string') {
			return this.add(this._accountProvider.privateKeyToAccount(account));
		}

		this._accounts[account.address.toLowerCase()] = account;

		return this;
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
	 * Removes an account from the wallet.
	 * @param addressOrIndex - The account address, or index in the wallet.
	 * @returns true if the wallet was removed. false if it couldn’t be found.
	 * ```ts
	 * web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387');
	 *
	 * web3.eth.accounts.wallet.remove('0x85D70633b90e03e0276B98880286D0D055685ed7'); // FIX THIS
	 * ```
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
	 * ```ts
	 *
	 * web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387');
	 * Wallet {
	 * _accountProvider: {
	 *	create: [Function: create],
	 *	privateKeyToAccount: [Function: privateKeyToAccount],
	 *	decrypt: [Function: decrypt]
	 * },
	 * _defaultKeyName: 'web3js_wallet',
	 * _accounts: {
	 *	'0x85d70633b90e03e0276b98880286d0d055685ed7': {
	 *	address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
	 *	privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
	 *	signTransaction: [Function: signTransaction],
	 *	sign: [Function: sign],
	 *	encrypt: [Function: encrypt]
	 *	   }
	 *   }
	 * }
	 * web3.eth.accounts.wallet.clear();
	 * Wallet {
	 * _accountProvider: {
	 *	create: [Function: create],
	 *	privateKeyToAccount: [Function: privateKeyToAccount],
	 *	decrypt: [Function: decrypt]
	 * },
	 * _defaultKeyName: 'web3js_wallet',
	 * _accounts: {}
	 * }
	 * ```
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
	 * ```ts
	 * web3.eth.accounts.wallet.create(1)
	 * > Wallet {
	 * _accountProvider: {
	 *	create: [Function: create],
	 *	privateKeyToAccount: [Function: privateKeyToAccount],
	 *	decrypt: [Function: decrypt]
	 * },
	 * _defaultKeyName: 'web3js_wallet',
	 * _accounts: {
	 *	'0xfa3e41a401609103c241431cbdee8623ae2a321a': {
	 *	address: '0xFA3e41A401609103C241431cbDEE8623ae2a321a',
	 *	privateKey: '0x7f468e0b7be2fd31bd6d4a6646e76dbfa304b2cd618d6577a5534cc9db34e4cb',
	 *	signTransaction: [Function: signTransaction],
	 *	sign: [Function: sign],
	 *	encrypt: [Function: encrypt]
	 *	   }
	 *   }
	 * }
	 * web3.eth.accounts.wallet.encrypt("abc").then(console.log);
	 * [
	 * '{"version":3,"id":"fa46e213-a7c3-4844-b903-dd14d39cc7db","address":"fa3e41a401609103c241431cbdee8623ae2a321a","crypto":{"ciphertext":"8d179a911d6146ad2924e86bf493ed89b8ff3596ffec0816e761c542016ab13c","cipherparams":{"iv":"acc888c6cf4a19b86846cef0185a7164"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"n":8192,"r":8,"p":1,"dklen":32,"salt":"6a743c9b367d15f4758e4f3f3378ff0fd443708d1c64854e07588ea5331823ae"},"mac":"410544c8307e3691fda305eb3722d82c3431f212a87daa119a21587d96698b57"}}'
	 * ]
	 */
	public async encrypt(password: string, options?: Record<string, unknown> | undefined) {
		return Promise.all(
			Object.values(this._accounts).map(async account => account.encrypt(password, options)),
		);
	}

	/**
	 * Decrypts keystore v3 objects.
	 * @param encryptedWallets `string[]` An array of encrypted keystore v3 objects to decrypt
	 * @param password `String` The password to encrypt with
	 * @param options decrypt options for the wallets
	 * @returns The decrypted wallet object
	 *
	 * ```ts
	 * web3.eth.accounts.wallet.decrypt([
	 * { version: 3,
	 * id: '83191a81-aaca-451f-b63d-0c5f3b849289',
	 * address: '06f702337909c06c82b09b7a22f0a2f0855d1f68',
	 * crypto:
	 * { ciphertext: '7d34deae112841fba86e3e6cf08f5398dda323a8e4d29332621534e2c4069e8d',
	 *   cipherparams: { iv: '497f4d26997a84d570778eae874b2333' },
	 *   cipher: 'aes-128-ctr',
	 *   kdf: 'scrypt',
	 *   kdfparams:
	 *    { dklen: 32,
	 *      salt: '208dd732a27aa4803bb760228dff18515d5313fd085bbce60594a3919ae2d88d',
	 *      n: 262144,
	 *      r: 8,
	 *      p: 1 },
	 *   mac: '0062a853de302513c57bfe3108ab493733034bf3cb313326f42cf26ea2619cf9' } },
	 * { version: 3,
	 * id: '7d6b91fa-3611-407b-b16b-396efb28f97e',
	 * address: 'b5d89661b59a9af0b34f58d19138baa2de48baaf',
	 * crypto:
	 * { ciphertext: 'cb9712d1982ff89f571fa5dbef447f14b7e5f142232bd2a913aac833730eeb43',
	 *   cipherparams: { iv: '8cccb91cb84e435437f7282ec2ffd2db' },
	 *   cipher: 'aes-128-ctr',
	 *   kdf: 'scrypt',
	 *   kdfparams:
	 *    { dklen: 32,
	 *      salt: '08ba6736363c5586434cd5b895e6fe41ea7db4785bd9b901dedce77a1514e8b8',
	 *      n: 262144,
	 *      r: 8,
	 *      p: 1 },
	 *   mac: 'd2eb068b37e2df55f56fa97a2bf4f55e072bef0dd703bfd917717d9dc54510f0' } }
	 * ], 'test').then(console.log)
	 * > Wallet {
	 *   _accountProvider: {
	 *     create: [Function: create],
	 *     privateKeyToAccount: [Function: privateKeyToAccount],
	 *     decrypt: [Function: decrypt]
	 *   },
	 *   _defaultKeyName: 'web3js_wallet',
	 *   _accounts: {
	 *     '0x85d70633b90e03e0276b98880286d0d055685ed7': {
	 *       address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
	 *       privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
	 *       signTransaction: [Function: signTransaction],
	 *       sign: [Function: sign],
	 *       encrypt: [Function: encrypt]
	 *     },
	 *     '0x06f702337909c06c82b09b7a22f0a2f0855d1f68': {
	 *       address: '0x06F702337909C06C82B09B7A22F0a2f0855d1F68',
	 *       privateKey: '87a51da18900da7398b3bab03996833138f269f8f66dd1237b98df6b9ce14573',
	 *       signTransaction: [Function: signTransaction],
	 *       sign: [Function: sign],
	 *       encrypt: [Function: encrypt]
	 *     },
	 *     '0xb5d89661b59a9af0b34f58d19138baa2de48baaf': {
	 *       address: '0xB5d89661B59a9aF0b34f58D19138bAa2de48BAaf',
	 *       privateKey: '7ee61c5282979aae9dd795bb6a54e8bdc2bfe009acb64eb9a67322eec3b3da6e',
	 *       signTransaction: [Function: signTransaction],
	 *       sign: [Function: sign],
	 *       encrypt: [Function: encrypt]
	 *     }
	 *   }
	 * }
	 * ```
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
	 * Stores the wallet encrypted and as string in local storage.
	 * **__NOTE:__** Browser only
	 * @param password `String` The password to encrypt the wallet
	 * @param keyName `String` (optional) The key used for the local storage position, defaults to `"web3js_wallet"`.
	 * @returns Will return boolean value true if saved properly
	 * ```ts
	 * web3.eth.accounts.wallet.save('test#!$');
	 * >true
	 * ```
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
	 * **__NOTE:__** Browser only
	 * @param password `String` The password to decrypt the wallet.
	 * @param keyName `String` (optional)The key used for local storage position, defaults to `web3js_wallet"`
	 * @returns Returns the wallet object
	 *
	 * ```ts
	 * web3.eth.accounts.wallet.save('test#!$');
	 * > true
	 * web3.eth.accounts.wallet.load('test#!$');
	 * { defaultKeyName: "web3js_wallet",
	 *   length: 0,
	 *   _accounts: Accounts {_requestManager: RequestManager, givenProvider: Proxy, providers: {…}, _provider: WebsocketProvider, …},
	 *   [[Prototype]]: Object
	 * }
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
