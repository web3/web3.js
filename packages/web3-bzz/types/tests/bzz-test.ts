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
 * @file bzz-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { Bzz } from 'web3-bzz';

const bzz = new Bzz('http://swarm-gateways.net');

// $ExpectType any
Bzz.givenProvider;

// $ExpectType boolean
bzz.setProvider('test.com');

// $ExpectType any
bzz.currentProvider;

// $ExpectType any
bzz.givenProvider;

// $ExpectType string | null
bzz.defaultAccount;

// $ExpectType string | number
bzz.defaultBlock;

// $ExpectType boolean
bzz.setProvider('https://localhost:2100');

// $ExpectType any
new bzz.BatchRequest();

// $ExpectType Promise<string>
bzz.upload('test file');

const dir = {
    '/foo.txt': { type: 'text/plain', data: 'sample file' },
    '/bar.txt': { type: 'text/plain', data: 'another file' }
};

// $ExpectType Promise<string>
bzz.upload(dir);
// $ExpectType Promise<string>
bzz.upload({
    path: '/path/to/thing',
    kind: 'directory',
    defaultFile: '/index.html'
});

// $ExpectType Promise<any>
bzz.pick.file();

// $ExpectType Promise<any>
bzz.pick.directory();

// $ExpectType Promise<any>
bzz.pick.data();
