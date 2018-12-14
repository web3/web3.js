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
 * @date 2018
 */

import * as net from 'net';
import {AbstractProviderAdapter, provider, BatchRequest} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions, Providers} from 'web3-core';
import {Contract} from 'web3-eth-contract';
import {Iban} from 'web3-eth-iban';
import {Accounts} from 'web3-eth-accounts';
import {AbiCoder} from 'web3-eth-abi';
import {Network} from 'web3-net';

export class Eth extends AbstractWeb3Module {
    constructor(
        provider: AbstractProviderAdapter | provider,
        options?: Web3ModuleOptions
    );
    Contract: Contract;
    Iban: Iban;
    personal: Personal; // change one personal types are written
    accounts: Accounts;
    ens: any; // change once ens types as written
    abi: AbiCoder;
    net: Network;
    clearSubscriptions(): boolean
    subscribe(type: 'logs', options?: Logs): Promise<Subscribe<Log>>;
    subscribe(type: 'logs', callback?: (error: Error, result: Subscribe<Log>) => void): Promise<Subscribe<Log>>
    subscribe(type: 'logs', options?: Logs, callback?: (error: Error, result: Subscribe<Log>) => void): Promise<Subscribe<Log>>;
    subscribe(type: 'syncing', callback?: (error: Error, result: Subscribe<any>) => void): Promise<Subscribe<any>>
    subscribe(type: 'newBlockHeaders', callback?: (error: Error, result: Subscribe<BlockHeader>) => void): Promise<Subscribe<BlockHeader>>
    subscribe(type: 'pendingTransactions', callback?: (error: Error, result: Subscribe<Transaction>) => void): Promise<Subscribe<Transaction>>
    setProvider(provider: AbstractProviderAdapter | provider, net?: net.Server): boolean;
    readonly providers: Providers;
    readonly givenProvider: provider | null;
    BatchRequest(): BatchRequest;
    getProtocolVersion(callback?: (error: Error, protocolVersion: string) => void): Promise<string>;
    isSyncing(callback?: (error: Error, syncing: Syncing) => void): Promise<Syncing | boolean>;
    getCoinbase(callback?: (error: Error, coinbaseAddress: string) => void): Promise<string>;
    isMining(callback?: (error: Error, mining: boolean) => void): Promise<boolean>;
    getHashrate(callback?: (error: Error, hashes: number) => void): Promise<number>;
    getGasPrice(callback?: (error: Error, gasPrice: string) => void): Promise<string>;
    getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]>;
    getBlockNumber(callback?: (error: Error, blockNumber: number) => void): Promise<number>;
    getBalance(address: string): Promise<string>;
    getBalance(address: string, defaultBlock: string | number): Promise<string>;
    getBalance(address: string, callback?: (error: Error, balance: string) => void): Promise<string>;
    getBalance(address: string, defaultBlock: string | number, callback?: (error: Error, balance: string) => void): Promise<string>;
    getStorageAt(address: string, position: number): Promise<string>;
    getStorageAt(address: string, position: number, defaultBlock: number | string): Promise<string>;
    getStorageAt(address: string, position: number, callback?: (error: Error, storageAt: string) => void): Promise<string>;
    getStorageAt(address: string, position: number, defaultBlock: number | string, callback?: (error: Error, storageAt: string) => void): Promise<string>;
    getCode(address: string): Promise<string>;
    getCode(address: string, defaultBlock: string | number): Promise<string>;
    getCode(address: string, callback?: (error: Error, code: string) => void): Promise<string>;
    getCode(address: string, defaultBlock: string | number, callback?: (error: Error, code: string) => void): Promise<string>;
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
    getTransactionCount(address: string, defaultBlock: number | string): Promise<number>;
    getTransactionCount(address: string, callback?: (error: Error, count: number) => void): Promise<number>;
    getTransactionCount(address: string, defaultBlock: number | string, callback?: (error: Error, count: number) => void): Promise<number>;
    sendTransaction(transaction: Transaction, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>;
    sendSignedTransaction(signedTransactionData: string, callback?: (error: Error, gas: string) => void): PromiEvent<TransactionReceipt>
    sign(dataToSign: string, address: string | number, callback?: (error: Error, signature: string) => void): Promise<string>;
    signTransaction(transaction: Transaction, callback?: (error: Error, signedTransaction: SignedTransaction) => void): Promise<SignedTransaction>;
    signTransaction(transaction: Transaction, address: string): Promise<SignedTransaction>;
    signTransaction(transaction: Transaction, address: string, callback: (error: Error, signedTransaction: SignedTransaction) => void): Promise<SignedTransaction>;
    call(transaction: Transaction): Promise<string>;
    call(transaction: Transaction, defaultBlock?: number | string): Promise<string>;
    call(transaction: Transaction, callback?: (error: Error, data: string) => void): Promise<string>;
    call(transaction: Transaction, defaultBlock: number | string, callback: (error: Error, data: string) => void): Promise<string>;
    estimateGas(transaction: Transaction, callback?: (error: Error, gas: number) => void): Promise<number>;
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
    address: string | string[];
    topics?: Array<string | string[]>;
}

export interface Logs {
    fromBlock?: number
    address?: string
    topics?: Array<string | string[]>
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

export interface Subscribe<T> {
    subscription: {
        id: string
        subscribe(callback?: (error: Error, result: Subscribe<T>) => void): Subscribe<T>
        unsubscribe(callback?: (error: Error, result: boolean) => void): void | boolean
        options: {}
    }
    on(type: 'data', handler: (data: T) => void): void
    on(type: 'changed', handler: (data: T) => void): void
    on(type: 'error', handler: (data: Error) => void): void
}

/** DELETE ONCE personal is complete */

export class Personal {
    newAccount(password: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>
    getAccounts(callback?: (error: Error, result: string[]) => void): Promise<string[]>
}
/** END */

/**            MOVE ALL BELOW TO WEB3-CORE ONCE TYPES COMPLETE FOR CLEAR UP    !!! */

export interface PromiEvent<T> extends Promise<T> {
    once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>
    once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>
    once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>
    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>
    once(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>
    on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>
    on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>
    on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>
    on(type: 'error', handler: (error: Error) => void): PromiEvent<T>
    on(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>
}

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

export interface SignedTransaction {
    messageHash?: string;
    r: string;
    s: string;
    v: string;
    rawTransaction?: string;
}

export interface TransactionReceipt {
    transactionHash: string
    transactionIndex: number
    blockHash: string
    blockNumber: number
    from: string
    to: string
    contractAddress: string
    cumulativeGasUsed: number
    gasUsed: number
    logs?: Log[]
    events?: {
        [eventName: string]: EventLog
    }
}

export interface EventLog {
    event: string
    address: string
    returnValues: object
    logIndex: number
    transactionIndex: number
    transactionHash: string
    blockHash: string
    blockNumber: number
    raw?: { data: string, topics: any[] }
}
/**    END      !!! */
