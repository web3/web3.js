export interface Web3BaseWalletAccount {
	[key: string]: unknown;
	readonly address: string;
	readonly privateKey: string;
	readonly signTransaction: (tx: Record<string, unknown>) => string;
	readonly sign: (data: Record<string, unknown> | string) => string;
	readonly encrypt: (password: string, options?: Record<string, unknown>) => string;
}
export type Web3EncryptedWallet = string;

export interface Web3BaseWallet<T = Web3BaseWalletAccount> {
	create: (numberOfAccounts: number, entropy: string) => Web3BaseWallet<T>;
	add: (account: T) => boolean;
	get: (addressOrIndex: string | number) => T;
	remove: (addressOrIndex: string | number) => boolean;
	clear: () => Web3BaseWallet<T>;
	encrypt: (password: string, options?: Record<string, unknown>) => T[];
	decrypt: (
		encryptedWallet: Web3EncryptedWallet[],
		password: string,
		options?: Record<string, unknown>,
	) => Web3BaseWallet<T>;
	save: (password: string, keyName?: string) => boolean | never;
	load: (password: string, keyName?: string) => Web3BaseWallet<T>;
}
