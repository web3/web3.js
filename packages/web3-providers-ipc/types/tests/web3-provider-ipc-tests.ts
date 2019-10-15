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
 * @file web3-provider-ipc-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import * as net from 'net';
import { IpcProvider } from 'web3-providers';

const ipcProvider = new IpcProvider(
    '/Users/myuser/Library/Ethereum/geth.ipc',
    new net.Server()
);

// $ExpectType string
ipcProvider.host;

// $ExpectType boolean
ipcProvider.connected;

// $ExpectType void
ipcProvider.registerEventListeners();

// $ExpectType Promise<any>
ipcProvider.send('rpc_method', []);

// $ExpectType Promise<any[]>
ipcProvider.sendBatch([], {});

// $ExpectType Promise<string>
ipcProvider.subscribe('eth_subscribe', 'logs', []);

// $ExpectType Promise<boolean>
ipcProvider.unsubscribe('subId', 'eth_unsubscribe');

// $ExpectType Promise<boolean>
ipcProvider.clearSubscriptions('eth_unsubscribe');

// $ExpectType void
ipcProvider.on('type', () => {});

// $ExpectType void
ipcProvider.removeListener('type', () => {});

// $ExpectType void
ipcProvider.removeAllListeners('type');

// $ExpectType void
ipcProvider.reset();

// $ExpectType void
ipcProvider.reconnect();

// $ExpectType void
ipcProvider.disconnect(100, 'reason');
