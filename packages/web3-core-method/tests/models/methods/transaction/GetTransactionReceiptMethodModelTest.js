import {formatters} from 'web3-core-helpers';
import GetTransactionReceiptMethodModel from '../../../../src/models/methods/transaction/GetTransactionReceiptMethodModel';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionReceiptMethodModel test
 */
describe('GetTransactionReceiptMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetTransactionReceiptMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_getTransactionReceipt', () => {
        expect(model.rpcMethod)
            .toBe('eth_getTransactionReceipt');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        expect(model.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter)
            .toHaveBeenCalledWith({});
    });
});
