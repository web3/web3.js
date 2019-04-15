import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import PeersMethod from '../../../../src/methods/admin/PeersMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * PeersMethod test
 */
describe('PeersMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PeersMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_peers');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
