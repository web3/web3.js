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

import * as net from "net";
import EventEmitter from 'eventemitter3';

export class AbstractProviderAdapter extends EventEmitter {
    constructor(provider: provider);
    send(method: string, params: any[]): Promise<any>;
    sendBatch(payload: JsonRpcPayload, callback: () => void): void;
    // TS does not support overloading so we have to do it this way for now
    subscribe(subscriptionType?: string, subscriptionMethod?: string, parameters?: any[]): Promise<string | Error>;
    unsubscribe(subscriptionId?: string, subscriptionType?: string): Promise<boolean | Error>;
    handleResponse(reject: () => void, resolve: () => void, error: Error, response: any, payload: JsonRpcPayload): void;
    isConnected(): boolean;
}

export class HttpProviderAdapter extends AbstractProviderAdapter {
    constructor(provider: HttpProvider);
}

export class InpageProviderAdapter extends AbstractProviderAdapter {
    constructor(provider: provider);
    isConnected(): boolean;
}

export class SocketProviderAdapter extends AbstractProviderAdapter {
    constructor(provider: provider);
    subscribe(subscriptionType: string, subscriptionMethod: string, parameters: any[]): Promise<string | Error>;
    isConnected(): boolean;
    unsubscribe(subscriptionId: string, subscriptionType: string): Promise<boolean|Error>;
    registerSubscriptionListener(): void;
    hasSubscription(subscriptionId: string): boolean;
    clearSubscriptions(): void;
    removeSubscription(subscriptionId: string, subscriptionType: string): Promise<boolean>;
}

export class BatchRequest {
    constructor(provider: provider, jsonRpcMapper: JsonRpcMapper, jsonRpcResponseValidator: JsonRpcResponseValidator);
    add(request: any): void;
    execute(): void;
    hasOutputFormatter(request: any): boolean;
}

export class ProviderDetector {
    detect(): provider | undefined;
    isIpcProviderWrapper(provider: provider): boolean;
    addSubscriptionsToIpcProviderWrapper(provider: provider): provider;
}

export class ProvidersModuleFactory {
    createBatchRequest(provider: provider): BatchRequest;
    createProviderAdapterResolver(): ProviderAdapterResolver;
    createProviderDetector(): ProviderDetector;
    createHttpProvider(url: string): HttpProvider;
    createWebsocketProvider(url: string): WebsocketProvider;
    createIpcProvider(path: string, net: net.Server): IpcProvider;
    createHttpProviderAdapter(provider: provider): HttpProviderAdapter;
    createSocketProviderAdapter(provider: provider): SocketProviderAdapter;
    createInpageProviderAdapter(provider: provider): InpageProviderAdapter;
    createJSONRpcResponseValidator(): JsonRpcResponseValidator;
}

export class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);
    send(payload: JsonRpcPayload, callback: () => void): void;
    disconnect(): void;
}

export class IpcProvider {
    constructor(path: string, net: net.Server);
    addDefaultEvents(): void;
    reconnect(): void;
    send(payload: JsonRpcPayload, callback: () => void): void;
    on(type: string, callback: () => void): void;
    once(type: string, callback: () => void): void;
    removeListener(type: string, callback: () => void): void;
    removeAllListeners(type: string): void;
    reset(): void;
}

export class WebsocketProvider {
    constructor(host: string, options?: WebsocketProviderOptions);
    addDefaultEvents(): void;
    send(payload: JsonRpcPayload, callback: () => void): void;
    on(type: string, callback: () => void): void;
    removeListener(type: string, callback: () => void): void;
    removeAllListeners(type: string): void;
    reset(): void;
    disconnect(): void;
}

export class JsonRpcMapper {
    static toPayload(method: string, params: any[]): JsonRpcPayload;
    static toBatchPayload(requests: any[]): JsonRpcPayload[];
}

export class ProviderAdapterResolver {
    constructor(providersPackageFactory: ProvidersModuleFactory);
    resolve(provider: provider, net: net.Server): provider | Error;
}

export class JsonRpcResponseValidator {
    static isValid(response: JsonRpcPayload[] | JsonRpcPayload): boolean;
    static isResponseItemValid(response: JsonRpcPayload): boolean;
}

export type provider = HttpProvider | IpcProvider | WebsocketProvider | string;

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
