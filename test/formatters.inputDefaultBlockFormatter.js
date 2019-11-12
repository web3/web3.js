var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers').formatters;

var tests = [
    { value: 'genesis', expected: '0x0' },
    { value: 'latest', expected: 'latest' },
    { value: 'pending', expected: 'pending' },
    { value: 'earliest', expected: '0x0' },
    { value: 1, expected: '0x1' },
    { value: '0x1', expected: '0x1' }
];

describe('lib/web3/formatters', function () {
    describe('inputDefaultBlockNumberFormatter', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                assert.strictEqual(formatters.inputDefaultBlockNumberFormatter(test.value), test.expected);
            });
        });
    });
});



