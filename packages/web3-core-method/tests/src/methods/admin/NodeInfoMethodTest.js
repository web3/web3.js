import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import NodeInfoMethod from '../../../../src/methods/admin/NodeInfoMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * NodeInfoMethod test
 */
describe('NodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NodeInfoMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_nodeInfo');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
