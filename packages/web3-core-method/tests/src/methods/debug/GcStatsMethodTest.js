import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GcStatsMethod from '../../../../src/methods/debug/GcStatsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GcStatsMethod test
 */
describe('GcStatsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GcStatsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_gcStats');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
