import * as Utils from 'conflux-web-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAccountsMethod from '../../../../src/methods/account/GetAccountsMethod';

// Mocks
jest.mock('conflux-web-utils');

/**
 * GetAccountsMethod test
 */
describe('GetAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAccountsMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('cfx_accounts');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should just return the response', () => {
        Utils.toChecksumAddress.mockReturnValueOnce('0x0');

        expect(method.afterExecution([{}])[0]).toEqual('0x0');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith({});
    });
});
