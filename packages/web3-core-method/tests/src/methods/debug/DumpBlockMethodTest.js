import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import DumpBlockMethod from '../../../../src/methods/debug/DumpBlockMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * DumpBlockMethod test
 */
describe('DumpBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new DumpBlockMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_dumpBlock');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
