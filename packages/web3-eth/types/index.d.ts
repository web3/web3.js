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

import * as net from 'net';
import {
    BatchRequest,
    Extension,
    Log,
    PromiEvent,
    provider,
    Providers,
    RLPEncodedTransaction,
    Transaction,
    TransactionConfig,
    TransactionReceipt,
    Common,
    hardfork,
    chain,
    BlockNumber,
    LogsOptions,
    PastLogsOptions
} from 'web3-core';
import {Subscription} from 'web3-core-subscriptions';
import {AbiCoder} from 'web3-eth-abi';
import {Accounts} from 'web3-eth-accounts';
import {Contract, ContractOptions} from 'web3-eth-contract';
import {Ens} from 'web3-eth-ens';
import {Iban} from 'web3-eth-iban';
import {Personal} from 'web3-eth-personal';
import {Network} from 'web3-net';
import {AbiItem} from 'web3-utils';
import {BigNumber} from 'bignumber.js';
import BN = require('bn.js');

export {
    TransactionConfig,
    RLPEncodedTransaction,
    Transaction,
    TransactionReceipt,
    hardfork,
    Common,
    chain
} from 'web3-core';

export class Eth {
    constructor();
    constructor(provider: provider);
    constructor(provider: provider, net: net.Socket);

    Contract: new (
        jsonInterface: AbiItem[] | AbiItem,
        address?: string,
        options?: ContractOptions
    ) => Contract;
    Iban: new (iban: string) => Iban;
    personal: Personal;
    accounts: Accounts;
    ens: Ens;
    abi: AbiCoder;
    net: Network;

    readonly givenProvider: any;
    static readonly givenProvider: any;
    defaultAccount: string | null;
    defaultBlock: BlockNumber;
    defaultCommon: Common;
    defaultHardfork: hardfork;
    defaultChain: chain;
    transactionPollingTimeout: number;
    transactionConfirmationBlocks: number;
    transactionBlockTimeout: number;
    handleRevert: boolean;
    readonly currentProvider: provider;

    setProvider(provider: provider): boolean;

    BatchRequest: new () => BatchRequest;
    static readonly providers: Providers;

    extend(extension: Extension): any;

    clearSubscriptions(callback: (error: Error, result: boolean) => void): void;

    subscribe(
        type: 'logs',
        options: LogsOptions,
        callback?: (error: Error, log: Log) => void
    ): Subscription<Log>;
    subscribe(
        type: 'syncing',
        callback?: (error: Error, result: Syncing) => void
    ): Subscription<Syncing>;
    subscribe(
        type: 'newBlockHeaders',
        callback?: (error: Error, blockHeader: BlockHeader) => void
    ): Subscription<BlockHeader>;
    subscribe(
        type: 'pendingTransactions',
        callback?: (error: Error, transactionHash: string) => void
    ): Subscription<string>;

    getProtocolVersion(
        callback?: (error: Error, protocolVersion: string) => void
    ): Promise<string>;

    isSyncing(
        callback?: (error: Error, syncing: Syncing) => void
    ): Promise<Syncing | boolean>;

    getCoinbase(
        callback?: (error: Error, coinbaseAddress: string) => void
    ): Promise<string>;

    isMining(
        callback?: (error: Error, mining: boolean) => void
    ): Promise<boolean>;

    getHashrate(
        callback?: (error: Error, hashes: number) => void
    ): Promise<number>;

    getNodeInfo(
        callback?: (error: Error, version: string) => void
    ): Promise<string>;

    getChainId(
        callback?: (error: Error, version: number) => void
    ): Promise<number>;

    getGasPrice(
        callback?: (error: Error, gasPrice: string) => void
    ): Promise<string>;

    getFeeHistory(
        blockCount: number | BigNumber | BN | string,
        lastBlock: number | BigNumber | BN | string,
        rewardPercentiles: number[],
        callback?: (error: Error, feeHistory: FeeHistoryResult) => void
    ): Promise<FeeHistoryResult>;

    getAccounts(
        callback?: (error: Error, accounts: string[]) => void
    ): Promise<string[]>;

    getBlockNumber(
        callback?: (error: Error, blockNumber: number) => void
    ): Promise<number>;

