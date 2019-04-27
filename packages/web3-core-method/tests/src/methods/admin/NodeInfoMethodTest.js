import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import NodeInfoMethod from '../../../../src/methods/admin/NodeInfoMethod';

/**
 * NodeInfoMethod test
 */
describe('NodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NodeInfoMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_nodeInfo');

        expect(method.parametersAmount).toEqual(0);
    });
});
