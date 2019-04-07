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
 * @file txpool-tests.ts
 * @author Prince <sinhaprince013@gmail.com>
 * @date 2018
 */

import {RLPEncodedTransaction} from 'web3-core';
import {Txpool} from 'web3-eth-txpool';
import {Accounts} from 'web3-eth-accounts';

const txpool = new Txpool('http://localhost:8545');

// $ExpectType Content
txpool.content();

// $ExpectType Content
txpool.inspect();

// $ExpectType Status
txpool.status();
