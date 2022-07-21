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
import { HexString } from './primitives_types';

export type Web3EncryptedWallet = string;

export interface Web3BaseWalletAccount {
	[key: string]: unknown;
	readonly address: string;
	readonly privateKey: string;
	readonly signTransaction: (tx: Record<string, unknown>) => Promise<{
		readonly messageHash: HexString;
		readonly r: HexString;
		readonly s: HexString;
		readonly v: HexString;
		readonly rawTransaction: HexString;
		readonly transactionHash: HexString;
	}>;
	readonly sign: (data: Record<string, unknown> | string) => {
		readonly messageHash: HexString;
		readonly r: HexString;
		readonly s: HexString;
		readonly v: HexString;
		readonly message?: string;
		readonly signature: HexString;
	};
	readonly encrypt: (
		password: string,
		options?: Record<string, unknown>,
	) => Promise<Web3EncryptedWallet>;
}

export interface Web3AccountProvider<T> {
	privateKeyToAccount: (privateKey: string) => T;
	create: () => T;
	decrypt: (keystore: string, password: string, options?: Record<string, unknown>) => Promise<T>;
}

export abstract class Web3BaseWallet<T extends Web3BaseWalletAccount> extends Array<T> {
	protected readonly _accountProvider: Web3AccountProvider<T>;

	public constructor(accountProvider: Web3AccountProvider<T>) {
		super();
		this._accountProvider = accountProvider;
	}

	public abstract create(numberOfAccounts: number): this;
	public abstract add(account: T | string): this;
	public abstract get(addressOrIndex: string | number): T | undefined;
	public abstract remove(addressOrIndex: string | number): boolean;
	public abstract clear(): this;
	public abstract encrypt(
		password: string,
		options?: Record<string, unknown>,
	): Promise<Web3EncryptedWallet[]>;
	public abstract decrypt(
		encryptedWallet: Web3EncryptedWallet[],
		password: string,
		options?: Record<string, unknown>,
	): Promise<this>;
	public abstract save(password: string, keyName?: string): Promise<boolean | never>;
	public abstract load(password: string, keyName?: string): Promise<this | never>;
}
