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
import {
    HttpProviderBase,
    HttpProviderOptions,
    IpcProviderBase,
    WebsocketProviderBase,
    WebsocketProviderOptions,
    JsonRpcPayload,
    JsonRpcResponse
} from 'web3-core-helpers';
import { Method } from 'web3-core-method';
import BN = require('bn.js');
import BigNumber from 'bignumber.js';

export interface SignedTransaction {
    messageHash?: string;
    r: string;
    s: string;
    v: string;
    rawTransaction?: string;
    transactionHash?: string;
}

export interface Extension {
    property?: string,
    methods: Method[]
}

export interface Providers {
    HttpProvider: new (
        host: string,
        options?: HttpProviderOptions
    ) => HttpProvider;
    WebsocketProvider: new (
        host: string,
        options?: WebsocketProviderOptions
    ) => WebsocketProvider;
    IpcProvider: new (path: string, net: any) => IpcProvider;
}

export interface PromiEvent<T> extends Promise<T> {
    once(
        type: 'sending',
        handler: (payload: object) => void
    ): PromiEvent<T>;

    once(
        type: 'sent',
        handler: (payload: object) => void
    ): PromiEvent<T>;

    once(
        type: 'transactionHash',
        handler: (transactionHash: string) => void
    ): PromiEvent<T>;

    once(
        type: 'receipt',
        handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;

    once(
        type: 'confirmation',
        handler: (confirmationNumber: number, receipt: TransactionReceipt, latestBlockHash?: string) => void
    ): PromiEvent<T>;

    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    once(
        type: 'error' | 'confirmation' | 'receipt' | 'transactionHash' | 'sent' | 'sending',
        handler: (error: Error | TransactionReceipt | string | object) => void
    ): PromiEvent<T>;

    on(
        type: 'sending',
        handler: (payload: object) => void
    ): PromiEvent<T>;

    on(
        type: 'sent',
        handler: (payload: object) => void
    ): PromiEvent<T>;

    on(
        type: 'transactionHash',
        handler: (receipt: string) => void
    ): PromiEvent<T>;

    on(
        type: 'receipt',
        handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;

    on(
        type: 'confirmation',
        handler: (confNumber: number, receipt: TransactionReceipt, latestBlockHash?: string) => void
    ): PromiEvent<T>;

    on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    on(
        type: 'error' | 'confirmation' | 'receipt' | 'transactionHash' | 'sent' | 'sending',
        handler: (error: Error | TransactionReceipt | string | object) => void
    ): PromiEvent<T>;
}

export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string | null;
    value: string;
    gasPrice: string;
    maxPriorityFeePerGas?: number | string | BN;
    maxFeePerGas?: number | string | BN;
    gas: number;
    input: string;
}

export interface TransactionConfig {
    from?: string | number;
    to?: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    maxPriorityFeePerGas?: number | string | BN;
    maxFeePerGas?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
    common?: Common;
    chain?: string;
    hardfork?: string;
}

export type chain =
    | 'mainnet'
    | 'goerli'
    | 'kovan'
    | 'rinkeby'
    | 'ropsten';

export type hardfork =
    | 'chainstart'
    | 'homestead'
    | 'dao'
    | 'tangerineWhistle'
    | 'spuriousDragon'
    | 'byzantium'
    | 'constantinople'
    | 'petersburg'
    | 'istanbul';

export interface Common {
    customChain: CustomChainParams;
    baseChain?: chain;
    hardfork?: hardfork;
}

export interface CustomChainParams {
    name?: string;
    networkId: number;
    chainId: number;
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
    };
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
    effectiveGasPrice: number;
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
    topics: string[];
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    removed: boolean;
}

// had to move `web3-net` due to other modules in `1.x` not referencing

export class NetworkBase {
    constructor();
    constructor(provider: provider);
    constructor(provider: provider, net: net.Socket);

    readonly givenProvider: any;
    readonly currentProvider: provider;
    static readonly givenProvider: any;
    static readonly providers: Providers;
    BatchRequest: new () => BatchRequest;

