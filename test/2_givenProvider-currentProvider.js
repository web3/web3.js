var chai = require('chai');
var assert = chai.assert;
var decache = require('decache');

describe('Web3.providers.currentProvider', function () {

    // Setting of 'global.' requires a deep reset
    beforeEach(function(){
        decache('../packages/@redbud-hk/web3');
        decache('../packages/@redbud-hk/web3-eth');
        decache('../packages/@redbud-hk/web3-bzz');
    });

    describe('should be set if web3.currentProvider is available', function () {
        beforeEach(function(){
            global.web3 = {currentProvider: {bzz: 'http://givenProvider:8501'}};
        });

        it('when instantiating Web3', function () {
            var Web3 = require('../packages/@redbud-hk/web3');
            assert.deepEqual(Web3.givenProvider, global.web3.currentProvider);
        });

        it('when instantiating Eth', function () {
            var Eth = require('../packages/@redbud-hk/web3-eth');
            assert.deepEqual(Eth.givenProvider, global.web3.currentProvider);
        });
    });
});

