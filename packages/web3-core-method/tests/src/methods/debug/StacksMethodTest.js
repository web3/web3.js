import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StacksMethod from '../../../../src/methods/debug/StacksMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StacksMethod test
 */
describe('StacksMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StacksMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_stacks');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
