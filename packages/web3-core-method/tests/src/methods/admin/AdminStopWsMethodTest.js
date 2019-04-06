import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AdminStopWsMethod from '../../../../src/methods/admin/AdminStopWsMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * AdminStopWsMethod test
 */
describe('AdminStopWsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AdminStopWsMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_stopWS');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
