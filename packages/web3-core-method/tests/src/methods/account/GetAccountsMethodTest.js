import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAccountsMethod from '../../../../src/methods/account/GetAccountsMethod';

// Mocks
jest.mock('web3-utils');

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

        expect(method.rpcMethod).toEqual('eth_accounts');

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
