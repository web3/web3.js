import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetGasPriceMethod from '../../../../src/methods/miner/SetGasPriceMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetGasPriceMethod test
 */
describe('SetGasPriceMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetGasPriceMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setGasPrice');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
