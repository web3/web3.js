import {ChainIdMethod, GetGasPriceMethod, GetTransactionCountMethod} from 'web3-core-method';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import MethodFactory from '../../../src/factories/MethodFactory';

jest.mock('Utils');
jest.mock('formatters');

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(methodFactory.utils).toEqual(Utils);

        expect(methodFactory.formatters).toEqual(formatters);
    });

    it('JSON-RPC methods check', () => {
        expect(methodFactory.methods).toEqual({
            getChainId: ChainIdMethod,
            getGasPrice: GetGasPriceMethod,
            getTransactionCount: GetTransactionCountMethod
        });
    });
});
