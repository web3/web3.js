import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetAccountsMethod from '../../../../src/methods/account/GetAccountsMethod';

/**
 * GetAccountsMethod test
 */
describe('GetAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAccountsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_accounts');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution([{}])[0]).toEqual('0x0');
    });
});
