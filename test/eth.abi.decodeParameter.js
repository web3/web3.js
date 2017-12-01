import { assert } from 'chai';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [
    {
        params: ['uint256', '0x0000000000000000000000000000000000000000000000000000000000000010'],
        result: '16'
    },
    {
        params: ['string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
        result: 'Hello!%!'
    }
];

describe('decodeParameter', () => {
    tests.forEach((test) => {
        it('should convert correctly', () => {
            assert.equal(web3.eth.abi.decodeParameter(...test.params), test.result);
        });
    });
});
