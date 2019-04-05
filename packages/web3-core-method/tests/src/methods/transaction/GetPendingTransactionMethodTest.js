import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetPendingTransactionMethod from '../../../../src/methods/transaction/GetPendingTransactionMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetPendingTransactionMethod test
 */
describe('GetPendingTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPendingTransactionMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_pendingTransactions');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