    setProvider(provider: provider): boolean;

    extend(extension: Extension): any;

    getNetworkType(
        callback?: (error: Error, returnValue: string) => void
    ): Promise<string>;

    getId(callback?: (error: Error, id: number) => void): Promise<number>;

    isListening(
        callback?: (error: Error, listening: boolean) => void
    ): Promise<boolean>;

    getPeerCount(
        callback?: (error: Error, peerCount: number) => void
    ): Promise<number>;
}

// had to move accounts from web3-eth-accounts due to other modules in 1.x not referencing

export class AccountsBase {
    constructor();
    constructor(provider: provider);
    constructor(provider: provider, net: net.Socket);

    readonly givenProvider: any;
    readonly currentProvider: provider;

    setProvider(provider: provider): boolean;

    create(entropy?: string): Account;

    privateKeyToAccount(privateKey: string, ignoreLength?: boolean): Account;

    signTransaction(
        transactionConfig: TransactionConfig,
        privateKey: string,
        callback?: (error: Error, signedTransaction: SignedTransaction) => void
    ): Promise<SignedTransaction>;

    recoverTransaction(signature: string): string;

    hashMessage(message: string): string;

    sign(data: string, privateKey: string): Sign;

    recover(signatureObject: SignatureObject): string;
    recover(message: string, signature: string, preFixed?: boolean): string;
    recover(
        message: string,
        v: string,
        r: string,
        s: string,
        preFixed?: boolean
    ): string;

    encrypt(privateKey: string, password: string): EncryptedKeystoreV3Json;

    decrypt(keystoreJsonV3: EncryptedKeystoreV3Json, password: string): Account;

    wallet: WalletBase;
}

export class WalletBase {
    constructor(accounts: AccountsBase);

    length: number;
    defaultKeyName: string;

    [key: number]: Account;

    create(numberOfAccounts: number, entropy?: string): WalletBase;

    add(account: string | AddAccount): AddedAccount;

    remove(account: string | number): boolean;

    clear(): WalletBase;

    encrypt(password: string): EncryptedKeystoreV3Json[];

    decrypt(
        keystoreArray: EncryptedKeystoreV3Json[],
        password: string
    ): WalletBase;

    save(password: string, keyName?: string): boolean;

    load(password: string, keyName?: string): WalletBase;
}

export interface AddAccount {
    address: string;
    privateKey: string;
}

export interface AddedAccount extends Account {
    index: number;
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

// put all the `web3-provider` typings in here so we can get to them everywhere as this module does not exist in 1.x

export class BatchRequest {
    constructor();

    add(method: Method): void;

    execute(): void;
}

export class HttpProvider extends HttpProviderBase {
    constructor(host: string, options?: HttpProviderOptions);
}

export class IpcProvider extends IpcProviderBase {
    constructor(path: string, net: net.Server);
}

export class WebsocketProvider extends WebsocketProviderBase {
    constructor(host: string, options?: WebsocketProviderOptions);
}

export interface PastLogsOptions extends LogsOptions {
    toBlock?: BlockNumber;
}

export interface LogsOptions {
    fromBlock?: BlockNumber;
    address?: string | string[];
    topics?: Array<string | string[] | null>;
}

export type BlockNumber = string | number | BN | BigNumber | 'latest' | 'pending' | 'earliest' | 'genesis' | 'finalized' | 'safe';

export interface RequestArguments {
    method: string;
    params?: any;
    [key: string]: any;
}

export interface AbstractProvider {
    sendAsync(payload: JsonRpcPayload, callback?: (error: Error | null, result?: JsonRpcResponse) => Promise<unknown> | void): void;
    send?(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => unknown): void;
    request?(args: RequestArguments): Promise<any>;
    connected?: boolean;
  }

export type provider =
    | HttpProvider
    | IpcProvider
    | WebsocketProvider
    | AbstractProvider
    | string
    | null;
