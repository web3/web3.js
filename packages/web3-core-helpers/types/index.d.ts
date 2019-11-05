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

export class formatters {
    static outputBigNumberFormatter(number: number): number;

    static inputSignFormatter(data: string): string;

    static inputAddressFormatter(address: string): string;

    static isPredefinedBlockNumber(blockNumber: string): boolean;

    static inputDefaultBlockNumberFormatter(blockNumber: string): string;

    static inputBlockNumberFormatter(blockNumber: string | number): string | number;

    static outputBlockFormatter(block: any): any; // TODO: Create Block interface

    static txInputFormatter(txObject: any): any;

    static inputCallFormatter(txObject: any): any;

    static inputTransactionFormatter(txObject: any): any;

    static outputTransactionFormatter(receipt: any): any;

    static outputTransactionReceiptFormatter(receipt: any): any;

    static inputLogFormatter(log: any): any;

    static outputLogFormatter(log: any): any;

    static inputPostFormatter(post: any): any; // TODO: Create Post interface

    static outputPostFormatter(post: any): any; // TODO: Create Post interface

    static outputSyncingFormatter(result: any): any; // TODO: Create SyncLog interface
}

export class errors {
    static ErrorResponse(result: Error): Error;
    static InvalidNumberOfParams(
        got: number,
        expected: number,
        method: string
    ): Error;
    static InvalidConnection(host: string): Error;
    static InvalidProvider(): Error;
    static InvalidResponse(result: Error): Error;
    static ConnectionTimeout(ms: string): Error;
}

export class WebsocketProviderBase {
    constructor(host: string, options?: WebsocketProviderOptions);

    isConnecting(): boolean;

    responseCallbacks: any;
    notificationCallbacks: any;
    connected: boolean;
    connection: any;

    addDefaultEvents(): void;

    supportsSubscriptions(): boolean;

    send(
        payload: JsonRpcPayload,
        callback: (error: Error, result: any) => void
    ): void;

    on(type: string, callback: () => void): void;

    once(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    disconnect(code: number, reason: string): void;
}

export class IpcProviderBase {
    constructor(path: string, net: net.Server);

    responseCallbacks: any;
    notificationCallbacks: any;
    connected: boolean;
    connection: any;

    addDefaultEvents(): void;

    supportsSubscriptions(): boolean;

    send(
        payload: JsonRpcPayload,
        callback: (error: Error, result: any) => void
    ): void;

    on(type: string, callback: () => void): void;

    once(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    reconnect(): void;
}

export class HttpProviderBase {
    constructor(host: string, options?: HttpProviderOptions);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    send(
        payload: JsonRpcPayload,
        callback: (error: Error, result: any) => void
    ): void;

    disconnect(): boolean;
}

export interface HttpProviderOptions {
    keepAlive?: boolean;
    timeout?: number;
    headers?: HttpHeader[];
    withCredentials?: boolean;
}

export interface HttpHeader {
    name: string;
    value: string;
}

export interface WebsocketProviderOptions {
    host?: string;
    timeout?: number;
    reconnectDelay?: number;
    headers?: any;
    protocol?: string;
    clientConfig?: string;
    requestOptions?: any;
    origin?: string;
}

export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}

export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}

export interface Callback<ResultType> {
  (error: Error): void;
  (error: null, val: ResultType): void;
}
