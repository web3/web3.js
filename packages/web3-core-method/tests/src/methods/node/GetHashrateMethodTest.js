import * as Utils from 'web3-utils';
import GetHashrateMethod from '../../../../src/methods/node/GetHashrateMethod';

// Mocks
jest.mock('Utils');

/**
 * GetHashrateMethod test
 */
describe('GetHashrateMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetHashrateMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetHashrateMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_hashrate', () => {
        expect(method.rpcMethod).toEqual('eth_hashrate');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
