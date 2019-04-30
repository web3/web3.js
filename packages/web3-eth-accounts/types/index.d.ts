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

import {AbstractWeb3Module, SignedTransaction, TransactionConfig, Web3ModuleOptions} from 'web3-core';
import {provider} from 'web3-providers';
import * as net from 'net';

export class Accounts extends AbstractWeb3Module {
    constructor(provider: provider, net?: net.Socket | null, options?: Web3ModuleOptions);

    create(entropy?: string): Account;

    privateKeyToAccount(privateKey: string): Account;

    signTransaction(transactionConfig: TransactionConfig, privateKey: string, callback?: () => void): Promise<SignedTransaction>;

    recoverTransaction(signature: string): string;

    hashMessage(message: string): string;

    sign(data: string, privateKey: string): Sign;

    recover(signatureObject: SignatureObject): string;
    recover(message: string, signature: string, preFixed?: boolean): string;
    recover(message: string, v: string, r: string, s: string, preFixed?: boolean): string;

    encrypt(privateKey: string, password: string): EncryptedKeystoreV3Json;

    decrypt(keystoreJsonV3: EncryptedKeystoreV3Json, password: string): Account;

    wallet: Wallet;
}

export class Wallet {
    constructor(accounts: Accounts);

    accountsIndex: number;
    length: number;
    defaultKeyName: string;

    [key: number]: Account;

    create(numberOfAccounts: number, entropy?: string): Wallet;

    add(account: string | AddAccount): AddedAccount;

    remove(account: string | number): boolean;

    clear(): Wallet;

    encrypt(password: string): EncryptedKeystoreV3Json[];

    decrypt(keystoreArray: EncryptedKeystoreV3Json[], password: string): Wallet;

    save(password: string, keyName?: string): boolean;

    load(password: string, keyName?: string): Wallet;
}

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
        cipherparams: {iv: string};
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
