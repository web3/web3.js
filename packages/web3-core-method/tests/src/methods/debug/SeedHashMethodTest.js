import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SeedHashMethod from '../../../../src/methods/debug/SeedHashMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SeedHashMethod test
 */
describe('SeedHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SeedHashMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_seedHash');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
