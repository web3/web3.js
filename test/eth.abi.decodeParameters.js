import { assert } from 'chai';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [
    {
        params: [
            ['string', 'uint256'],
            '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
        ],
        result: {
            0: 'Hello!%!',
            1: '234',
            __length__: 2
        }
    },
    {
        params: [
            [
                {
                    type: 'string',
                    name: 'myString'
                },
                {
                    type: 'uint256',
                    name: 'myNumber'
                }
            ],
            '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
        ],
        result: {
            0: 'Hello!%!',
            1: '234',
            myString: 'Hello!%!',
            myNumber: '234',
            __length__: 2
        }
    }
];

describe('decodeParameters', () => {
    tests.forEach((test) => {
        it('should convert correctly', () => {
            assert.deepEqual(web3.eth.abi.decodeParameters(...test.params), test.result);
        });
    });
});
