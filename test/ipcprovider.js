var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

var FakeIpcRequest = require('./helpers/FakeIpcRequest');
var net = new FakeIpcRequest();

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var IpcProvider = SandboxedModule.require('../packages/web3-providers-ipc', {
    requires: {
        'bn.js': require('bn.js'),
    },
    singleOnly: true
});

describe('web3-providers-ipc', function () {

    // oboe.js DOESNT WORK with FakeIpcProvider
    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new IpcProvider('', net);
            provider.send({id: 1, method: 'eth_test'}, function (err, result) {
                assert.isObject(result);
                done();
            });
        });

        // it('result is array', function () {
        //     var ipcProvider = new IpcProvider(
        //         '/Users/myuser/Library/Ethereum/geth.ipc', net);
        //     console.dir(ipcProvider.connection);
        //     // console.log(ipcProvider.connection.removeAllListeners('error'));
        // });
    });

    // describe.only('isConnected', function () {
    //     it('should return a boolean', function () {
    //         var provider = new IpcProvider('', net);
    //
    //         assert.isBoolean(provider.connected);
    //     });
    //
    //     it('should return false', function () {
    //         var provider = new IpcProvider('', net);
    //
    //         provider.connection.writable = false;
    //
    //         assert.isFalse(provider.connected);
    //     });
    //
    //     it('should return true, when a net handle is set', function () {
    //         var provider = new IpcProvider('', net);
    //
    //         provider.connected = true;
    //
    //         assert.isTrue(provider.connected);
    //     });
    // });
});

