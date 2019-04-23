import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockMethod from '../../../../src/methods/debug/TraceBlockMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * TraceBlockMethod test
 */
describe('TraceBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlock');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
