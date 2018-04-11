var chai = require('chai');
var assert = chai.assert;
var net = require('net');

var Eth = require('../packages/web3-eth');
var Shh = require('../packages/web3-shh');
var Net = require('../packages/web3-net');
var Web3 = require('../packages/web3');


var tests = [{
    providerParams: ['http://localhost:8545'],
    providerType: 'HttpProvider',
    package: Web3
},{
    providerParams: ['HTTP://localhost:8545'],
    providerType: 'HttpProvider',
    package: Web3
},{
    providerParams: ['ws://localhost:8546'],
    providerType: 'WebsocketProvider',
    package: Web3
},{
    providerParams: ['WS://localhost:8546'],
    providerType: 'WebsocketProvider',
    package: Web3
},{
    providerParams: ['wss://user1:passw0rd@localhost:8546'],
    providerType: 'WebsocketProvider',
    package: Web3
},{
    providerParams: ['/.ethereum/my/path/geth.ipc', net],
    providerType: 'IpcProvider',
    package: Web3
},{
    providerParams: ['\\\\.\\pipe\\geth.ipc', net],
    providerType: 'IpcProvider',
    package: Web3
},{
    providerParams: ['://hello.com:1234'],
    package: Web3,
    error: true
},

    {
        providerParams: ['http://localhost:8545'],
        providerType: 'HttpProvider',
        package: Net
    },{
        providerParams: ['HTTP://localhost:8545'],
        providerType: 'HttpProvider',
        package: Net
    },{
        providerParams: ['ws://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Net
    },{
        providerParams: ['WS://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Net
    },{
        providerParams: ['/.ethereum/my/path/geth.ipc', net],
        providerType: 'IpcProvider',
        package: Net
    },{
        providerParams: ['\\\\.\\pipe\\geth.ipc', net],
        providerType: 'IpcProvider',
        package: Net
    },{
        providerParams: ['://hello.com:1234'],
        package: Net,
        error: true
    },

    {
        providerParams: ['http://localhost:8545'],
        providerType: 'HttpProvider',
        package: Shh
    },{
        providerParams: ['HTTP://localhost:8545'],
        providerType: 'HttpProvider',
        package: Shh
    },{
        providerParams: ['ws://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Shh
    },{
        providerParams: ['WS://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Shh
    },{
        providerParams: ['/.ethereum/my/path/geth.ipc', net],
        providerType: 'IpcProvider',
        package: Shh
    },{
        providerParams: ['\\\\.\\pipe\\geth.ipc', net],
        providerType: 'IpcProvider',
        package: Shh
    },{
        providerParams: ['://hello.com:1234'],
        package: Shh,
        error: true
    },

    {
        providerParams: ['http://localhost:8545'],
        providerType: 'HttpProvider',
        package: Eth
    },{
        providerParams: ['HTTP://localhost:8545'],
        providerType: 'HttpProvider',
        package: Eth
    },{
        providerParams: ['ws://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Eth
    },{
        providerParams: ['WS://localhost:8546'],
        providerType: 'WebsocketProvider',
        package: Eth
    },{
        providerParams: ['/.ethereum/my/path/geth.ipc', net],
        providerType: 'IpcProvider',
        package: Eth
    },{
        providerParams: ['\\\\.\\pipe\\geth.ipc', net],
        providerType: 'IpcProvider',
        package: Eth
    },{
        providerParams: ['://hello.com:1234'],
        package: Eth,
        error: true
    }];

describe('web3', function () {
    describe('automatic provider selection', function () {
        tests.forEach(function (test, index) {

            if(!test.error) {
                it('initiates on package level', function () {

                    var pkg = new test.package(test.providerParams[0], test.providerParams[1]);
                    assert.equal(pkg.currentProvider.constructor.name, test.providerType);

                });

                it('initiates using setProvider', function () {

                    var pkg = new test.package();
                    assert.equal(pkg.currentProvider, null);

                    pkg.setProvider.apply(pkg, test.providerParams);
                    assert.equal(pkg.currentProvider.constructor.name, test.providerType);

                });

            } else {
                it('can\'t autodetect the provider', function () {

                    assert.throws(function(){ new test.package(test.providerParams[0]); });


                });
                it('can\'t autodetect the provider when using setProvider', function () {

                    var pkg = new test.package();
                    assert.throws(function(){ pkg.setProvider(test.providerParams[0]); });


                });
            }
        });
    });
});

