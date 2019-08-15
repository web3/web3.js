import {ChainIdMethod, GetGasPriceMethod, GetTransactionCountMethod} from 'web3-core-method';
import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory();
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            getChainId: ChainIdMethod,
            getGasPrice: GetGasPriceMethod,
            getTransactionCount: GetTransactionCountMethod
        });
    });
});
