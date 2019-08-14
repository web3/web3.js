import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import PeerCountMethod from '../../../../src/methods/network/PeerCountMethod';

/**
 * PeerCountMethod test
 */
describe('PeerCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PeerCountMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('net_peerCount');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
