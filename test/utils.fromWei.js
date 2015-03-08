var assert = require('assert');
var utils = require('../lib/utils.js');
var BigNumber = require('bn.js');

describe('utils', function() {
    describe('toWei', function() {
        it('integers should return the correct value', function() {

            assert.equal(utils.fromWei(1000000000000000000, 'wei'), '1000000000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'kwei'), '1000000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'mwei'), '1000000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'gwei'), '1000000000');
            assert.equal(utils.fromWei(1000000000000000000, 'szabo'), '1000000');
            assert.equal(utils.fromWei(1000000000000000000, 'finney'), '1000');
            assert.equal(utils.fromWei(1000000000000000000, 'ether'), '1');
            assert.equal(utils.fromWei(new BigNumber(1000000000000000000), 'ether'), '1');
            assert.equal(utils.fromWei(111111111111111111111, 'ether'), '111');

        });

        it('decimal should return the correct value', function() {
            assert.equal(utils.fromWei(1111111111111111111, 'ether'), '1.1');

            assert.equal(utils.fromWei(1100000000000000000, 'ether'), '1.1');
            assert.equal(utils.fromWei(1000000000000000000, 'kether'), '0.001');
            assert.equal(utils.fromWei(1000000000000000000, 'grand'), '0.001');
            assert.equal(utils.fromWei(1000000000000000000, 'mether'), '0.000001');
            assert.equal(utils.fromWei(1000000000000000000, 'gether'), '0.000000001');
            assert.equal(utils.fromWei(1000000000000000000, 'tether'), '0.000000000001');
        });

        it('throws exception for invalid units', function() {
            assert.throws(function() {
                    utils.fromWei(1000000000000000000, 'yooo')
                },
                /Invalid Unit/);
        });
    });
});
