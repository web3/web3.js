import {formatters} from 'web3-core-helpers';
import GetTransactionReceiptMethod from '../../../../src/methods/transaction/GetTransactionReceiptMethod';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionReceiptMethod test
 */
describe('GetTransactionReceiptMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionReceiptMethod({}, {}, formatters);
    });

    it('rpcMethod should return eth_getTransactionReceipt', () => {
        expect(method.rpcMethod)
            .toBe('eth_getTransactionReceipt');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter
            .mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter)
            .toHaveBeenCalledWith({});
    });
});
