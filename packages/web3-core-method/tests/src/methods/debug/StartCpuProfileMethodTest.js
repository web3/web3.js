import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartCpuProfileMethod from '../../../../src/methods/debug/StartCpuProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StartCpuProfileMethod test
 */
describe('StartCpuProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartCpuProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_startCPUProfile');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
