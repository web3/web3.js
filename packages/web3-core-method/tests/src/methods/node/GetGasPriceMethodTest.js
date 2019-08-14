import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetGasPriceMethod from '../../../../src/methods/node/GetGasPriceMethod';

/**
 * GetGasPriceMethod test
 */
describe('GetGasPriceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetGasPriceMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_gasPrice');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('1000')).toHaveProperty('bigNumber', true);
    });
});
