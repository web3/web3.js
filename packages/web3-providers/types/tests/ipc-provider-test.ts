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
 * @file ipc-provider-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import * as net from "net";
import {IpcProvider} from 'web3-providers';

const ipcProvider = new IpcProvider('http://localhost:8545', new net.Server());

// $ExpectType void
ipcProvider.addDefaultEvents();

// $ExpectType void
ipcProvider.reconnect();

// $ExpectType void
ipcProvider.send({}, () => {});

// $ExpectType void
ipcProvider.on('type', () => {});

// $ExpectType void
ipcProvider.once('type', () => {});

// $ExpectType void
ipcProvider.removeListener('type', () => {});

// $ExpectType void
ipcProvider.removeAllListeners('type');

// $ExpectType void
ipcProvider.reset();
