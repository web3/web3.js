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
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

import {provider} from 'web3-providers';
import {
    AbstractWeb3Module,
    Log,
    PromiEvent,
    RLPEncodedTransaction,
    Transaction,
    TransactionConfig,
    TransactionReceipt,
    Web3ModuleOptions,
    TransactionSigner
} from 'web3-core';
import {Contract, ContractOptions} from 'web3-eth-contract';
import {Iban} from 'web3-eth-iban';
import {Accounts} from 'web3-eth-accounts';
import {AbiCoder} from 'web3-eth-abi';
import {Network} from 'web3-net';
import {Personal} from 'web3-eth-personal';
import {AbiItem} from 'web3-utils';
import {Ens} from 'web3-eth-ens';
import * as net from 'net';

export class Eth extends AbstractWeb3Module {
    constructor(
        provider: provider,
        net?: net.Socket | null,
        options?: Web3ModuleOptions
    );

    Contract: new (jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions) => Contract;
    Iban: new(iban: string) => Iban;
    personal: Personal;
    accounts: Accounts;
    ens: Ens;
    abi: AbiCoder;
    net: Network;
    transactionSigner: TransactionSigner;

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

    getPendingTransactions(callback?: (error: Error, result: Transaction[]) => void): Promise<Transaction[]>;

    getTransactionFromBlock(hashStringOrNumber: string | number, indexNumber: number, callback?: (error: Error, transaction: Transaction) => void): Promise<Transaction>;

    getTransactionReceipt(hash: string, callback?: (error: Error, transactionReceipt: TransactionReceipt) => void): Promise<TransactionReceipt>;

    getTransactionCount(address: string): Promise<number>;
    getTransactionCount(address: string, defaultBlock: number | string): Promise<number>;
    getTransactionCount(address: string, callback?: (error: Error, count: number) => void): Promise<number>;
    getTransactionCount(address: string, defaultBlock: number | string, callback?: (error: Error, count: number) => void): Promise<number>;

    sendTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>;

    sendSignedTransaction(signedTransactionData: string, callback?: (error: Error, hash: string) => void): PromiEvent<TransactionReceipt>

    sign(dataToSign: string, address: string | number, callback?: (error: Error, signature: string) => void): Promise<string>;

    signTransaction(transactionConfig: TransactionConfig, callback?: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>;
    signTransaction(transactionConfig: TransactionConfig, address: string): Promise<RLPEncodedTransaction>;
    signTransaction(transactionConfig: TransactionConfig, address: string, callback: (error: Error, signedTransaction: RLPEncodedTransaction) => void): Promise<RLPEncodedTransaction>;

    call(transactionConfig: TransactionConfig): Promise<string>;
    call(transactionConfig: TransactionConfig, defaultBlock?: number | string): Promise<string>;
    call(transactionConfig: TransactionConfig, callback?: (error: Error, data: string) => void): Promise<string>;
    call(transactionConfig: TransactionConfig, defaultBlock: number | string, callback: (error: Error, data: string) => void): Promise<string>;

    estimateGas(transactionConfig: TransactionConfig, callback?: (error: Error, gas: number) => void): Promise<number>;

    getPastLogs(options: PastLogsOptions, callback?: (error: Error, logs: Log[]) => void): Promise<Log[]>;

    getWork(callback?: (error: Error, result: string[]) => void): Promise<string[]>;

    submitWork(data: [string, string, string], callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    getProof(address: string, storageKey: string[], blockNumber: number | string | "latest" | "earliest", callback?: (error: Error, result: GetProof) => void): Promise<GetProof>;
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
    StartingBlock: number;
    CurrentBlock: number;
    HighestBlock: number;
    KnownStates: number;
    PulledStates: number;
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
    timestamp: number | string
}

export interface Block extends BlockHeader {
    transactions: Transaction[] | string[];
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
    topics?: Array<string | string[] | null>
}

export interface Subscription<T> {
    id: string;
    options: {};

    subscribe(callback?: (error: Error, result: T) => void): Subscription<T>;

    unsubscribe(callback?: (error: Error, result: boolean) => void): Promise<undefined | boolean>;

    on(type: 'data', handler: (data: T) => void): Subscription<T>

    on(type: 'changed', handler: (data: T) => void): Subscription<T>

    on(type: 'error', handler: (data: Error) => void): Subscription<T>
}

export interface GetProof {
    jsonrpc: string;
    id: number;
    result: {
      address: string;
      accountProof: string[];
      balance: string;
      codeHash: string;
      nonce: string;
      storageHash: string;
      storageProof: StorageProof[];
    };
}

export interface StorageProof {
    key: string;
    value: string;
    proof: string[];
}
