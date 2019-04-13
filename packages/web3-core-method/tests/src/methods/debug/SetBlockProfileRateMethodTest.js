import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetBlockProfileRateMethod from '../../../../src/methods/debug/SetBlockProfileRateMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetBlockProfileRateMethod test
 */
describe('SetBlockProfileRateMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetBlockProfileRateMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_setBlockProfileRate');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
