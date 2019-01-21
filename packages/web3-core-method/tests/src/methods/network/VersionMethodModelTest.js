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
        expect(VersionMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(method.rpcMethod).toEqual('eth_protocolVersion');
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
