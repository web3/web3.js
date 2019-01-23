import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import RequestAccountsMethod from '../../../../src/methods/account/RequestAccountsMethod';

/**
 * RequestAccountsMethod test
 */
describe('RequestAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new RequestAccountsMethod();
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('eth_requestAccounts');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(null);
    });
});
