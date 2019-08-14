import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AddPeerMethod from '../../../../src/methods/admin/AddPeerMethod';

/**
 * AddPeerMethod test
 */
describe('AdminAddPeerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AddPeerMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_addPeer');

        expect(method.parametersAmount).toEqual(1);
    });
});
