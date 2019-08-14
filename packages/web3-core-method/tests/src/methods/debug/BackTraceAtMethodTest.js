import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import BackTraceAtMethod from '../../../../src/methods/debug/BackTraceAtMethod';

/**
 * BackTraceAtMethod test
 */
describe('BackTraceAtMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new BackTraceAtMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_backtraceAt');

        expect(method.parametersAmount).toEqual(1);
    });
});
