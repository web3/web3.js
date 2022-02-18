var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: function () { }, is: false },
    { value: new Function(), is: false },
    { value: 'function', is: false },
    { value: {}, is: false },
    { value: '', is: false },
    { value: 'test', is: false },
    { value: 'test.test.test', is: false },
    { value: '123.0.1234567890', is: false },
    { value: '0.123.1234567890', is: false },
    { value: '0.0.test1234567890', is: false },
    { value: '0.0.123test123', is: false },
    { value: '0.0.1234567890test', is: false },
    { value: '0.0.1234567890 test', is: false },
    { value: 'test.0.1234567890', is: false },
    { value: '0.test.1234567890', is: false },
    { value: '0.0.1234567890', is: true },
];

describe('lib/utils/utils', function () {
    describe('isHederaAddress', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.value + ' is hedera address: ' + test.is, function () {
                assert.equal(utils.isHederaAddress(test.value), test.is);
            });
        });
    });
});
