var chai = require('chai');
var assert = chai.assert;

global.web3 = {
    currentProvider: {test: 'ethereumProvider'}
};


describe('Web3.providers.givenProvide', function () {
    describe('should be set if web3.currentProvider is available ', function () {

        it('when instantiating Web3', function () {

            var Web3 = require('../src/index.js');

            assert.deepEqual(Web3.providers.givenProvider, {test: 'ethereumProvider'});

        });

        it('when instantiating Eth', function () {

            var Eth = require('../packages/web3-eth');

            assert.deepEqual(Eth.providers.givenProvider, {test: 'ethereumProvider'});

        });

    });
});

