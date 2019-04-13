import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import VerbosityMethod from '../../../../src/methods/debug/VerbosityMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * VerbosityMethod test
 */
describe('VerbosityMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new VerbosityMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_verbosity');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
