import TransactionReceiptValidator from '../../src/validators/TransactionReceiptValidator';

/**
 * TransactionReceiptValidator test
 */
describe('TransactionReceiptValidatorTest', () => {
    let transactionReceiptValidator;

    beforeEach(() => {
        transactionReceiptValidator = new TransactionReceiptValidator();
    });

    it('calls validate and returns true', () => {
        expect(
            transactionReceiptValidator.validate(
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
            )
        ).toBeTruthy();
    });

    it('calls validate and returns error because if invalid gasUsage', () => {
        const error = transactionReceiptValidator.validate(
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

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Transaction ran out of gas. Please provide more gas:');
    });

    it('calls validate and returns error because the EVM has reverted it', () => {
        const error = transactionReceiptValidator.validate(
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

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Transaction has been reverted by the EVM:');
    });
});
