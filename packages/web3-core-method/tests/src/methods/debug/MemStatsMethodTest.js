import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import MemStatsMethod from '../../../../src/methods/debug/MemStatsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * MemStatsMethod test
 */
describe('MemStatsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new MemStatsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_memStats');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
