import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminNodeInfoMethod from '../../../../src/methods/admin/AdminNodeInfoMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminNodeInfoMethod test
 */
describe('AdminNodeInfoMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminNodeInfoMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_nodeInfo');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
