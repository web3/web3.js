var assert = require('assert');
var formatters = require('../packages/web3-core-helpers/src/formatters.js');

describe('outputTransactionReceiptFormatter', function() {

    it('call outputTransactionReceiptFormatter with a valid receipt', function() {
        var receipt = {
            status: '0x0',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        assert.deepEqual(formatters.outputTransactionReceiptFormatter(receipt), {
            status: false,
            cumulativeGasUsed: 256,
            gasUsed: 256,
            blockNumber: '256',
            transactionIndex: 10,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputTransactionReceiptFormatter with a valid receipt and logs', function() {
        var receipt = {
            status: '0x0',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            logs: [{}]
        };

        assert.deepEqual(formatters.outputTransactionReceiptFormatter(receipt), {
            status: false,
            cumulativeGasUsed: 256,
            gasUsed: 256,
            blockNumber: '256',
            transactionIndex: 10,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
            logs: [
                {
                    blockNumber: undefined,
                    id: null,
                    logIndex: undefined,
                    transactionIndex: undefined
                }
            ]
        });
    });

    it('call outputTransactionReceiptFormatter when status is "0x1"', function() {
        var receipt = {
            status: '0x1',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        assert.equal(formatters.outputTransactionReceiptFormatter(receipt).status, true)
    });

    it('call outputTransactionReceiptFormatter when status is "0x01"', function() {
        var receipt = {
            status: '0x01',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        assert.equal(formatters.outputTransactionReceiptFormatter(receipt).status, true)
    });

    it('call outputTransactionReceiptFormatter when status is "undefined"', function() {
        var receipt = {
            status: undefined,
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        assert.equal(formatters.outputTransactionReceiptFormatter(receipt).status, undefined)
    });

    it('call outputTransactionReceiptFormatter when status is "null"', function() {
        var receipt = {
            status: null,
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        assert.equal(formatters.outputTransactionReceiptFormatter(receipt).status, null)
    });
});
