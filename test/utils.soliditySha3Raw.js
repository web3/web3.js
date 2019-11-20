var chai = require('chai');
var assert = chai.assert;
var soliditySha3Raw = require('../packages/web3-utils').soliditySha3Raw;

describe('web3.soliditySha3Raw', function () {
    it('should return the sha3 hash with hex prefix', function() {
        assert.deepEqual(soliditySha3Raw({t: 'string', v: ''}), '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
    });
});
