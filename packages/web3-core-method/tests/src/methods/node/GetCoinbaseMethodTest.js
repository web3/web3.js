import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetCoinbaseMethod from '../../../../src/methods/node/GetCoinbaseMethod';

/**
 * GetCoinbaseMethod test
 */
describe('GetCoinbaseMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCoinbaseMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_coinbase');

        expect(method.parametersAmount).toEqual(0);
    });
});
