import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GoTraceMethod from '../../../../src/methods/debug/GoTraceMethod';

/**
 * GoTraceMethod test
 */
describe('GoTraceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GoTraceMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_goTrace');

        expect(method.parametersAmount).toEqual(2);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [0, 1];

        method.beforeExecution();

        expect(method.parameters[1]).toEqual('0x1');
    });
});
