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
 * @file provider-module-factory-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import * as net from 'net';
import {AbstractWeb3Module} from 'conflux-web-core';
import {ProvidersModuleFactory} from 'conflux-web-providers';

const providersModuleFactory = new ProvidersModuleFactory();

// $ExpectType BatchRequest
providersModuleFactory.createBatchRequest(
    new AbstractWeb3Module('http://localhost:7545')
);

// $ExpectType ProviderResolver
providersModuleFactory.createProviderResolver();

// $ExpectType HttpProvider
providersModuleFactory.createHttpProvider('http://localhost:8545');

// $ExpectType WebsocketProvider
providersModuleFactory.createWebsocketProvider('http://localhost:8545');

// $ExpectType Web3EthereumProvider
providersModuleFactory.createWeb3EthereumProvider({});

// $ExpectType IpcProvider
providersModuleFactory.createIpcProvider('http://localhost:8545', new net.Server());
