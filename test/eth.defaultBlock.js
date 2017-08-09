var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var setValue = 123;

describe('web3.eth', function () {
    describe('defaultBlock', function () {
        it('should check if defaultBlock is set to proper value', function () {
            assert.equal(eth.defaultBlock, 'latest');
            assert.equal(eth.personal.defaultBlock, 'latest');
            assert.equal(eth.Contract.defaultBlock, 'latest');
            assert.equal(eth.getCode.method.defaultBlock, 'latest');
        });
        it('should set defaultBlock for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.defaultBlock = setValue;

            assert.equal(eth.defaultBlock, setValue);
            assert.equal(eth.personal.defaultBlock, setValue);
            assert.equal(eth.Contract.defaultBlock, setValue);
            assert.equal(eth.getCode.method.defaultBlock, setValue);
        });
    });
});

