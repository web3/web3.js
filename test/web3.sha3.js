var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var sha3 = require('../lib/utils/sha3');
var web3 = new Web3();

var method = 'sha3';

describe('web3.sha3', function () {
    it('should return sha3 with hex prefix', function() {
	test1 = web3.sha3('test123');
	test2 = web3.sha3('test(int)');
	test3 = web3.sha3('sdffvkj');
	assert.deepEqual(test1, '0x' + sha3('test123'));
	assert.deepEqual(test2, '0x' + sha3('test(int)'));
	assert.deepEqual(test3, '0x' + sha3('sdffvkj'));
    });
});
