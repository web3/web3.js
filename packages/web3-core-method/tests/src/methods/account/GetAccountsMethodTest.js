import * as Utils from 'web3-utils';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetAccountsMethod from '../../../../src/methods/account/GetAccountsMethod';

// Mocks
jest.mock('Utils');

/**
 * GetAccountsMethod test
 */
describe('GetAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAccountsMethod(Utils, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_accounts');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });
});
