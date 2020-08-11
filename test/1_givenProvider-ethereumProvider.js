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

    describe('should be set if window.ethereum is available', function () {
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

    describe('should use request() if available, otherwise falling back to sendAsync() and send()', function () {

        after(function(){
            global.ethereum = undefined;
        })

        it('should use request()', async function () {
            global.ethereum = {
                request: async () => { return '0x64' },
                sendAsync: () => { throw new Error('used sendAsync') }, 
                send: () => { throw new Error('used send') }
            };
            const Web3 = require('../packages/web3');
            const web3 = new Web3(Web3.givenProvider);
            const blockNumber = await web3.eth.getBlockNumber();
            assert.equal(blockNumber, 100)
        });

        it('should use sendAsync()', async function () {
            global.ethereum = {
                sendAsync: (args, callback) => { return callback(null, {jsonrpc: '2.0', id: 0, result: 101}) }, 
                send: () => { throw new Error('used send') }
            };
            const Web3 = require('../packages/web3');
            const web3 = new Web3(Web3.givenProvider);
            const blockNumber = await web3.eth.getBlockNumber();
            assert.equal(blockNumber, 101)
        });

        it('should use send()', async function () {
            global.ethereum = {
                send: (args, callback) => { return callback(null, {jsonrpc: '2.0', id: 0, result: 102}) }
            };
            const Web3 = require('../packages/web3');
            const web3 = new Web3(Web3.givenProvider);
            const blockNumber = await web3.eth.getBlockNumber();
            assert.equal(blockNumber, 102)
        });
        
        it('should error without any request or send method', async function () {
            global.ethereum = {};
            const Web3 = require('../packages/web3');
            const web3 = new Web3(Web3.givenProvider);
            try {
                await web3.eth.getBlockNumber();
                assert.fail('should error');
            } catch (error) {
                assert.equal(error.message, 'Provider does not have a request or send method to use.');
            }
        });
    });
});

