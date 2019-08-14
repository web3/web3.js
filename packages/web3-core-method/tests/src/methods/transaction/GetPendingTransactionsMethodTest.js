import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetPendingTransactionsMethod from '../../../../src/methods/transaction/GetPendingTransactionsMethod';

/**
 * GetPendingTransactionsMethod test
 */
describe('GetPendingTransactionsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPendingTransactionsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_pendingTransactions');

        expect(method.parametersAmount).toEqual(0);
    });

    it('calls afterExecution and returns the expected value', () => {
        expect(method.afterExecution([{status: false}])).toEqual([{status: true}]);
    });

    it('calls afterExecution with an empty array and returns the expected value', () => {
        expect(method.afterExecution([])).toEqual([]);
    });

    it('calls afterExecution with null and returns the expected value', () => {
        expect(method.afterExecution(null)).toEqual(null);
    });
});
