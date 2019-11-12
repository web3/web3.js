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
 * @author Huan Zhang <huanzhang30@gmail.com>,
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import * as net from 'net';
import { provider, RLPEncodedTransaction, TransactionConfig, BatchRequest, Providers, Extension } from 'web3-core';

export class Personal {
    constructor(provider?: provider, net?: net.Socket);

    readonly givenProvider: any;
    static readonly givenProvider: any;
    static readonly providers: Providers;
    readonly currentProvider: provider;
    defaultAccount: string | null;
    defaultBlock: string | number;
    BatchRequest: new () => BatchRequest;

    setProvider(provider: provider): boolean;

    extend(extension: Extension): any;

    newAccount(
        password: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    sign(
        dataToSign: string,
        address: string,
        password: string,
        callback?: (error: Error, signature: string) => void
    ): Promise<string>;

    ecRecover(
        dataThatWasSigned: string,
        signature: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    signTransaction(
        transactionConfig: TransactionConfig,
        password: string,
        callback?: (
            error: Error,
            RLPEncodedTransaction: RLPEncodedTransaction
        ) => void
    ): Promise<RLPEncodedTransaction>;

    sendTransaction(
        transactionConfig: TransactionConfig,
        password: string,
        callback?: (error: Error, transactionHash: string) => void
    ): Promise<string>;

    unlockAccount(
        address: string,
        password: string,
        unlockDuration: number,
        callback?: (error: Error) => void
    ): Promise<boolean>;

    lockAccount(
        address: string,
        callback?: (error: Error, success: boolean) => void
    ): Promise<boolean>;

    getAccounts(
        callback?: (error: Error, accounts: string[]) => void
    ): Promise<string[]>;

    importRawKey(
        privateKey: string,
        password: string,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;
}
