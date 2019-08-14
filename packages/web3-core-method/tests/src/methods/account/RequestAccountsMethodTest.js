import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import RequestAccountsMethod from '../../../../src/methods/account/RequestAccountsMethod';

/**
 * RequestAccountsMethod test
 */
describe('RequestAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new RequestAccountsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_requestAccounts');

        expect(method.parametersAmount).toEqual(0);
    });
});
