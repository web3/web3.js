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
 * @file abstract-web3-module-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */
import * as net from 'net';
import {HttpProvider, IpcProvider, WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions} from 'conflux-web-core';

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
const abstractWeb3Module = new AbstractWeb3Module(httpProvider);

// $ExpectType BatchRequest
new abstractWeb3Module.BatchRequest();

// $ExpectType string | number
abstractWeb3Module.defaultBlock;

// $ExpectType number
abstractWeb3Module.transactionBlockTimeout;

// $ExpectType number
abstractWeb3Module.transactionConfirmationBlocks;

// $ExpectType number
abstractWeb3Module.transactionPollingTimeout;

// $ExpectType string
abstractWeb3Module.defaultGasPrice;

// $ExpectType number
abstractWeb3Module.defaultGas;

// $ExpectType Providers
AbstractWeb3Module.providers;

// $ExpectType any
abstractWeb3Module.givenProvider;

// $ExpectType string | null
abstractWeb3Module.defaultAccount;

// $ExpectType HttpProvider | IpcProvider | WebsocketProvider | Web3EthereumProvider | CustomProvider
abstractWeb3Module.currentProvider;

// $ExpectType boolean
abstractWeb3Module.setProvider(httpProvider);

// $ExpectType boolean
abstractWeb3Module.setProvider('http://localhost:8545');

// $ExpectType boolean
abstractWeb3Module.isSameProvider('http://localhost:8545');

// $ExpectType boolean
abstractWeb3Module.isSameProvider(httpProvider);

// $ExpectType Promise<boolean>
abstractWeb3Module.clearSubscriptions('eth_unsubscribe');
