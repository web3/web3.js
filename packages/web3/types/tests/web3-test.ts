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
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Web3 from 'web3';
import * as net from 'net';

// $ExpectType Utils
Web3.utils;

// $ExpectType string
Web3.version;

// $ExpectType Modules
Web3.modules;

// $ExpectType Providers
Web3.providers;

let web3 = new Web3('https://localhost:5000/');

const netSocket = new net.Socket();

web3 = new Web3('https://localhost:5000/', netSocket);

web3 = new Web3();

// $ExpectType provider
web3.currentProvider;

// $ExpectType any
web3.extend({property: 'test', methods: [{name: 'method', call: 'method'}]});

// $ExpectType any
web3.givenProvider;

// $ExpectType string | null
web3.defaultAccount;

// $ExpectType string | number
web3.defaultBlock;

// $ExpectType boolean
web3.setProvider('https://localhost:2100');

// $ExpectType BatchRequest
new web3.BatchRequest();

// $ExpectType Utils
web3.utils;

// $ExpectType string
web3.version;

// $ExpectType Eth
web3.eth;

// $ExpectType Shh
web3.shh;

// $ExpectType Bzz
web3.bzz;
