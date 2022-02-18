var chai = require('chai');
var utils = require('../packages/web3-utils');
var assert = require('assert');

describe('lib/utils/utils', function () {
  describe('toTinybar', function () {
    it('should return the correct value', function () {
      chai.assert.equal(utils.toTinybar('1', 'Tinybar'), '1');
      chai.assert.equal(utils.toTinybar('1', 'Microbar'), '100');
      chai.assert.equal(utils.toTinybar('1', 'Millibar'), '100000');
      chai.assert.equal(utils.toTinybar('1', 'Hbar'), '100000000');
      chai.assert.equal(utils.toTinybar('1', 'Kilobar'), '100000000000');
      chai.assert.equal(utils.toTinybar('1', 'Megabar'), '100000000000000');
      chai.assert.equal(utils.toTinybar('1', 'Gigabar'), '100000000000000000');

      chai.assert.throws(function () { utils.toTinybar(1, 'error throw'); }, Error);
    });

    it('should verify "number" arg is string or BN', function () {
      try {
        utils.toTinybar(1, 'Tinybar')
        assert.fail();
      } catch (error) {
        assert(error.message.includes('Please pass numbers as strings'))
      }
    });

    // toTinybar returns string when given string, BN when given BN
    it('should return the correct type', function () {
      var hbarString = '1';
      var hbarBN = utils.toBN(hbarString);

      var bn = utils.toTinybar(hbarBN);
      assert(utils.isBN(bn));
      assert(typeof utils.toTinybar(hbarString) === 'string');
    })
  });
});