    getBalance(
        address: string
    ): Promise<string>;
    getBalance(
        address: string,
        defaultBlock: BlockNumber): Promise<string>;
    getBalance(
        address: string,
        callback?: (error: Error, balance: string) => void
    ): Promise<string>;
    getBalance(
        address: string,
        defaultBlock: BlockNumber,
        callback?: (error: Error, balance: string) => void
    ): Promise<string>;

    getStorageAt(address: string, position: number | BigNumber | BN | string): Promise<string>;
    getStorageAt(
        address: string,
        position: number | BigNumber | BN | string,
        defaultBlock: BlockNumber
    ): Promise<string>;
    getStorageAt(
        address: string,
        position: number | BigNumber | BN | string,
        callback?: (error: Error, storageAt: string) => void
    ): Promise<string>;
    getStorageAt(
        address: string,
        position: number | BigNumber | BN | string,
        defaultBlock: BlockNumber,
        callback?: (error: Error, storageAt: string) => void
    ): Promise<string>;

    getCode(
        address: string
    ): Promise<string>;
    getCode(
        address: string,
        defaultBlock: BlockNumber
    ): Promise<string>;
    getCode(
        address: string,
        callback?: (error: Error, code: string) => void
    ): Promise<string>;
    getCode(
        address: string,
        defaultBlock: BlockNumber,
        callback?: (error: Error, code: string) => void
    ): Promise<string>;

    getBlock(blockHashOrBlockNumber: BlockNumber | string): Promise<BlockTransactionString>;
    getBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        returnTransactionObjects: false
    ): Promise<BlockTransactionString>;
    getBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        returnTransactionObjects: true
    ): Promise<BlockTransactionObject>;
    getBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        callback?: (error: Error, block: BlockTransactionString) => void
    ): Promise<BlockTransactionString>;
    getBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        returnTransactionObjects: false,
        callback?: (error: Error, block: BlockTransactionString) => void
    ): Promise<BlockTransactionString>;
    getBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        returnTransactionObjects: true,
        callback?: (error: Error, block: BlockTransactionObject) => void
    ): Promise<BlockTransactionObject>;

    getBlockTransactionCount(
        blockHashOrBlockNumber: BlockNumber | string,
        callback?: (error: Error, numberOfTransactions: number) => void
    ): Promise<number>;

    getBlockUncleCount(
        blockHashOrBlockNumber: BlockNumber | string,
        callback?: (error: Error, numberOfTransactions: number) => void
    ): Promise<number>;

    getUncle(
        blockHashOrBlockNumber: BlockNumber | string,
        uncleIndex: number | string | BN
    ): Promise<BlockTransactionString>;
    getUncle(
        blockHashOrBlockNumber: BlockNumber | string,
        uncleIndex: number | string | BN,
        returnTransactionObjects: boolean
    ): Promise<BlockTransactionObject>;
    getUncle(
        blockHashOrBlockNumber: BlockNumber | string,
        uncleIndex: number | string | BN,
        callback?: (error: Error, uncle: any) => void
    ): Promise<BlockTransactionString>;
    getUncle(
        blockHashOrBlockNumber: BlockNumber | string,
        uncleIndex: number | string | BN,
        returnTransactionObjects: boolean,
        callback?: (error: Error, uncle: any) => void
    ): Promise<BlockTransactionObject>;

    getTransaction(
        transactionHash: string,
        callback?: (error: Error, transaction: Transaction) => void
    ): Promise<Transaction>;

    getPendingTransactions(
        callback?: (error: Error, result: Transaction[]) => void
    ): Promise<Transaction[]>;

    getTransactionFromBlock(
        blockHashOrBlockNumber: BlockNumber | string,
        indexNumber: number | string | BN,
        callback?: (error: Error, transaction: Transaction) => void
    ): Promise<Transaction>;

    getTransactionReceipt(
        hash: string,
        callback?: (
            error: Error,
            transactionReceipt: TransactionReceipt
        ) => void
    ): Promise<TransactionReceipt>;

    getTransactionCount(address: string): Promise<number>;
    getTransactionCount(
        address: string,
        defaultBlock: BlockNumber
    ): Promise<number>;
    getTransactionCount(
        address: string,
        callback?: (error: Error, count: number) => void
    ): Promise<number>;
    getTransactionCount(
        address: string,
        defaultBlock: BlockNumber,
        callback?: (error: Error, count: number) => void
    ): Promise<number>;

    sendTransaction(
        transactionConfig: TransactionConfig,
        callback?: (error: Error, hash: string) => void
    ): PromiEvent<TransactionReceipt>;

    sendSignedTransaction(
        signedTransactionData: string,
        callback?: (error: Error, hash: string) => void
    ): PromiEvent<TransactionReceipt>;

    sign(
        dataToSign: string,
        address: string | number,
        callback?: (error: Error, signature: string) => void
    ): Promise<string>;

    signTransaction(
        transactionConfig: TransactionConfig,
        callback?: (
            error: Error,
            signedTransaction: RLPEncodedTransaction
        ) => void
    ): Promise<RLPEncodedTransaction>;
    signTransaction(
        transactionConfig: TransactionConfig,
        address: string
    ): Promise<RLPEncodedTransaction>;
    signTransaction(
        transactionConfig: TransactionConfig,
        address: string,
        callback: (
            error: Error,
            signedTransaction: RLPEncodedTransaction
        ) => void
    ): Promise<RLPEncodedTransaction>;

    call(transactionConfig: TransactionConfig): Promise<string>;
    call(
        transactionConfig: TransactionConfig,
        defaultBlock?: BlockNumber
    ): Promise<string>;
    call(
        transactionConfig: TransactionConfig,
        callback?: (error: Error, data: string) => void
    ): Promise<string>;
    call(
        transactionConfig: TransactionConfig,
        defaultBlock: BlockNumber,
        callback: (error: Error, data: string) => void
    ): Promise<string>;

    estimateGas(
        transactionConfig: TransactionConfig,
        callback?: (error: Error, gas: number) => void
    ): Promise<number>;

    createAccessList(
        transactionConfig: TransactionConfig,
        callback?: (error: Error, result: CreateAccessList) => void
    ): Promise<CreateAccessList>;

    createAccessList(
        transactionConfig: TransactionConfig,
        defaultBlock: BlockNumber,
        callback?: (error: Error, result: CreateAccessList) => void
    ): Promise<CreateAccessList>;

    getPastLogs(
        options: PastLogsOptions,
        callback?: (error: Error, logs: Log[]) => void
    ): Promise<Log[]>;

    getWork(
        callback?: (error: Error, result: string[]) => void
    ): Promise<string[]>;

    submitWork(
        data: [string, string, string],
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    getProof(
        address: string,
        storageKey: number[] | BigNumber[] | BN[] | string[],
        blockNumber: BlockNumber,
        callback?: (error: Error, result: GetProof) => void
    ): Promise<GetProof>;

    getProof(
        address: string,
        storageKey: number[] | BigNumber[] | BN[] | string[],
        blockNumber: BlockNumber,
    ): Promise<GetProof>;

    requestAccounts(): Promise<string[]>
    requestAccounts(callback: (error: Error, result: string[]) => void): Promise<string[]>
}

