var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

// Expect 2 chars per bytes plus `0x` prefix
var tests = [
    { value:  0, expected: { prefix: '0x', type: 'string', length: 2 }},
    { value: 15, expected: { prefix: '0x', type: 'string', length: 32 }},
    { value: 16, expected: { prefix: '0x', type: 'string', length: 34 }}
];

describe('lib/utils/utils', function () {
    describe('randomHex', function () {
        tests.forEach(function (test) {
            it('should turn ' + test.value + ' to ' + test.expected, function () {
                var result = utils.randomHex(test.value);

                assert.strictEqual(typeof result, test.expected.type);
                assert.strictEqual(result.slice(0,2), test.expected.prefix);
                assert.strictEqual(result.length, test.expected.length);
            });
        });
    });
});
