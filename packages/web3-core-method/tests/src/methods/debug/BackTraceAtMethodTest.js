import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import BackTraceAtMethod from '../../../../src/methods/debug/BackTraceAtMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * BackTraceAtMethod test
 */
describe('BackTraceAtMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new BackTraceAtMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_backtraceAt');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
