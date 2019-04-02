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
import {AbstractWeb3Module} from 'web3-core';
import {AbstractMethod} from 'web3-core-method';

export class BatchRequest {
    constructor(moduleInstance: AbstractWeb3Module);

    add(method: AbstractMethod): void;

    execute(): Promise<{methods: AbstractMethod[]; response: any[]} | Error[]>;
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

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;

    disconnect(): boolean;
}

export class AbstractSocketProvider {
    constructor(connection: any, timeout?: number);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    registerEventListeners(): void;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

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

export class Web3EthereumProvider {
    constructor();

    host: string;
    registerEventListeners(): void;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>;

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;
}

export class JsonRpcMapper {
    static toPayload(method: string, params: any[]): JsonRpcPayload;
}

export class ProviderResolver {
    resolve(provider: provider, net: net.Socket): provider;
}

export class JsonRpcResponseValidator {
    static validate(response: JsonRpcPayload[] | JsonRpcPayload, payload?: object): boolean;

    static isResponseItemValid(response: JsonRpcPayload): boolean;
}

export type provider = HttpProvider | IpcProvider | WebsocketProvider | Web3EthereumProvider | string;

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
    headers?: {};
    protocol?: string;
    clientConfig?: string;
}
