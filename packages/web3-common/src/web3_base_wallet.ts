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
	create: (entropy: string) => T;
	decrypt: (keystore: string, password: string, options?: Record<string, unknown>) => T;
}

export abstract class Web3BaseWallet<T extends Web3BaseWalletAccount> {
	protected readonly _accountProvider: Web3AccountProvider<T>;

	public constructor(accountProvider: Web3AccountProvider<T>) {
		this._accountProvider = accountProvider;
	}

	abstract create(numberOfAccounts: number, entropy: string): this;
	abstract add(account: T | string): boolean;
	abstract get(addressOrIndex: string | number): T;
	abstract remove(addressOrIndex: string | number): boolean;
	abstract clear(): this;
	abstract encrypt(password: string, options?: Record<string, unknown>): Web3EncryptedWallet[];
	abstract decrypt(
		encryptedWallet: Web3EncryptedWallet[],
		password: string,
		options?: Record<string, unknown>,
	): this;
	abstract save(password: string, keyName?: string): boolean | never;
	abstract load(password: string, keyName?: string): this | never;
}
