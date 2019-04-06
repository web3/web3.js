import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminStartWsMethod from '../../../../src/methods/admin/AdminStartWsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminStartWsMethod test
 */
describe('AdminStartWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminStartWsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_startWS');

        expect(method.parametersAmount).toEqual(4);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
