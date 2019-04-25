import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import WriteMemProfileMethod from '../../../../src/methods/debug/WriteMemProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * WriteMemProfileMethod test
 */
describe('WriteMemProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new WriteMemProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_writeMemProfile');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
