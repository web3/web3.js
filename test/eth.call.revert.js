var chai = require('chai');
var assert = chai.assert;
var FakeIpcProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');

describe('call revert', function () {
    var provider;
    var web3;

    beforeEach(function () {
        provider = new FakeIpcProvider();
        web3 = new Web3(provider);
        web3.eth.handleRevert = true;
    });

    it('Errors with revert reason string through MetaMask', async function() {
        provider.injectRawError({
          "code": -32603,
          "message": "execution reverted: DeadlineExpired",
          "data": {
            "originalError": {
              "code": 3,
              "data": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f446561646c696e65457870697265640000000000000000000000000000000000",
              "message": "execution reverted: DeadlineExpired"
            }
          }
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_call');
            assert.deepEqual(
                payload.params,
                [{
                    to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                    data: '0x23455654',
                    gas: '0xb',
                    gasPrice: '0xb'
                }, 'latest']
            );
        });

        var options = {
            to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
            data: '0x23455654',
            gas: 11,
            gasPrice: 11
        };

        try {
            await web3.eth.call(options, 'latest');
            assert.fail('call should have failed!');
        } catch (error) {
            assert.equal(error.reason, 'DeadlineExpired');
        }
    });

    it('Errors with revert reason string from Ganache through MetaMask', async function() {
        provider.injectRawError({
            "code": -32603,
            "message": "Internal JSON-RPC error.",
            "data": {
              "message": "VM Exception while processing transaction: revert ImproperState",
              "stack": "CallError: VM Exception while processing transaction: revert ImproperState\n    at Blockchain.simulateTransaction (C:\\Users\\nicos\\AppData\\Roaming\\npm\\node_modules\\ganache\\dist\\node\\1.js:2:82786)",
              "code": -32000,
              "name": "CallError",
              "data": "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d496d70726f706572537461746500000000000000000000000000000000000000"
            }
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'eth_call');
            assert.deepEqual(
                payload.params,
                [{
                    to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
                    data: '0x23455654',
                    gas: '0xb',
                    gasPrice: '0xb'
                }, 'latest']
            );
        });

        var options = {
            to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
            data: '0x23455654',
            gas: 11,
            gasPrice: 11
        };

        try {
            await web3.eth.call(options, 'latest');
            assert.fail('call should have failed!');
        } catch (error) {
            assert.equal(error.reason, 'ImproperState');
        }
    });
    
});
