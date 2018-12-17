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
 * @author Huan Zhang <huanzhang30@gmail.com>
 * @date 2018
 */

import * as net from 'net';
import {AbstractProviderAdapter, provider, BatchRequest} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions, Providers} from 'web3-core';
export class Personal extends AbstractWeb3Module {
    constructor(
        provider: AbstractProviderAdapter | provider,
        options?: Web3ModuleOptions
    );
    setProvider(provider: AbstractProviderAdapter | provider, net?: net.Server): boolean;
    givenProvider: AbstractProviderAdapter | null;
    BatchRequest: new() => BatchRequest;
    providers: Providers;
    newAccount(password: string, callback?: (error: Error, address: string) => void): Promise<string>;
    sign(dataToSign: string, address: string, password: string, callback?: (error: Error, signature: string) => void): Promise<string>;
    ecRecover(dataThatWasSigned: string, signature: string, callback?: (error: Error, address: string) => void): Promise<string>;
    signTransaction(transation: Transaction, password: string, callback?: (error: Error, RLPEncodedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>;
    unlockAccount(address: string, password: string, unlockDuration: number, callback?: (error: Error) => void): Promise<boolean>;
}

// Josh to move to web3-core
export interface Transaction {
    from?: string | number;
    to?: string;
    gasPrice?: string;
    gas?: number | string;
    value?: number | string;
    chainId?: number;
    data?: string;
    nonce?: number;
    v?: string;
    r?: string;
    s?: string;
    hash?: string;
}

export interface RLPEncodedTransaction {
    raw: string,
    tx: Transaction
}
