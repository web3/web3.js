/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import {jsonInterfaceMethodToString, AbiItem} from 'conflux-web-utils';

const abiItem: AbiItem = {
    anonymous: false,
    constant: true,
    inputs: [
        {
            name: 'testMe',
            type: 'uint256[3]'
        },
        {
            name: 'inputA',
            type: 'tuple',
            components: [
                {
                    name: 'a',
                    type: 'uint8'
                },
                {
                    name: 'b',
                    type: 'uint8'
                }
            ]
        },
        {
            name: 'inputB',
            type: 'tuple[]',
            components: [
                {
                    name: 'a1',
                    type: 'uint256'
                },
                {
                    name: 'a2',
                    type: 'uint256'
                }
            ]
        },
        {
            name: 'inputC',
            type: 'uint8',
            indexed: false
        }
    ],
    name: "testName",
    outputs: [
        {
            name: "test",
            type: "uint256"
        },
        {
            name: 'outputA',
            type: 'tuple',
            components: [
                {
                    name: 'a',
                    type: 'uint8'
                },
                {
                    name: 'b',
                    type: 'uint8'
                }
            ]
        },
        {
            name: 'outputB',
            type: 'tuple[]',
            components: [
                {
                    name: 'a1',
                    type: 'uint256'
                },
                {
                    name: 'a2',
                    type: 'uint256'
                }
            ]
        }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
};
// $ExpectType string
jsonInterfaceMethodToString(abiItem);

// $ExpectError
jsonInterfaceMethodToString(['string']);
// $ExpectError
jsonInterfaceMethodToString(234);
// $ExpectError
jsonInterfaceMethodToString([4]);
// $ExpectError
jsonInterfaceMethodToString(true);
// $ExpectError
jsonInterfaceMethodToString(null);
// $ExpectError
jsonInterfaceMethodToString(undefined);
