var chai   = require('chai');
var assert = chai.assert;
var utils = require('../../lib/utils/utils.js');
var BigNumber = require('bignumber.js');

/* globals describe, it */

var tests = [
    { value: function () {}, is: false},
    { value: new Function(), is: false},
    { value: 'function', is: false},
    { value: {}, is: false},
    { value: new String('hello'), is: false},
    { value: new BigNumber(0), is: true},
    { value: 132, is: false},
    { value: '0x12', is: false},

];

describe('utils', function () {
    describe('isBigNumber', function () {
        tests.forEach(function (test) {
            it('should test if value ' + test.func + ' is BigNumber: ' + test.is, function () {
                assert.equal(utils.isBigNumber(test.value), test.is);
            });
        });   
    });
});
