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
 * @file abstract-provider-adapter-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import {AbstractProviderAdapter, HttpProvider} from 'web3-providers';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin', value: '*'
        }
    ]
};
const httpProvider = new HttpProvider('http://localhost:8545', options);
const abstractProviderAdapter = new AbstractProviderAdapter(httpProvider);

// $ExpectType Promise<any>
abstractProviderAdapter.send('test', ['params']);

// $ExpectError
abstractProviderAdapter.send('test');
// $ExpectError
abstractProviderAdapter.send(null, ['params']);
// $ExpectError
abstractProviderAdapter.send(undefined, ['params']);
// $ExpectError
abstractProviderAdapter.send(3, ['params']);
// $ExpectError
abstractProviderAdapter.send(['test'], ['params']);
// $ExpectError
abstractProviderAdapter.send([3], ['params']);
// $ExpectError
abstractProviderAdapter.send(true, ['params']);
// $ExpectError
abstractProviderAdapter.send('test', undefined);
// $ExpectError
abstractProviderAdapter.send('test', null);
// $ExpectError
abstractProviderAdapter.send('test', 3);
// $ExpectError
abstractProviderAdapter.send('test', true);

// $ExpectType void
abstractProviderAdapter.sendBatch('test', () => {});
// $ExpectType void
abstractProviderAdapter.sendBatch(67, () => {});

// $ExpectError
abstractProviderAdapter.sendBatch('test', 3);
// $ExpectError
abstractProviderAdapter.sendBatch('test', true);
// $ExpectError
abstractProviderAdapter.sendBatch('test', undefined);
// $ExpectError
abstractProviderAdapter.sendBatch('test', null);
// $ExpectError
abstractProviderAdapter.sendBatch('test', [3]);
// $ExpectError
abstractProviderAdapter.sendBatch('test', ['test']);

// $ExpectType Promise<string | Error>
abstractProviderAdapter.subscribe();

// $ExpectType Promise<boolean | Error>
abstractProviderAdapter.unsubscribe();

// $ExpectType void
abstractProviderAdapter.handleResponse(() => {}, () => {}, new Error('BLAH'), {}, {});

// $ExpectType boolean
abstractProviderAdapter.isConnected();
