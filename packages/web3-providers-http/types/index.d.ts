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

export class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    send(
        payload: JsonRpcPayload,
        callback: (error: Error | null, result?: JsonRpcResponse) => void
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
