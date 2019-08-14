import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionReceiptMethod from '../../../../src/methods/transaction/GetTransactionReceiptMethod';

/**
 * GetTransactionReceiptMethod test
 */
describe('GetTransactionReceiptMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionReceiptMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionReceipt');

        expect(method.parametersAmount).toEqual(1);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution({})).toHaveProperty('empty', false);
    });

    it('afterExecution should return null', () => {
        expect(method.afterExecution(null)).toEqual(null);
    });
});
