/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import * as net from 'net';
import {HttpProvider, IpcProvider, WebsocketProvider} from 'conflux-web-providers';
import {AbstractConfluxWebModule, ConfluxWebModuleOptions} from 'conflux-web-core';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ]
};
const httpProvider = new HttpProvider('http://localhost:8545', options);
const ipcProvider = new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', new net.Server());
const abstractConfluxModule = new AbstractConfluxWebModule(httpProvider);

// $ExpectType BatchRequest
new abstractConfluxModule.BatchRequest();

// $ExpectType string | number
abstractConfluxModule.defaultEpoch;

// $ExpectType number
abstractConfluxModule.transactionBlockTimeout;

// $ExpectType number
abstractConfluxModule.transactionConfirmationBlocks;

// $ExpectType number
abstractConfluxModule.transactionPollingTimeout;

// $ExpectType string
abstractConfluxModule.defaultGasPrice;

// $ExpectType number
abstractConfluxModule.defaultGas;

// $ExpectType Providers
AbstractConfluxWebModule.providers;

// $ExpectType any
abstractConfluxModule.givenProvider;

// $ExpectType string | null
abstractConfluxModule.defaultAccount;

// $ExpectType HttpProvider | IpcProvider | WebsocketProvider | ConfluxWebCfxProvider | CustomProvider
abstractConfluxModule.currentProvider;

// $ExpectType boolean
abstractConfluxModule.setProvider(httpProvider);

// $ExpectType boolean
abstractConfluxModule.setProvider('http://localhost:8545');

// $ExpectType boolean
abstractConfluxModule.isSameProvider('http://localhost:8545');

// $ExpectType boolean
abstractConfluxModule.isSameProvider(httpProvider);

// $ExpectType Promise<boolean>
abstractConfluxModule.clearSubscriptions('eth_unsubscribe');
