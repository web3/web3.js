import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockFromFileMethod from '../../../../src/methods/debug/TraceBlockFromFileMethod';

/**
 * TraceBlockFromFileMethod test
 */
describe('TraceBlockFromFileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockFromFileMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlockFromFile');

        expect(method.parametersAmount).toEqual(2);
    });
});
