import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartGoTraceMethod from '../../../../src/methods/debug/StartGoTraceMethod';

/**
 * StartGoTraceMethod test
 */
describe('StartGoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartGoTraceMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_startGoTrace');

        expect(method.parametersAmount).toEqual(1);
    });
});
