import { assert } from 'chai';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [
    {
        params: [
            {
                name: 'myMethod',
                type: 'function',
                inputs: [
                    {
                        type: 'uint256',
                        name: 'myNumber'
                    },
                    {
                        type: 'string',
                        name: 'myString'
                    }
                ]
            }
        ],
        result: '0x24ee0097'
    },
    {
        params: [
            {
                name: 'myMethod',
                type: 'function',
                inputs: [
                    {
                        type: 'string',
                        name: 'myNumber'
                    },
                    {
                        type: 'bytes8',
                        name: 'myString'
                    }
                ]
            }
        ],
        result: '0x27b00c93'
    },
    {
        params: [
            {
                name: 'Somthing',
                type: 'function',
                inputs: [
                    {
                        type: 'uint16',
                        name: 'myNumber'
                    },
                    {
                        type: 'bytes',
                        name: 'myString'
                    }
                ]
            }
        ],
        result: '0x724ff7a1'
    },
    {
        params: [
            {
                name: 'something',
                type: 'function',
                inputs: []
            }
        ],
        result: '0xa7a0d537'
    }
];

describe('encodeFunctionSignature', () => {
    tests.forEach((test) => {
        it('should convert correctly', () => {
            assert.equal(web3.eth.abi.encodeFunctionSignature(...test.params), test.result);
        });
    });
});
