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

export class WebsocketProvider {
    constructor(host: string, options?: WebsocketProviderOptions);

    requestQueue: Map<string, RequestItem>;
    responseQueue: Map<string, RequestItem>;
    connected: boolean;
    connection: any;

    supportsSubscriptions(): boolean;

    send(
        payload: JsonRpcPayload,
        callback: (error: Error | null, result?: JsonRpcResponse) => void
    ): void;

    on(type: string, callback: () => void): void;

    once(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    disconnect(code: number, reason: string): void;

    connect(): void;

    reconnect(): void;
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
    reconnect?: ReconnectOptions;
}

export interface ReconnectOptions {
    auto?: boolean;
    delay?: number;
    maxAttempts?: boolean;
    onTimeout?: boolean;
}

// Duplicated in ws, ipc, and http provider package
export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}

// Duplicated in ws, ipc, and http provider package
export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}

export interface RequestItem {
    payload: JsonRpcPayload;
    callback: (error: any, result: any) => void;
}
