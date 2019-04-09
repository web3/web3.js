import {ChainIdMethod, GetGasPriceMethod, GetTransactionCountMethod} from 'conflux-web-core-method';
import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import MethodFactory from '../../../src/factories/MethodFactory';

jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

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
