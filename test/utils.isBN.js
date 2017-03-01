var chai = require('chai');
var utils = require('../packages/web3-utils');

var BigNumber = require('bn.js');

var assert = chai.assert;

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

describe('lib/utils/utils', function () {
    describe('isBigNumber', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.func + ' is BigNumber: ' + test.is, function () {
                assert.equal(utils.isBN(test.value), test.is);
            });
        });
    });
});
