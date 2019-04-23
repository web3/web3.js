import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetBlockRlpMethod from '../../../../src/methods/debug/GetBlockRlpMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetBlockRlpMethod test
 */
describe('GetBlockRlpMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockRlpMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_getBlockRlp');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
