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

import {provider} from 'conflux-web-providers';
import {
    AbstractConfluxWebModule,
    Log,
    PromiEvent,
    RLPEncodedTransaction,
    Transaction,
    TransactionConfig,
    TransactionReceipt,
    ConfluxWebModuleOptions
} from 'conflux-web-core';
import {Contract, ContractOptions} from 'conflux-web-cfx-contract';
import {Accounts} from 'conflux-web-cfx-accounts';
import {AbiCoder} from 'conflux-web-cfx-abi';
import {Network} from 'conflux-web-net';
import {AbiItem} from 'conflux-web-utils';
import * as net from 'net';

export class Cfx extends AbstractConfluxWebModule {
    constructor(
        provider: provider,
        net?: net.Socket | null,
        options?: ConfluxWebModuleOptions
    );

    Contract: new (jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions) => Contract;
    accounts: Accounts;
    abi: AbiCoder;
    net: Network;

    clearSubscriptions(): Promise<boolean>;

    subscribe(type: 'logs', options?: LogsOptions, callback?: (error: Error, log: Log) => void): Subscription<Log>;
    subscribe(type: 'syncing', options?: null, callback?: (error: Error, result: Syncing) => void): Subscription<Syncing>;
    subscribe(type: 'newBlockHeaders', options?: null, callback?: (error: Error, blockHeader: BlockHeader) => void): Subscription<BlockHeader>;
    subscribe(type: 'pendingTransactions', options?: null, callback?: (error: Error, transactionHash: string) => void): Subscription<string>;
    subscribe(
        type: 'pendingTransactions' | 'logs' | 'syncing' | 'newBlockHeaders',
        options?: null | LogsOptions,
        callback?: (error: Error, item: Log | Syncing | BlockHeader | string) => void
    ): Subscription<Log | BlockHeader | Syncing | string>;

    getProtocolVersion(callback?: (error: Error, protocolVersion: string) => void): Promise<string>;

    isSyncing(callback?: (error: Error, syncing: Syncing) => void): Promise<Syncing | boolean>;

    getCoinbase(callback?: (error: Error, coinbaseAddress: string) => void): Promise<string>;

    isMining(callback?: (error: Error, mining: boolean) => void): Promise<boolean>;

    getHashrate(callback?: (error: Error, hashes: number) => void): Promise<number>;

    getGasPrice(callback?: (error: Error, gasPrice: string) => void): Promise<string>;

    getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]>;

    getBlockNumber(callback?: (error: Error, blockNumber: number) => void): Promise<number>;

    getBalance(address: string): Promise<string>;
    getBalance(address: string, defaultEpoch: string | number): Promise<string>;
    getBalance(address: string, callback?: (error: Error, balance: string) => void): Promise<string>;
    getBalance(address: string, defaultEpoch: string | number, callback?: (error: Error, balance: string) => void): Promise<string>;

    getStorageAt(address: string, position: number): Promise<string>;
    getStorageAt(address: string, position: number, defaultEpoch: number | string): Promise<string>;
    getStorageAt(address: string, position: number, callback?: (error: Error, storageAt: string) => void): Promise<string>;
    getStorageAt(address: string, position: number, defaultEpoch: number | string, callback?: (error: Error, storageAt: string) => void): Promise<string>;

    getCode(address: string): Promise<string>;
    getCode(address: string, defaultEpoch: string | number): Promise<string>;
    getCode(address: string, callback?: (error: Error, code: string) => void): Promise<string>;
    getCode(address: string, defaultEpoch: string | number, callback?: (error: Error, code: string) => void): Promise<string>;

    getBlock(blockHashOrBlockNumber: string | number): Promise<Block>;
    getBlock(blockHashOrBlockNumber: string | number, returnTransactionObjects: boolean): Promise<Block>;
    getBlock(blockHashOrBlockNumber: string | number, callback?: (error: Error, block: Block) => void): Promise<Block>;
    getBlock(blockHashOrBlockNumber: string | number, returnTransactionObjects: boolean, callback?: (error: Error, block: Block) => void): Promise<Block>;

    getBlockTransactionCount(blockHashOrBlockNumber: string | number, callback?: (error: Error, numberOfTransactions: number) => void): Promise<number>;

    getUncle(blockHashOrBlockNumber: string | number, uncleIndex: number): Promise<Block>
    getUncle(blockHashOrBlockNumber: string | number, uncleIndex: number, returnTransactionObjects: boolean): Promise<Block>
    getUncle(blockHashOrBlockNumber: string | number, uncleIndex: number, callback?: (error: Error, uncle: {}) => void): Promise<Block>
    getUncle(blockHashOrBlockNumber: string | number, uncleIndex: number, returnTransactionObjects: boolean, callback?: (error: Error, uncle: {}) => void): Promise<Block>

    getTransaction(transactionHash: string, callback?: (error: Error, transaction: Transaction) => void): Promise<Transaction>;

    getTransactionFromBlock(hashStringOrNumber: string | number, indexNumber: number, callback?: (error: Error, transaction: Transaction) => void): Promise<Transaction>;

    getTransactionReceipt(hash: string, callback?: (error: Error, transactionReceipt: TransactionReceipt) => void): Promise<TransactionReceipt>;

    getTransactionCount(address: string): Promise<number>;
    getTransactionCount(address: string, defaultEpoch: number | string): Promise<number>;
    getTransactionCount(address: string, callback?: (error: Error, count: number) => void): Promise<number>;
    getTransactionCount(address: string, defaultEpoch: number | string, callback?: (error: Error, count: number) => void): Promise<number>;

    sendTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>;

    sendSignedTransaction(signedTransactionData: string, callback?: (error: Error, gas: string) => void): PromiEvent<TransactionReceipt>

    sign(dataToSign: string, address: string | number, callback?: (error: Error, signature: string) => void): Promise<string>;

    signTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>;
    signTransaction(transactionConfig: TransactionConfig, address: string): Promise<RLPEncodedTransaction>;
    signTransaction(transactionConfig: TransactionConfig, address: string, callback: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>;

    call(transactionConfig: TransactionConfig): Promise<string>;
    call(transactionConfig: TransactionConfig, defaultEpoch?: number | string): Promise<string>;
    call(transactionConfig: TransactionConfig, callback?: (error: Error, data: string) => void): Promise<string>;
    call(transactionConfig: TransactionConfig, defaultEpoch: number | string, callback: (error: Error, data: string) => void): Promise<string>;

    estimateGas(transactionConfig: TransactionConfig, callback?: (error: Error, gas: number) => void): Promise<number>;

    getPastLogs(options: PastLogsOptions, callback?: (error: Error, logs: Log[]) => void): Promise<Log[]>;

    getWork(callback?: (error: Error, result: string[]) => void): Promise<string[]>;

    submitWork(data: [string, string, string], callback?: (error: Error, result: boolean) => void): Promise<boolean>;
}

export interface Methods {
    property?: string;
    methods: Method[];
}

export interface Method {
    name: string;
    call: string;
    params?: number;
    inputFormatter?: Array<(() => void) | null>;
    outputFormatter?: () => void;
}

export interface Syncing {
    startingBlock: number;
    currentBlock: number;
    highestBlock: number;
    knownStates: number;
    pulledStates: number;
}

export interface BlockHeader {
    number: number
    hash: string
    parentHash: string
    nonce: string
    sha3Uncles: string
    logsBloom: string
    transactionRoot: string
    stateRoot: string
    receiptRoot: string
    miner: string
    extraData: string
    gasLimit: number
    gasUsed: number
    timestamp: number
}

export interface Block extends BlockHeader {
    transactions: Transaction[];
    size: number
    difficulty: number
    totalDifficulty: number
    uncles: string[];
}

export interface PastLogsOptions {
    fromBlock?: number | string;
    toBlock?: number | string;
    address?: string | string[];
    topics?: Array<string | string[]>;
}

export interface LogsOptions {
    fromBlock?: number | string;
    address?: string | string[];
    topics?: Array<string | string[]>
}

export interface Subscription<T> {
    id: string;
    options: {};

    subscribe(callback?: (error: Error, result: T) => void): Subscription<T>;

    unsubscribe(callback?: (error: Error, result: boolean) => void): Promise<undefined | boolean>;

    on(type: 'data', handler: (data: T) => void): void

    on(type: 'changed', handler: (data: T) => void): void

    on(type: 'error', handler: (data: Error) => void): void
}
