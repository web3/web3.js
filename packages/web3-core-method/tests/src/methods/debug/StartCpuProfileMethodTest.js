import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartCpuProfileMethod from '../../../../src/methods/debug/StartCpuProfileMethod';

/**
 * StartCpuProfileMethod test
 */
describe('StartCpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartCpuProfileMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_startCPUProfile');

        expect(method.parametersAmount).toEqual(1);
    });
});