export interface Syncing {
    StartingBlock: number;
    CurrentBlock: number;
    HighestBlock: number;
    KnownStates: number;
    PulledStates: number;
}

export interface BlockHeader {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number | string;
    baseFeePerGas?: number;
}

// TODO: This interface does exist to provide backwards-compatibility and can get removed on a minor release
export interface Block extends BlockTransactionBase {
    transactions: Transaction[] | string[];
}

export interface BlockTransactionBase extends BlockHeader {
    size: number;
    difficulty: number;
    totalDifficulty: number;
    uncles: string[];
}

export interface BlockTransactionObject extends BlockTransactionBase {
    transactions: Transaction[];
}

export interface BlockTransactionString extends BlockTransactionBase {
    transactions: string[];
}

export interface AccessTuple {
    address: string;
    storageKeys: string[];
}

export interface CreateAccessList {
    accessList: AccessTuple[];
    error?: string;
    gasUsed: string;
}

export interface GetProof {
    address: string;
    balance: string;
    codeHash: string;
    nonce: string;
    storageHash: string;
    accountProof: string[];
    storageProof: StorageProof[];
}

export interface StorageProof {
    key: string;
    value: string;
    proof: string[];
}

export interface FeeHistoryResult {
    baseFeePerGas: string[];
    gasUsedRatio: number[];
    oldestBlock: number;
    reward: string[][];
}
