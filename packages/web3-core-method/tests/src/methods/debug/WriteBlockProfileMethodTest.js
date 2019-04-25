import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import WriteBlockProfileMethod from '../../../../src/methods/debug/WriteBlockProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * WriteBlockProfileMethod test
 */
describe('WriteBlockProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new WriteBlockProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_writeBlockProfile');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
