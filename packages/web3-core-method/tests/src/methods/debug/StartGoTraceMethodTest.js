import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartGoTraceMethod from '../../../../src/methods/debug/StartGoTraceMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StartGoTraceMethod test
 */
describe('StartGoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartGoTraceMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_startGoTrace');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
