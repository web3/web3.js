import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockByNumberMethod from '../../../../src/methods/debug/TraceBlockByNumberMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * TraceBlockByNumberMethod test
 */
describe('TraceBlockByNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockByNumberMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlockByNumber');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
