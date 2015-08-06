var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');
var net = require('./helpers/FakeIpcRequest')

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var IpcProvider = SandboxedModule.require('../lib/web3/ipcprovider', {
    requires: {
        'bignumber.js': require('bignumber.js'), 
    }
});

describe('lib/web3/ipcprovider', function () {
    describe('send', function () {
        it('should send basic request', function () {
            var provider = new IpcProvider('', net);
            var result = provider.send({id: 1, method: 'eth_test'});

            assert.isObject(result);
        });
    });

    describe('sendAsync', function () {
        it('should send basic async request', function (done) {
            var provider = new IpcProvider('', net);
            provider.sendAsync({id: 1, method: 'eth_test'}, function (err, result) {
                assert.isObject(result);
                done();
            });
        }); 
    });

    describe('isConnected', function () {
        it('should return a boolean', function () {
            var provider = new IpcProvider('', net);

            assert.isBoolean(provider.isConnected());
        });

        it('should return false', function () {
            var provider = new IpcProvider('', net);

            provider.connection.writable = false;

            assert.isFalse(provider.isConnected());
        });

        it('should return true, when a net handle is set', function () {
            var provider = new IpcProvider('', net);

            provider.connection.writable = true;

            assert.isTrue(provider.isConnected());
        }); 
    });
});

