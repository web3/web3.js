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
 * @file abstract-socket-provider-test.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import {AbstractSocketProvider} from 'web3-providers';

const abstractSocketProvider = new AbstractSocketProvider({});

// $ExpectType string
abstractSocketProvider.host;

// $ExpectType boolean
abstractSocketProvider.connected;

// $ExpectType void
abstractSocketProvider.registerEventListeners();

// $ExpectType Promise<any>
abstractSocketProvider.send('rpc_method', []);

// $ExpectType Promise<any[]>
abstractSocketProvider.sendBatch(
    [],
    new AbstractWeb3Module('http://localhost:7545')
);

// $ExpectType Promise<string>
abstractSocketProvider.subscribe('eth_subscribe', 'logs', []);

// $ExpectType Promise<boolean>
abstractSocketProvider.unsubscribe('subId', 'eth_unsubscribe');

// $ExpectType Promise<boolean>
abstractSocketProvider.clearSubscriptions('eth_unsubscribe');

// $ExpectType void
abstractSocketProvider.on('type', () => {});

// $ExpectType void
abstractSocketProvider.removeListener('type', () => {});

// $ExpectType void
abstractSocketProvider.removeAllListeners('type');

// $ExpectType void
abstractSocketProvider.reset();

// $ExpectType void
abstractSocketProvider.reconnect();

// $ExpectType void
abstractSocketProvider.disconnect(100, 'reason');
