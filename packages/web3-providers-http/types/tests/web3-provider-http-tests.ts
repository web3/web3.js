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
 * @file web3-provider-http-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk> , Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import { HttpProvider, JsonRpcResponse, JsonRpcPayload, HttpProviderOptions } from 'web3-providers-http';

const payload: JsonRpcPayload = {jsonrpc: '', id: 0, method: '', params: []};

const options: HttpProviderOptions = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ],
    withCredentials: false
};

const httpProvider = new HttpProvider('http://localhost:8545', options);

// $ExpectType void
httpProvider.send(payload, (error: Error | null) => {});

// $ExpectType void
httpProvider.send(payload, (error: Error | null, result: JsonRpcResponse | undefined) => {});

// $ExpectType boolean
httpProvider.disconnect();
