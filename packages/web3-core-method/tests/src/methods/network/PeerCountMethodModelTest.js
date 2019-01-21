import * as Utils from 'web3-utils';
import PeerCountMethod from '../../../../src/methods/network/PeerCountMethod';

// Mocks
jest.mock('Utils');

/**
 * PeerCountMethod test
 */
describe('PeerCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PeerCountMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(PeerCountMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return net_peerCount', () => {
        expect(method.rpcMethod).toEqual('net_peerCount');
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
