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
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

import * as net from 'net';
import BN = require('bn.js');
import {AbstractMethodFactory} from 'web3-core-method';
import {
    BatchRequest,
    Web3EthereumProvider,
    HttpProvider,
    HttpProviderOptions,
    IpcProvider,
    provider,
    WebsocketProvider,
    CustomProvider,
    WebsocketProviderOptions
} from 'web3-providers';

export class AbstractWeb3Module {
    constructor(
        provider: provider,
        options?: Web3ModuleOptions,
        methodFactory?: AbstractMethodFactory,
        net?: net.Socket | null
    );

    BatchRequest: new () => BatchRequest;
    defaultBlock: string | number;
    transactionBlockTimeout: number;
    transactionConfirmationBlocks: number;
    transactionPollingTimeout: number;
    defaultGasPrice: string;
    defaultGas: number;
    defaultChainId: number;
    static readonly providers: Providers;
    defaultAccount: string | null;
    readonly currentProvider: Web3EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider | CustomProvider;
    readonly givenProvider: any;

    setProvider(provider: provider, net?: net.Socket): boolean;

    isSameProvider(provider: provider): boolean;

    clearSubscriptions(subscriptionType: string): Promise<boolean>;
}

export interface TransactionSigner {
    sign(transactionConfig: TransactionConfig): Promise<SignedTransaction>;
}

export interface SignedTransaction {
    messageHash?: string;
    r: string;
    s: string;
    v: string;
    rawTransaction?: string;
    transactionHash?: string;
}

export interface Web3ModuleOptions {
    defaultAccount?: string;
    defaultBlock?: string | number;
    transactionBlockTimeout?: number;
    transactionConfirmationBlocks?: number;
    transactionPollingTimeout?: number;
    defaultGasPrice?: string;
    defaultGas?: number;
    transactionSigner?: TransactionSigner;
    defaultChainId?: number;
}

export interface Providers {
    HttpProvider: new (host: string, options?: HttpProviderOptions) => HttpProvider;
    WebsocketProvider: new (host: string, options?: WebsocketProviderOptions) => WebsocketProvider;
    IpcProvider: new (path: string, net: any) => IpcProvider;
}

export interface PromiEvent<T> extends Promise<T> {
    once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;

    once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;

    once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;

    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    once(
        type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
        handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;

    on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;

    on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;

    on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;

    on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    on(
        type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
        handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
}

export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gas: number;
    input: string;
}

export interface TransactionConfig {
    from?: string | number;
    to?: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
}

export interface RLPEncodedTransaction {
    raw: string;
    tx: {
        nonce: string;
        gasPrice: string;
        gas: string;
        to: string;
        value: string;
        input: string;
        r: string;
        s: string;
        v: string;
        hash: string;
    }
}

export interface TransactionReceipt {
    status: boolean;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress?: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs: Log[];
    logsBloom: string;
    events?: {
        [eventName: string]: EventLog;
    };
}

export interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: {data: string; topics: any[]};
}

export interface Log {
    address: string;
    data: string;
    topics: Array<string | string[]>;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
}

export interface Content {
    pending: any;
    queued: any;
}

export interface NodeInfo {
    enode: string;
    id: string;
    ip: string;
    listenAddr: string;
    name: string;
    ports: {
      discovery: string | number;
      listener: string | number;
    };
    protocols: {
      eth: {
        difficulty: string | number;
        genesis: string;
        head: string;
        network: string | number;
      };
    };
}
