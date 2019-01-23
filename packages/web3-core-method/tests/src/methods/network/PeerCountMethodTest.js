import * as Utils from 'web3-utils';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import PeerCountMethod from '../../../../src/methods/network/PeerCountMethod';

// Mocks
jest.mock('Utils');

/**
 * PeerCountMethod test
 */
describe('PeerCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PeerCountMethod(Utils, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('net_peerCount');

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
