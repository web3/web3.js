import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockByHashMethod from '../../../../src/methods/debug/TraceBlockByHashMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * TraceBlockByHashMethod test
 */
describe('TraceBlockByHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockByHashMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlockByHash');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
