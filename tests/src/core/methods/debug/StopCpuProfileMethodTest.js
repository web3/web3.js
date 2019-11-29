import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopCpuProfileMethod from '../../../../src/methods/debug/StopCpuProfileMethod';

/**
 * StopCpuProfileMethod test
 */
describe('StopCpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopCpuProfileMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stopCPUProfile');

        expect(method.parametersAmount).toEqual(0);
    });
});
