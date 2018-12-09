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

import {ProvidersModuleFactory, HttpProvider} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions} from 'web3-core';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin', value: '*'
        }
    ]
};
const httpProvider = new HttpProvider('http://localhost:8545', options);
const providersModuleFactory = new ProvidersModuleFactory();
const web3ModuleOption: Web3ModuleOptions = {
    defaultBlock: '1',
    transactionBlockTimeout: 2000,
    transactionConfirmationBlocks: 1,
    transactionPollingTimeout: 2000,
};

const abstractWeb3Module = new AbstractWeb3Module(
    httpProvider,
    providersModuleFactory,
    {},
    {},
    null,
    web3ModuleOption
);

// $ExpectType string
abstractWeb3Module.defaultGasPrice;

// $ExpectType number
abstractWeb3Module.defaultGas;

// $ExpectType number
abstractWeb3Module.transactionPollingTimeout;

// $ExpectType number
abstractWeb3Module.transactionConfirmationBlocks;

// $ExpectType number
abstractWeb3Module.transactionBlockTimeout;

// $ExpectType string | number
abstractWeb3Module.defaultBlock;

// $ExpectType string | null
abstractWeb3Module.defaultAccount;

// $ExpectType provider
abstractWeb3Module.currentProvider;

// $ExpectType boolean
abstractWeb3Module.setProvider(httpProvider, {});

// $ExpectType boolean
abstractWeb3Module.setProvider('http://localhost:8545', {});

// $ExpectType boolean
abstractWeb3Module.isSameProvider('http://localhost:8545');

// $ExpectType boolean
abstractWeb3Module.isSameProvider(httpProvider);

// $ExpectType void
abstractWeb3Module.clearSubscriptions();
