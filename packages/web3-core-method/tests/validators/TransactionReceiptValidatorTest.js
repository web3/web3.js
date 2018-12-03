import TransactionReceiptValidator from '../../src/validators/TransactionReceiptValidator';

/**
 * TransactionReceiptValidator test
 */
describe('TransactionReceiptValidatorTest', () => {
    let transactionReceiptValidator, receipt;

    beforeEach(() => {
        receipt = {
            status: true,
            outOfGas: false,
            gasUsed: 100
        };

        transactionReceiptValidator = new TransactionReceiptValidator();
    });

    it('calls validate and returns true', () => {
        expect(
            transactionReceiptValidator.validate(
                receipt,
                [
                    {
                        gas: 100
                    }
                ]
            )
        ).toBeTruthy();
    });

    it('calls validate and returns error because if invalid gasUsage', () => {
        const error = transactionReceiptValidator.validate(
            receipt,
            [
                {
                    gas: 100
                }
            ]
        );

        expect(error)
            .toBeInstanceOf(Error);

        expect(error.message)
            .toBe(`Transaction ran out of gas. Please provide more gas:\n${JSON.stringify(receipt, null, 2)}`);
    });

    it('calls validate and returns error because the EVM has reverted it', () => {
        receipt.status = false;

        const error = transactionReceiptValidator.validate(
            receipt,
            [
                {
                    gas: 100
                }
            ]
        );

        expect(error)
            .toBeInstanceOf(Error);

        expect(error.message)
            .toBe(`Transaction has been reverted by the EVM:\n${JSON.stringify(receipt, null, 2)}`);
    });
});
