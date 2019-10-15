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
import { AbstractMethod, AbstractMethodFactory } from 'web3-core-method';
import BN = require('bn.js');

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
    static readonly providers: Providers;
    defaultAccount: string | null;
    readonly currentProvider:
        | Web3EthereumProvider
        | HttpProvider
        | IpcProvider
        | WebsocketProvider
        | CustomProvider;
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
        type: 'transactionHash',
        handler: (receipt: string) => void
    ): PromiEvent<T>;

    once(
        type: 'receipt',
        handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;

    once(
        type: 'confirmation',
        handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;

    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    once(
        type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
        handler: (error: Error | TransactionReceipt | string) => void
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
        handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;

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
    to: string | null;
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
    raw?: { data: string; topics: any[] };
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

export interface TxPoolContent {
    pending: TxPool;
    queued: TxPool;
}

export interface TxPoolInspect {
    pending: TxPool;
    queued: TxPool;
}

export interface TxPool {
    [address: string]: {
        [nonce: number]: string[] | Transaction[];
    };
}

export interface TxPoolStatus {
    pending: number;
    queued: number;
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
    protocols: any; // Any because it's not documented what each protocol (eth, shh etc.) is defining here
}

export interface PeerInfo {
    caps: string[];
    id: string;
    name: string;
    network: {
        localAddress: string;
        remoteAddress: string;
    };
    protocols: any; // Any because it's not documented what each protocol (eth, shh etc.) is defining here
}

export interface TransactionSigner {
    sign(txObject: TransactionConfig): Promise<SignedTransaction>;
}

// had to move `web3-net` due to other modules in `1.x` not referencing

export class NetworkBase extends AbstractWeb3Module {
    constructor(
        provider: provider,
        net?: net.Socket | null,
        options?: Web3ModuleOptions
    );

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

export class AccountsBase extends AbstractWeb3Module {
    constructor(
        provider: provider,
        net?: net.Socket | null,
        options?: Web3ModuleOptions
    );

    create(entropy?: string): Account;

    privateKeyToAccount(privateKey: string): Account;

    signTransaction(
        transactionConfig: TransactionConfig,
        privateKey: string,
        callback?: () => void
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

    accountsIndex: number;
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

// put all the `web3-provider` typings in here so we can get to them everywhere as this module does not exist in 1.x

export class BatchRequest {
    constructor(moduleInstance: AbstractWeb3Module);

    add(method: AbstractMethod): void;

    execute(): Promise<BatchError | BatchResponse>;
}

export interface BatchError {
    errors: BatchErrorItem[];
    response: any[];
}

export interface BatchErrorItem {
    error: Error;
    method: AbstractMethod;
}

export interface BatchResponse {
    methods: AbstractMethod[];
    response: any[];
}

export class ProviderDetector {
    static detect(): provider | undefined;
}

export class ProvidersModuleFactory {
    createBatchRequest(moduleInstance: AbstractWeb3Module): BatchRequest;

    createProviderResolver(): ProviderResolver;

    createHttpProvider(url: string): HttpProvider;

    createWebsocketProvider(url: string): WebsocketProvider;

    createIpcProvider(path: string, net: net.Server): IpcProvider;

    createWeb3EthereumProvider(connection: object): Web3EthereumProvider;
}

export class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(
        methods: AbstractMethod[],
        moduleInstance: AbstractWeb3Module
    ): Promise<any[]>;

    disconnect(): boolean;
}

export class CustomProvider {
    constructor(injectedProvider: any);

    host: string;

    supportsSubscriptions(): boolean;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(
        methods: AbstractMethod[],
        moduleInstance: AbstractWeb3Module
    ): Promise<any[]>;
}

export class AbstractSocketProvider {
    constructor(connection: any, timeout?: number);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    registerEventListeners(): void;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(
        methods: AbstractMethod[],
        moduleInstance: AbstractWeb3Module
    ): Promise<any[]>;

    subscribe(
        subscribeMethod: string,
        subscriptionMethod: string,
        parameters: any[]
    ): Promise<string>;

    unsubscribe(
        subscriptionId: string,
        unsubscribeMethod: string
    ): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>;

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    reconnect(): void;

    disconnect(code: number, reason: string): void;
}

export class IpcProvider extends AbstractSocketProvider {
    constructor(path: string, net: net.Server);
}

export class WebsocketProvider extends AbstractSocketProvider {
    constructor(host: string, options?: WebsocketProviderOptions);

    isConnecting(): boolean;
}

export class Web3EthereumProvider extends AbstractSocketProvider {
    constructor(ethereumProvider: any);
}

export class JsonRpcMapper {
    static toPayload(method: string, params: any[]): JsonRpcPayload;
}

export class ProviderResolver {
    resolve(provider: provider, net: net.Socket): provider;
}

export class JsonRpcResponseValidator {
    static validate(
        response: JsonRpcPayload[] | JsonRpcPayload,
        payload?: object
    ): boolean;

    static isResponseItemValid(response: JsonRpcPayload): boolean;
}

export type provider =
    | HttpProvider
    | IpcProvider
    | WebsocketProvider
    | Web3EthereumProvider
    | CustomProvider
    | string
    | null;

export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}

export interface HttpHeader {
    name: string;
    value: string;
}

export interface HttpProviderOptions {
    host?: string;
    timeout?: number;
    headers?: HttpHeader[];
    withCredentials?: boolean;
}

export interface WebsocketProviderOptions {
    host?: string;
    timeout?: number;
    reconnectDelay?: number;
    headers?: {};
    protocol?: string;
    clientConfig?: string;
    requestOptions?: object;
    origin?: string;
}
