var chai = require('chai');
var utils = require('../packages/web3-utils');
var assert = require('assert');

describe('lib/utils/utils', function () {
  describe('fromTinybar', function () {
    it('should return the correct value', function () {
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Tinybar'), '1000000000000000000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Microbar'), '10000000000000000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Millibar'), '10000000000000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Hbar'), '10000000000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Kilobar'), '10000000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Megabar'), '10000');
      chai.assert.equal(utils.fromTinybar('1000000000000000000', 'Gigabar'), '10');
    });

    it('should verify "number" arg is string or BN', function () {
      try {
        utils.fromTinybar(100000000000, 'Hbar')
        assert.fail();
      } catch (error) {
        assert(error.message.includes('Please pass numbers as strings'))
      }
    })
    // fromTinybar always returns string
    it('should return the correct type', function () {
      var hbarString = '100000000000000000';
      var hbarBN = utils.toBN(hbarString);

      assert(typeof utils.fromTinybar(hbarString) === 'string');
      assert(typeof utils.fromTinybar(hbarBN) === 'string');
    })
  });
});
