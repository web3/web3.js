var chai = require('chai');
var assert = chai.assert;
var soliditySha3Raw = require('../packages/web3-utils').soliditySha3Raw;

describe('web3.soliditySha3Raw', function () {
    it('should return the sha3 hash of a empty string with hex prefix', function () {
        assert.deepEqual(
            soliditySha3Raw(
                {t: 'string', v: ''}
            ),
            '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        );
    });

    it('should return the expected sha3 hash with hex prefix', function () {
        assert.deepEqual(soliditySha3Raw(
            'Hello!%',
            2345676856,
            '2342342342342342342345676856',
            'Hello!%',
            false
        ), '0x7eb45eb9a0e1f6904514bc34c8b43e71c2e1f96f21b45ea284a0418cb351ec69');
    });
});
