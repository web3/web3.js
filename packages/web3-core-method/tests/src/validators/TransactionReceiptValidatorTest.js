import * as Utils from 'web3-utils';
import TransactionReceiptValidator from '../../../src/validators/TransactionReceiptValidator';

// Mocks
jest.mock('Utils');

/**
 * TransactionReceiptValidator test
 */
describe('TransactionReceiptValidatorTest', () => {
    let transactionReceiptValidator, receipt, method;

    beforeEach(() => {
        receipt = {
            status: true,
            outOfGas: false,
            gasUsed: 100
        };

        method = {};
        method.utils = Utils;

        transactionReceiptValidator = new TransactionReceiptValidator();
    });

    it('calls validate and returns true', () => {
        Utils.hexToNumber.mockReturnValueOnce(110);

        method.parameters = [{
            gas: 110
        }];

        expect(
            transactionReceiptValidator.validate(receipt, method)
        ).toEqual(true);

        expect(Utils.hexToNumber).toHaveBeenCalledWith(110);
    });

    it(
        'calls validate and returns error because of invalid gasUsage',
        () => {
            Utils.hexToNumber.mockReturnValueOnce(100);

            method.parameters = [{
                gas: 110
            }];

            const error = transactionReceiptValidator.validate(receipt, method);

            expect(error).toBeInstanceOf(Error);

            expect(error.message).toEqual(
                `Transaction ran out of gas. Please provide more gas:\n${JSON.stringify(receipt, null, 2)}`
            );

            expect(Utils.hexToNumber).toHaveBeenCalledWith(110);
        }
    );

    it('calls validate and returns error because the EVM has reverted it', () => {
        Utils.hexToNumber.mockReturnValueOnce(110);

        method.parameters = [{
            gas: 101
        }];

        receipt.status = false;

        const error = transactionReceiptValidator.validate(receipt, method);

        expect(error).toBeInstanceOf(Error);

        expect(error.message).toEqual(`Transaction has been reverted by the EVM:\n${JSON.stringify(receipt, null, 2)}`);

        expect(Utils.hexToNumber).toHaveBeenCalledWith(101);
    });
});
