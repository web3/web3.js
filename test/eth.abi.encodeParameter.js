import { assert } from 'chai';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [{
    params: ['uint256', '2345675643'],
    result: '0x000000000000000000000000000000000000000000000000000000008bd02b7b'
}, {
    params: ['bytes32', '0xdf3234'],
    result: '0xdf32340000000000000000000000000000000000000000000000000000000000'
}, {
    params: ['bytes32[]', ['0xdf3234', '0xfdfd']],
    result: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000'
}];

describe('encodeParameter', () => {
    tests.forEach((test) => {
        it('should convert correctly', () => {
            assert.equal(web3.eth.abi.encodeParameter(...test.params), test.result);
        });
    });
});
