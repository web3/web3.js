import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionReceiptMethod from '../../../../src/methods/transaction/GetTransactionReceiptMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetTransactionReceiptMethod test
 */
describe('GetTransactionReceiptMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionReceiptMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionReceipt');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionReceiptFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionReceiptFormatter).toHaveBeenCalledWith({});
    });

    it('afterExecution should return null', () => {
        expect(method.afterExecution(null)).toEqual(null);
    });
});
