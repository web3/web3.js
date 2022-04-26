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

import { FeeMarketEIP1559TxData, AccessListEIP2930TxData, TxData } from '@ethereumjs/tx';
import { Web3BaseWalletAccount } from 'web3-common';
import { HexString } from 'web3-utils';

export type signatureObject = {
	messageHash: string;
	r: string;
	s: string;
	v: string;
};

export const keyStoreSchema = {
	type: 'object',
	required: ['crypto', 'id', 'version', 'address'],
	properties: {
		crypto: {
			type: 'object',
			required: ['cipher', 'ciphertext', 'cipherparams', 'kdf', 'kdfparams', 'mac'],
			properties: {
				cipher: { type: 'string' },
				ciphertext: { type: 'string' },
				cipherparams: { type: 'object' },
				kdf: { type: 'string' },
				kdfparams: { type: 'object' },
				salt: { type: 'string' },
				mac: { type: 'string' },
			},
		},
		id: { type: 'string' },
		version: { type: 'number' },
		address: { type: 'string' },
	},
};

export type signTransactionResult = signatureObject & {
	rawTransaction: string;
	transactionHash: string;
};

export type signTransactionFunction = (
	transaction:
		| TxData
		| AccessListEIP2930TxData
		| FeeMarketEIP1559TxData
		| Record<string, unknown>,
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

export interface Web3Account extends Web3BaseWalletAccount {
	address: HexString;
	privateKey: HexString;
}
