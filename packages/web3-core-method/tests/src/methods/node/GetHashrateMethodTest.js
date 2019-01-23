import * as Utils from 'web3-utils';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetHashrateMethod from '../../../../src/methods/node/GetHashrateMethod';

// Mocks
jest.mock('Utils');

/**
 * GetHashrateMethod test
 */
describe('GetHashrateMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetHashrateMethod(Utils, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_hashrate');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
