import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopGoTraceMethod from '../../../../src/methods/debug/StopGoTraceMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StopGoTraceMethod test
 */
describe('StopGoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopGoTraceMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stopGoTrace');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
