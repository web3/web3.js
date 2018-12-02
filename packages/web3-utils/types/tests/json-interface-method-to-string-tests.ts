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
 * @file index.d.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { _jsonInterfaceMethodToString, ABIItem } from 'web3-utils';

const abiItem: ABIItem = {
    constant: true,
    inputs: [
        {
            name: 'testMe',
            type: 'uint256[3]'
        }
    ],
    name: "testName",
    outputs: [
        {
            name: "test",
            type: "uint256"
        }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
};

_jsonInterfaceMethodToString(abiItem); // $ExpectType string

// $ExpectError
_jsonInterfaceMethodToString(['string']);
// $ExpectError
_jsonInterfaceMethodToString(234);
// $ExpectError
_jsonInterfaceMethodToString([4]);
// $ExpectError
_jsonInterfaceMethodToString(true);
// $ExpectError
_jsonInterfaceMethodToString(null);
// $ExpectError
_jsonInterfaceMethodToString(undefined);
