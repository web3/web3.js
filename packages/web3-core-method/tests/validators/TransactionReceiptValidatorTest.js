var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var TransactionReceiptValidator = require('../../src/validators/TransactionReceiptValidator');

/**
 * TransactionReceiptValidator test
 */
describe('TransactionReceiptValidatorTest', function () {
    var transactionReceiptValidator;

    beforeEach(function () {
        transactionReceiptValidator = new TransactionReceiptValidator();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls validate and returns true', function () {
        expect(transactionReceiptValidator.validate(
            {
                status: true,
                outOfGas: false,
                gasUsed: 90
            },
            [
                {
                    gas: 100
                }
            ]
        )).to.be.true;
    });

    it('calls validate and returns error because if invalid gasUsage', function () {
        var error = transactionReceiptValidator.validate(
            {
                status: true,
                outOfGas: false,
                gasUsed: 100
            },
            [
                {
                    gas: 100
                }
            ]
        );


        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.have.string('Transaction ran out of gas. Please provide more gas:');
    });

    it('calls validate and returns error because the EVM has reverted it', function () {
        var error = transactionReceiptValidator.validate(
            {
                status: false,
                outOfGas: false,
                gasUsed: 100
            },
            [
                {
                    gas: 100
                }
            ]
        );


        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.have.string('Transaction has been reverted by the EVM:');
    });
});
