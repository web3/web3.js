var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers').formatters;

describe('InputLogFormatterTest', function() {

    it('call inputLogFormatter with a valid log', function() {
        var log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with numerical from/to blocks', function() {
        var log = {
            fromBlock: 1,
            toBlock: 2,
            topics: ['0x0'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: '0x1',
            toBlock: '0x2',
            topics: ['0x0'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with zero valued from/to blocks', function() {
        var log = {
            fromBlock: 0,
            toBlock: 0,
            topics: ['0x0'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: '0x0',
            toBlock: '0x0',
            topics: ['0x0'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with a array of addresses in the log', function() {
        var log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: [
                '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
                '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
            ]
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: [
                '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
            ]
        });
    });

    it('call inputLogFormatter with an topic item of null', function() {
        var log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: [null],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: [null],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with an topic item that does not start with "0x"', function() {
        var log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['00'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        assert.deepEqual(formatters.inputLogFormatter(log), {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x3030'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });
});
