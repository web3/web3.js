import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import NodeInfoMethod from '../../../../src/methods/admin/NodeInfoMethod';

// Mocks
jest.mock('web3-utils');

/**
 * NodeInfoMethod test
 */
describe('NodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NodeInfoMethod(Utils, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_nodeInfo');

        expect(method.parametersAmount).toEqual(0);
    });

    it('calls afterExecution and calls utils.hexToNumber', () => {
        Utils.hexToNumber.mockReturnValue(1);

        expect(method.afterExecution({ports: {discovery: '0x1', listener: '0x2'}}))
            .toEqual({
                ports: {
                    discovery: 1,
                    listener: 1
                }
            });

        expect(Utils.hexToNumber).toHaveBeenNthCalledWith(1, '0x1');
        expect(Utils.hexToNumber).toHaveBeenNthCalledWith(2, '0x2');
    });
});
