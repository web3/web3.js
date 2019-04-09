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
 * @file abi-coder-test.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import {AbiCoder} from 'conflux-web-cfx-abi';

const abiCoder = new AbiCoder();

// $ExpectType string
abiCoder.encodeFunctionSignature('myMethod(uint256,string)');
// $ExpectType string
abiCoder.encodeFunctionSignature({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
});

// $ExpectError
abiCoder.encodeFunctionSignature(345);
// $ExpectError
abiCoder.encodeFunctionSignature({});
// $ExpectError
abiCoder.encodeFunctionSignature(true);
// $ExpectError
abiCoder.encodeFunctionSignature(['string']);
// $ExpectError
abiCoder.encodeFunctionSignature([4]);
// $ExpectError
abiCoder.encodeFunctionSignature(null);
// $ExpectError
abiCoder.encodeFunctionSignature(undefined);
// $ExpectError
abiCoder.encodeFunctionSignature('myMethod(uint256,string)', {
    name: 'myMethod'
});

// $ExpectType string
abiCoder.encodeEventSignature('myEvent(uint256,bytes32)');
// $ExpectType string
abiCoder.encodeFunctionSignature({
    name: 'myEvent',
    type: 'event',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'bytes32',
        name: 'myBytes'
    }]
});

// $ExpectError
abiCoder.encodeFunctionSignature(345);
// $ExpectError
abiCoder.encodeFunctionSignature({});
// $ExpectError
abiCoder.encodeFunctionSignature(true);
// $ExpectError
abiCoder.encodeFunctionSignature(['string']);
// $ExpectError
abiCoder.encodeFunctionSignature([4]);
// $ExpectError
abiCoder.encodeFunctionSignature(null);
// $ExpectError
abiCoder.encodeFunctionSignature(undefined);
// $ExpectError
abiCoder.encodeFunctionSignature('myEvent(uint256,bytes32)', {
    name: 'myEvent'
});

// $ExpectType string
abiCoder.encodeParameter('uint256', '2345675643');
// $ExpectType string
abiCoder.encodeParameter('uint256', ['0xdf3234', '0xfdfd']);
// $ExpectType string
abiCoder.encodeParameter(
    {
        ParentStruct: {
            propertyOne: 'uint256',
            propertyTwo: 'uint256',
            childStruct: {
                propertyOne: 'uint256',
                propertyTwo: 'uint256'
            }
        }
    },
    {
        propertyOne: 42,
        propertyTwo: 56,
        childStruct: {
            propertyOne: 45,
            propertyTwo: 78
        }
    }
);

// $ExpectError
abiCoder.encodeParameter(null, ['0xdf3234', '0xfdfd']);
// $ExpectError
abiCoder.encodeParameter(undefined, ['0xdf3234', '0xfdfd']);

// $ExpectType string
abiCoder.encodeParameters(['uint256', 'string'], ['2345675643', 'Hello!%']);
// $ExpectType string
abiCoder.encodeParameters(['uint8[]', 'bytes32'], [['34', '434'], '0x324567fff']);
// $ExpectType string
abiCoder.encodeParameters(
    [
        'uint8[]',
        {
            ParentStruct: {
                propertyOne: 'uint256',
                propertyTwo: 'uint256',
                ChildStruct: {
                    propertyOne: 'uint256',
                    propertyTwo: 'uint256'
                }
            }
        }
    ],
    [
        ['34', '434'],
        {
            propertyOne: '42',
            propertyTwo: '56',
            ChildStruct: {
                propertyOne: '45',
                propertyTwo: '78'
            }
        }
    ]
);

// $ExpectError
abiCoder.encodeParameters(345, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeParameters(true, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeParameters(null, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeParameters(undefined, ['2345675643', 'Hello!%']);

// $ExpectType string
abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
}, ['2345675643', 'Hello!%']);

// $ExpectError
abiCoder.encodeFunctionCall([345], ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeFunctionCall(['string'], ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeFunctionCall(345, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeFunctionCall(true, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeFunctionCall(null, ['2345675643', 'Hello!%']);
// $ExpectError
abiCoder.encodeFunctionCall(undefined, ['2345675643', 'Hello!%']);

abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
    // $ExpectError
}, 345);

abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
    // $ExpectError
}, [345]);

abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
    // $ExpectError
}, true);

abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
    // $ExpectError
}, null);

abiCoder.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    }, {
        type: 'string',
        name: 'myString'
    }]
    // $ExpectError
}, undefined);

// $ExpectType { [key: string]: any; }
abiCoder.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectType { [key: string]: any; }
abiCoder.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectType { [key: string]: any; }
abiCoder.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectType { [key: string]: any; }
abiCoder.decodeParameter({
    ParentStruct: {
        propertyOne: 'uint256',
        propertyTwo: 'uint256',
        childStruct: {
            propertyOne: 'uint256',
            propertyTwo: 'uint256'
        }
    }
}, `0x000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000
    00000000000038000000000000000000000000000000000000000000000000000000000000002d00000000000000000000000000000000000000
    0000000000000000000000004e`);

// $ExpectError
abiCoder.decodeParameter('uint256', [345]);
// $ExpectError
abiCoder.decodeParameter('uint256', ['string']);
// $ExpectError
abiCoder.decodeParameter('uint256', 345);
// $ExpectError
abiCoder.decodeParameter('uint256', true);
// $ExpectError
abiCoder.decodeParameter('uint256', null);
// $ExpectError
abiCoder.decodeParameter('uint256', undefined);

// $ExpectType { [key: string]: any; }
abiCoder.decodeParameters(['string', 'uint256'], '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectType { [key: string]: any; }
abiCoder.decodeParameters([{
    type: 'string',
    name: 'myString'
}, {
    type: 'uint256',
    name: 'myNumber'
}], '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectType { [key: string]: any; }
abiCoder.decodeParameters([
    'uint8[]',
    {
        ParentStruct: {
            propertyOne: 'uint256',
            propertyTwo: 'uint256',
            childStruct: {
                propertyOne: 'uint256',
                propertyTwo: 'uint256'
            }
        }
    }
], '0x0000000000000000000000000000000000000000000000000000000000000010');

// $ExpectError
abiCoder.decodeParameters('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectError
abiCoder.decodeParameters(453, '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectError
abiCoder.decodeParameters(true, '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectError
abiCoder.decodeParameters(null, '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectError
abiCoder.decodeParameters(undefined, '0x0000000000000000000000000000000000000000000000000000000000000010');
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], 345);
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], ['string']);
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], [345]);
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], true);
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], null);
// $ExpectError
abiCoder.decodeParameters(['string', 'uint256'], undefined);

// $ExpectType { [key: string]: string; }
abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

// $ExpectError
abiCoder.decodeLog(['string'],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
// $ExpectError
abiCoder.decodeLog([345],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
// $ExpectError
abiCoder.decodeLog(true,
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
// $ExpectError
abiCoder.decodeLog([undefined],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
// $ExpectError
abiCoder.decodeLog([null],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    345,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    [345],
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    ['string'],
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    true,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    null,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    // $ExpectError
    undefined,
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    // $ExpectError
    345);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    // $ExpectError
    [345]);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    // $ExpectError
    null);

abiCoder.decodeLog(
    [
        {
            type: 'string',
            name: 'myString'
        }, {
            type: 'uint256',
            name: 'myNumber',
            indexed: true
        }, {
            type: 'uint8',
            name: 'mySmallNumber',
            indexed: true
        }
    ],
    `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000
     000000000000000000000000000000000000000000000000748656c6c6f2521000000000000000000
     00000000000000000000000000000000`,
    // $ExpectError
    undefined);
