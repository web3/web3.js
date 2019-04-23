import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import BlockProfileMethod from '../../../../src/methods/debug/BlockProfileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * BlockProfileMethod test
 */
describe('BlockProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new BlockProfileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_blockProfile');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
