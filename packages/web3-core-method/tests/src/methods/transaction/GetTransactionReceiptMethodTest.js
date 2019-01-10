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
        method = new GetTransactionReceiptMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(GetTransactionReceiptMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_getTransactionReceipt', () => {
        expect(method.rpcMethod).toEqual('eth_getTransactionReceipt');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
