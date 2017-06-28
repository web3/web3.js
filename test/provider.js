var chai = require('chai');
var assert = chai.assert;
var net = require('net');
var Web3 = require('../src/index');


var tests = [{
    providerParams: ['http://localhost:8545'],
    providerType: 'HttpProvider'
},{
    providerParams: ['ws://localhost:8546'],
    providerType: 'WebsocketProvider'
},{
    providerParams: ['/.ethereum/my/path/geth.ipc', net],
    providerType: 'IpcProvider'
},{
    providerParams: ['\\\\.\\pipe\\geth.ipc', net],
    providerType: 'IpcProvider'
}];

describe('web3', function () {
    describe('automatic provider selection', function () {
        tests.forEach(function (test, index) {
            it('initiates on package level', function () {

                var web3 = new Web3(test.providerParams[0], test.providerParams[1]);
                assert.equal(web3.currentProvider.constructor.name, test.providerType);

            });

            it('initiates using setProvider', function () {

                var web3 = new Web3();
                assert.equal(web3.currentProvider, null);

                web3.setProvider.apply(web3, test.providerParams);
                assert.equal(web3.currentProvider.constructor.name, test.providerType);

            });
        });
    });
});

