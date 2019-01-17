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
import EventEmitter from 'eventemitter3';
import {AbstractWeb3Module} from 'web3-core';
import {AbstractMethod} from 'web3-core-method';

// TODO: Update types

export class BatchRequest {
    constructor(moduleInstance: AbstractWeb3Module, provider: provider);

    add(request: any): void;

    execute(): Promise<any[]>;
}

export class ProviderDetector {
    detect(): provider | undefined;
}

export class ProvidersModuleFactory {
    createBatchRequest(moduleInstance: AbstractWeb3Module, provider: provider): BatchRequest;

    createProviderAdapterResolver(): ProviderAdapterResolver;

    createProviderDetector(): ProviderDetector;

    createHttpProvider(url: string): HttpProvider;

    createWebsocketProvider(url: string): WebsocketProvider;

    createIpcProvider(path: string, net: net.Server): IpcProvider;
}

export class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);

    connected: boolean;

    send(payload: JsonRpcPayload, callback: () => void): Promise<Object>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<Object[]>;

    disconnect(): void;
}

export class IpcProvider {
    constructor(path: string, net: net.Server);

    connected: boolean;

    registerEventListeners(): void;

    send(method: string, callback: () => void): Promise<Object>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<Object[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: []): Promise<String>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    reconnect(): void;

    disconnect(): void;
}

export class WebsocketProvider {
    constructor(host: string, options?: WebsocketProviderOptions);

    connected: Boolean;

    registerEventListeners(): void;

    send(method: string, callback: () => void): Promise<Object>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<Object[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: []): Promise<String>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    isConnecting(): Boolean;

    reset(): void;

    disconnect(code: number, reason: string): void;

    reconnect(): void
}

export class EthereumProvider {
    constructor();

    registerEventListeners(): void;

    send(method: string, callback: () => void): Promise<Object>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<Object[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: []): Promise<String>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;
}

export class JsonRpcMapper {
    static toPayload(method: string, params: any[]): JsonRpcPayload;
}

export class ProviderAdapterResolver {
    constructor(providersPackageFactory: ProvidersModuleFactory);

    resolve(provider: provider, net: net.Server): provider;
}

export class JsonRpcResponseValidator {
    static validate(response: JsonRpcPayload[] | JsonRpcPayload, payload?: Object): boolean;

    static isResponseItemValid(response: JsonRpcPayload): boolean;
}

export type provider = HttpProvider | IpcProvider | WebsocketProvider | EthereumProvider | string;

export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}

export interface HttpProviderOptions {
    host?: string;
    timeout?: number;
    headers?: {};
}

export interface WebsocketProviderOptions {
    host?: string;
    timeout?: number;
    headers?: {};
    protocol?: string;
    clientConfig?: string;
}
