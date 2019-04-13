import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopCpuProfileMethod from '../../../../src/methods/debug/StopCpuProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StopCpuProfileMethod test
 */
describe('StopCpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopCpuProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stopCPUProfile');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
