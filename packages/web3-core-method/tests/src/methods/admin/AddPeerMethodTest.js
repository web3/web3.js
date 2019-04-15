import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AddPeerMethod from '../../../../src/methods/admin/AddPeerMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AddPeerMethod test
 */
describe('AdminAddPeerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AddPeerMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_addPeer');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
