import { assert } from 'chai';
import Eth from '../packages/web3-eth';

const eth = new Eth();

const setValue = 123;

describe('web3.eth', () => {
    describe('defaultBlock', () => {
        it('should check if defaultBlock is set to proper value', () => {
            assert.equal(eth.defaultBlock, 'latest');
            assert.equal(eth.personal.defaultBlock, 'latest');
            assert.equal(eth.Contract.defaultBlock, 'latest');
            assert.equal(eth.getCode.method.defaultBlock, 'latest');
        });
        it('should set defaultBlock for all sub packages is set to proper value, if Eth package is changed', () => {
            eth.defaultBlock = setValue;

            assert.equal(eth.defaultBlock, setValue);
            assert.equal(eth.personal.defaultBlock, setValue);
            assert.equal(eth.Contract.defaultBlock, setValue);
            assert.equal(eth.getCode.method.defaultBlock, setValue);
        });
    });
});
