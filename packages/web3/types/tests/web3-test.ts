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

// $ExpectType Modules
Web3.modules;

// $ExpectType string | HttpProvider | IpcProvider | WebsocketProvider | EthereumProvider | null
Web3.givenProvider;

const web3 = new Web3('https://localhost:5000/');

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
