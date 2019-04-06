import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetAdminSolcMethod from '../../../../src/methods/admin/SetAdminSolcMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetAdminSolcMethod test
 */
describe('SetAdminSolcMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetAdminSolcMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('admin_setSolc');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
