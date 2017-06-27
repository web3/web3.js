var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../src/index');


var tests = [{
    providerUrl: 'http://localhost:8545',
    providerType: 'http'
}];

describe('web3', function () {
    describe('automatic provider selection', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function (done) {

                web3.setProvider('http://localhost:8545');


            });
        });
    });
});

