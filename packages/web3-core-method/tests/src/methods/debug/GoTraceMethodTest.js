import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GoTraceMethod from '../../../../src/methods/debug/GoTraceMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GoTraceMethod test
 */
describe('GoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GoTraceMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_goTrace');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
