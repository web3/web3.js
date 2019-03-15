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
 * @file http-provider-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk> , Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import {HttpProvider, ProvidersModuleFactory} from 'web3-providers';

const httpProvider = new HttpProvider('http://localhost:8545', {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ]
});

// $ExpectType Promise<any>
httpProvider.send('rpc_method', []);

// $ExpectType Promise<any[]>
httpProvider.sendBatch(
    [],
    new AbstractWeb3Module('http://localhost:7545', new ProvidersModuleFactory(), 'eth_coinbase')
);

// $ExpectType boolean
httpProvider.disconnect();
