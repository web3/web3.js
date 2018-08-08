var chai = require('chai');
var assert = chai.assert;
var formatters = require('../lib/solidity/formatters.js');

describe('formatters', function () {
    describe('formatInputDynamicBytes', function () {
        it('should encode even length strings correctly', function () {
            var result = formatters.formatInputDynamicBytes('0xabcd')
            assert.strictEqual(
                result.value,
                '0000000000000000000000000000000000000000000000000000000000000002' +
                'abcd000000000000000000000000000000000000000000000000000000000000'
            );
        });
        it('should encode odd length strings correctly', function () {
            var result = formatters.formatInputDynamicBytes('0xabcde');
            assert.strictEqual(
                result.value,
                '0000000000000000000000000000000000000000000000000000000000000003' +
                '0abcde0000000000000000000000000000000000000000000000000000000000'
            );
        });
    });
});
