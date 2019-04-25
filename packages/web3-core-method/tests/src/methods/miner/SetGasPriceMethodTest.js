import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetGasPriceMethod from '../../../../src/methods/miner/SetGasPriceMethod';

/**
 * SetGasPriceMethod test
 */
describe('SetGasPriceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetGasPriceMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setGasPrice');

        expect(method.parametersAmount).toEqual(1);
    });
});
