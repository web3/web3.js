import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockMethod from '../../../../src/methods/debug/TraceBlockMethod';

/**
 * TraceBlockMethod test
 */
describe('TraceBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlock');

        expect(method.parametersAmount).toEqual(2);
    });
});
