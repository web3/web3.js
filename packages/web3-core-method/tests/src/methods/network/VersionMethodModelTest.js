import * as Utils from 'web3-utils';
import VersionMethod from '../../../../src/methods/network/VersionMethod';

// Mocks
jest.mock('Utils');

/**
 * VersionMethod test
 */
describe('VersionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new VersionMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(VersionMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(method.rpcMethod)
            .toBe('eth_protocolVersion');
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

        expect(method.afterExecution('0x0'))
            .toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
