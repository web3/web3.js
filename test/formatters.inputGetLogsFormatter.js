var chai = require('chai');
var assert = chai.assert;
var formatters = require('../lib/web3/formatters.js');

describe('formatters', function () {
    describe('inputGetLogsFormatter', function () {
        it('should return the correct value', function () {

            // input as strings and numbers
            assert.deepEqual(formatters.inputGetLogsFormatter({
               fromBlock: 2000,
                toBlock: 'latest'
            }), {
                fromBlock: '0x7d0',
                toBlock: 'latest'
            });

        });
    });
});

