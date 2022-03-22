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

export type Web3EncryptedWallet = string;

export interface Web3BaseWalletAccount {
	[key: string]: unknown;
	readonly address: string;
	readonly privateKey: string;
	readonly signTransaction: (tx: Record<string, unknown>) => string;
	readonly sign: (data: Record<string, unknown> | string) => string;
	readonly encrypt: (password: string, options?: Record<string, unknown>) => Web3EncryptedWallet;
}

export interface Web3AccountProvider<T> {
	privateKeyToAccount: (privateKey: string) => T;
	create: () => T;
	decrypt: (keystore: string, password: string, options?: Record<string, unknown>) => T;
}

export abstract class Web3BaseWallet<T extends Web3BaseWalletAccount> {
	protected readonly _accountProvider: Web3AccountProvider<T>;

	public constructor(accountProvider: Web3AccountProvider<T>) {
		this._accountProvider = accountProvider;
	}

	public abstract create(numberOfAccounts: number): this;
	public abstract add(account: T | string): boolean;
	public abstract get(addressOrIndex: string | number): T;
	public abstract remove(addressOrIndex: string | number): boolean;
	public abstract clear(): this;
	public abstract encrypt(
		password: string,
		options?: Record<string, unknown>,
	): Web3EncryptedWallet[];
	public abstract decrypt(
		encryptedWallet: Web3EncryptedWallet[],
		password: string,
		options?: Record<string, unknown>,
	): this;
	public abstract save(password: string, keyName?: string): boolean | never;
	public abstract load(password: string, keyName?: string): this | never;
}
