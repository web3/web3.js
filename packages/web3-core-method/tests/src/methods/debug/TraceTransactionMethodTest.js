import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceTransactionMethod from '../../../../src/methods/debug/TraceTransactionMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * TraceTransactionMethod test
 */
describe('TraceTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceTransactionMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceTransaction');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
