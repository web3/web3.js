var chai = require('chai');
var assert = chai.assert;
var decache = require('decache');

describe('Web3.providers.givenProvider', function () {

    // Setting of 'global.' requires a deep reset
    beforeEach(function(){
        decache('../packages/web3');
        decache('../packages/web3-eth');
        decache('../packages/web3-bzz');
    });

    describe('should be set if window.ethereum is available ', function () {
        beforeEach(function(){
            global.ethereum = {bzz: 'http://givenProvider:8501'};
        });

        it('when instantiating Web3', function () {

            var Web3 = require('../packages/web3');

            assert.deepEqual(Web3.givenProvider, global.ethereum);

        });

        it('when instantiating Eth', function () {

            var Eth = require('../packages/web3-eth');

            assert.deepEqual(Eth.givenProvider, global.ethereum);

        });

        it('when instantiating Bzz', function () {

            var Bzz = require('../packages/web3-bzz');

            assert.deepEqual(Bzz.givenProvider, global.ethereum.bzz);

        });
    });

    describe('should be set if ethereumProvider is available ', function () {
        beforeEach(function(){
            global.ethereumProvider = {bzz: 'http://givenProvider:8500'};
        });

        it('when instantiating Web3', function () {

            var Web3 = require('../packages/web3');

            assert.deepEqual(Web3.givenProvider, global.ethereumProvider);

        });

        it('when instantiating Eth', function () {

            var Eth = require('../packages/web3-eth');

            assert.deepEqual(Eth.givenProvider, global.ethereumProvider);

        });

        it('when instantiating Bzz', function () {

            var Bzz = require('../packages/web3-bzz');

            assert.deepEqual(Bzz.givenProvider, global.ethereumProvider.bzz);

        });

    });
});

