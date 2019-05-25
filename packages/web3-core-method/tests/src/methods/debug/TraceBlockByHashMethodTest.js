import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockByHashMethod from '../../../../src/methods/debug/TraceBlockByHashMethod';

/**
 * TraceBlockByHashMethod test
 */
describe('TraceBlockByHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockByHashMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlockByHash');

        expect(method.parametersAmount).toEqual(2);
    });
});
