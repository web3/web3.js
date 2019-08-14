import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ListAccountsMethod from '../../../../src/methods/personal/ListAccountsMethod';

/**
 * ListAccountsMethod test
 */
describe('ListAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ListAccountsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_listAccounts');

        expect(method.parametersAmount).toEqual(0);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution(['0x0'])[0]).toEqual('0x0');
    });
});
