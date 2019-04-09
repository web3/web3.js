import * as Utils from 'conflux-web-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetCoinbaseMethod from '../../../../src/methods/node/GetCoinbaseMethod';

// Mocks
jest.mock('conflux-web-utils');

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
