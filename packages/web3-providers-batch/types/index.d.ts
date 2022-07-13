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
 * @author AyanamiTech <ayanami0330@protonmail.com>
 * @date 2022
 */
import type { HttpHeader, HttpProviderAgent, HttpProviderOptions } from 'web3-providers-http';

import { HttpProviderBase, JsonRpcResponse } from 'web3-core-helpers';

export class BatchProvider extends HttpProviderBase {
    host: string;

    withCredentials?: boolean;
    timeout: number;
    headers?: HttpHeader[];
    agent?: HttpProviderAgent;
    connected: boolean;

    constructor(host?: string, options?: HttpProviderOptions);

    send(
        payload: object,
        callback?: (
            error: Error | null,
            result: JsonRpcResponse | undefined
        ) => void
    ): void;
    disconnect(): boolean;
    supportsSubscriptions(): boolean;
}
