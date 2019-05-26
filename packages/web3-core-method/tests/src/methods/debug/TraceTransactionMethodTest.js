import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceTransactionMethod from '../../../../src/methods/debug/TraceTransactionMethod';

/**
 * TraceTransactionMethod test
 */
describe('TraceTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceTransactionMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceTransaction');

        expect(method.parametersAmount).toEqual(2);
    });
});
