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
 * @file web3-provider-ws-tests.js
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { WebsocketProvider, WebsocketProviderOptions, JsonRpcResponse, JsonRpcPayload  } from 'web3-providers-ws';

const payload: JsonRpcPayload = {jsonrpc: '', id: 0, method: '', params: []};

const options: WebsocketProviderOptions = {
    timeout: 30000,
    headers: {
        authorization: 'Basic username:password'
    }
};

const wsProvider = new WebsocketProvider('ws://localhost:8545', options);

// $ExpectType boolean
wsProvider.connected;

// $ExpectType void
wsProvider.disconnect(100, 'reason');

// $ExpectType Map<string, RequestItem>
wsProvider.requestQueue;

// $ExpectType Map<string, RequestItem>
wsProvider.responseQueue;

// $ExpectType any
wsProvider.connection;

// $ExpectType boolean
wsProvider.connected;

// $ExpectType boolean
wsProvider.supportsSubscriptions();

// $ExpectType void
wsProvider.send(payload, (error: Error | null) => {});

// $ExpectType void
wsProvider.send(payload, (error: Error | null, result: JsonRpcResponse | undefined) => {});

// $ExpectType void
wsProvider.on('type', () => {});

// $ExpectType void
wsProvider.once('type', () => {});

// $ExpectType void
wsProvider.removeListener('type', () => {});

// $ExpectType void
wsProvider.removeAllListeners('type');

// $ExpectType void
wsProvider.reset();
