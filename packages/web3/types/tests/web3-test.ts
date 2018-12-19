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
 * @file web3-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import Web3 from 'web3';
import {HttpProvider} from 'web3-providers';

// $ExpectType Utils
Web3.utils;

// $ExpectType string
Web3.version;

// $ExpectType provider
Web3.givenProvider;

// $ExpectType Providers
Web3.providers;

// $ExpectType Modules
Web3.modules;

const web3 = new Web3('https://localhost:5000/');

// $ExpectType Utils
web3.utils;

// $ExpectType string
web3.version;

// $ExpectType Eth
web3.eth;

// $ExpectType any
web3.shh;

// $ExpectType any
web3.bzz;

// $ExpectType boolean
web3.setProvider(new HttpProvider('https://localhost:1234/'));
// $ExpectType boolean
web3.eth.setProvider(new HttpProvider('https://localhost:1234/'));
// $ExpectType any
web3.shh.setProvider(new HttpProvider('https://localhost:1234/'));
// $ExpectType any
web3.bzz.setProvider(new HttpProvider('https://localhost:1234/'));

// $ExpectType Providers
web3.providers;
// $ExpectType Providers
web3.eth.providers;
// $ExpectType any
web3.shh.providers;
// $ExpectType any
web3.bzz.providers;

// $ExpectType string | EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider | null
web3.givenProvider;
// $ExpectType string | EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider | null
web3.eth.givenProvider;
// $ExpectType any
web3.shh.givenProvider;
// $ExpectType any
web3.bzz.givenProvider;

// $ExpectType EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider
web3.currentProvider;
// $ExpectType EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider
web3.eth.currentProvider;
// $ExpectType EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider
web3.shh.currentProvider;
// $ExpectType EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider
web3.bzz.currentProvider;

// $ExpectType BatchRequest
new web3.BatchRequest();
// $ExpectType BatchRequest
new web3.eth.BatchRequest();
// $ExpectType any
new web3.shh.BatchRequest();
// $ExpectType any
new web3.bzz.BatchRequest();
