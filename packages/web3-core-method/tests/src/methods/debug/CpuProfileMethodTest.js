import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import CpuProfileMethod from '../../../../src/methods/debug/CpuProfileMethod';

/**
 * CpuProfileMethod test
 */
describe('CpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new CpuProfileMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_cpuProfile');

        expect(method.parametersAmount).toEqual(2);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        method.parameters = [0, 1];

        method.beforeExecution();

        expect(method.parameters[1]).toEqual('0x1');
    });
});
