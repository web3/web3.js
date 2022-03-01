import { Address, HexString } from 'web3-utils';
import { Transaction } from 'web3-eth';

export type EthPersonalAPI = {
	personal_listAccounts: () => Address[];
	personal_newAccount: (password: string) => Address;
	personal_unlockAccount: (address: Address, password: string, unlockDuration: number) => boolean;
	personal_lockAccount: (address: Address) => boolean;
	personal_importRawKey: (keyData: HexString, passphrase: string) => boolean;
	personal_sendTransaction: (tx: Transaction, passphrase: string) => HexString;
	personal_signTransaction: (tx: Transaction, passphrase: string) => HexString;
	personal_sign: (data: HexString, address: Address, passphrase: string) => HexString;
	personal_ecRecover: (signedData: HexString, signature: HexString) => Address;
};
