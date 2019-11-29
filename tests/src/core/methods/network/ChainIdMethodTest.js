import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ChainIdMethod from '../../../../src/methods/network/ChainIdMethod';

// Mocks
jest.mock('web3-utils');

/**
 * ChainIdMethod test
 */
describe('ChainIdMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ChainIdMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_chainId');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(61);

        expect(method.afterExecution('0x0')).toEqual(61);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
