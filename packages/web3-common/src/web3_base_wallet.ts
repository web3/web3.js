import { HexString } from 'web3-utils';

export type Web3EncryptedWallet = string;

export interface Web3BaseWalletAccount {
	[key: string]: unknown;
	readonly address: string;
	readonly privateKey: string;
	readonly signTransaction: (tx: Record<string, unknown>) => {
		readonly messageHash: HexString;
		readonly r: HexString;
		readonly s: HexString;
		readonly v: HexString;
		readonly rawTransaction: HexString;
		readonly transactionHash: HexString;
	};
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
	): Promise<Web3EncryptedWallet[]>;
	public abstract decrypt(
		encryptedWallet: Web3EncryptedWallet[],
		password: string,
		options?: Record<string, unknown>,
	): Promise<this>;
	public abstract save(password: string, keyName?: string): Promise<boolean | never>;
	public abstract load(password: string, keyName?: string): Promise<this | never>;
}
