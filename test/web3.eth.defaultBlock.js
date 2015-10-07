var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var web3 = new Web3();

describe('web3.eth', function () {
    describe('defaultBlock', function () {
        it('should check if defaultBlock is set to proper value', function () {
            assert.equal(web3.eth.defaultBlock, 'latest');
        });
    });
});

