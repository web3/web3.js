import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetCoinbaseMethod from '../../../../src/methods/node/GetCoinbaseMethod';

// Mocks
jest.mock('web3-utils');

/**
 * GetCoinbaseMethod test
 */
describe('GetCoinbaseMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCoinbaseMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_coinbase');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });
});
