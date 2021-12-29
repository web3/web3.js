import { FeeMarketEIP1559TxData, AccessListEIP2930TxData, TxData } from '@ethereumjs/tx';
import { HexString } from 'web3-utils';

export type signatureObject = {
	messageHash: string;
	r: string;
	s: string;
	v: string;
};

export type signTransactionResult = signatureObject & {
	rawTransaction: string;
	transactionHash: string;
};

export type signTransactionFunction = (
	transaction: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData,
	privateKey: string,
) => signTransactionResult;

export type signResult = signatureObject & {
	message?: string;
	signature: string;
};

export type signFunction = (data: string, privateKey: string) => signResult;

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition

export type Cipher = 'aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc';

export type CipherOptions = {
	salt?: Buffer | string;
	iv?: Buffer | string;
	kdf?: 'scrypt' | 'pbkdf2';
	dklen?: number;
	c?: number; // iterrations
	n?: number; // cpu/memory cost
	r?: number; // block size
	p?: number; // parallelization cost
};

export type ScryptParams = {
	dklen: number;
	n: number;
	p: number;
	r: number;
	salt: Buffer | string;
};
export type PBKDF2SHA256Params = {
	c: number; // iterations
	dklen: number;
	prf: 'hmac-sha256';
	salt: Buffer | string;
};

export type KeyStore = {
	crypto: {
		cipher: Cipher;
		ciphertext: string;
		cipherparams: {
			iv: string;
		};
		kdf: 'pbkdf2' | 'scrypt';
		kdfparams: ScryptParams | PBKDF2SHA256Params;
		mac: HexString;
	};
	id: string;
	version: 3;
	address: string;
};
