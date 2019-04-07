import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTxpoolStatusMethod from '../../../../src/methods/txpool/GetTxpoolStatusMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * GetTxpoolStatusMethod test
 */
describe('GetTxpoolStatusMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTxpoolStatusMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_status');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
