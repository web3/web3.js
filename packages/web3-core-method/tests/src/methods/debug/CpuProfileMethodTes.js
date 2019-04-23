import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import CpuProfileMethod from '../../../../src/methods/debug/CpuProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * CpuProfileMethod test
 */
describe('CpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new CpuProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_cpuProfile');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
