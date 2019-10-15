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
/**
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    AccountsBase,
    SignedTransaction,
    TransactionConfig,
    WalletBase
} from 'web3-core';

export class Accounts extends AccountsBase {}

export class Wallet extends WalletBase {}

export interface AddAccount {
    address: string;
    privateKey: string;
}

export interface Account {
    address: string;
    privateKey: string;
    signTransaction: (
        transactionConfig: TransactionConfig,
        callback?: (signTransaction: SignedTransaction) => void
    ) => Promise<SignedTransaction>;
    sign: (data: string) => Sign;
    encrypt: (password: string) => EncryptedKeystoreV3Json;
}

export interface AddedAccount extends Account {
    index: number;
}

export interface EncryptedKeystoreV3Json {
    version: number;
    id: string;
    address: string;
    crypto: {
        ciphertext: string;
        cipherparams: { iv: string };
        cipher: string;
        kdf: string;
        kdfparams: {
            dklen: number;
            salt: string;
            n: number;
            r: number;
            p: number;
        };
        mac: string;
    };
}

export interface Sign extends SignedTransaction {
    message: string;
    signature: string;
}

export interface SignatureObject {
    messageHash: string;
    r: string;
    s: string;
    v: string;
}
