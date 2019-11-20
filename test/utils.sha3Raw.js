var chai = require('chai');
var assert = chai.assert;
var sha3Raw = require('../packages/web3-utils').sha3Raw;

describe('web3.sha3Raw', function () {
    it('should return the sha3 hash of null with hex prefix', function() {
        assert.deepEqual(sha3Raw(''), '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
    });
});
