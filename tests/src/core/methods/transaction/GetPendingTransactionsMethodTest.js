import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetPendingTransactionsMethod from '../../../../src/methods/transaction/GetPendingTransactionsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetPendingTransactionsMethod test
 */
describe('GetPendingTransactionsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPendingTransactionsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_pendingTransactions');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('calls afterExecution and returns the expected value', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({status: true});

        expect(method.afterExecution([{status: false}])).toEqual([{status: true}]);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({status: false});
    });

    it('calls afterExecution with an empty array and returns the expected value', () => {
        expect(method.afterExecution([])).toEqual([]);
    });

    it('calls afterExecution with null and returns the expected value', () => {
        expect(method.afterExecution(null)).toEqual(null);
    });
});
