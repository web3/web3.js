import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTxpoolInspectMethod from '../../../../src/methods/txpool/GetTxpoolInspectMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetTxpoolInspectMethod test
 */
describe('GetTxpoolInspectMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTxpoolInspectMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_inspect');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
