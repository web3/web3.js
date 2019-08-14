import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopGoTraceMethod from '../../../../src/methods/debug/StopGoTraceMethod';

/**
 * StopGoTraceMethod test
 */
describe('StopGoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopGoTraceMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stopGoTrace');

        expect(method.parametersAmount).toEqual(0);
    });
});
