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
        expect(GetHashrateMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return eth_hashrate', () => {
        expect(method.rpcMethod)
            .toBe('eth_hashrate');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
