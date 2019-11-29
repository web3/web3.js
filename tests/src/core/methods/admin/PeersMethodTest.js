import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import PeersMethod from '../../../../src/methods/admin/PeersMethod';

/**
 * PeersMethod test
 */
describe('PeersMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PeersMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_peers');

        expect(method.parametersAmount).toEqual(0);
    });
});
