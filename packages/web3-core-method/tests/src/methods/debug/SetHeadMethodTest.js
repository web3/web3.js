import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetHeadMethod from '../../../../src/methods/debug/SetHeadMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetHeadMethod test
 */
describe('SetHeadMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetHeadMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_setHead');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
