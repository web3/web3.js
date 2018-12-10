import * as Utils from 'web3-utils';
import ListAccountsMethod from '../../../../src/methods/personal/ListAccountsMethod';

// Mocks
jest.mock('Utils');

/**
 * ListAccountsMethod test
 */
describe('ListAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ListAccountsMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(ListAccountsMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return personal_listAccounts', () => {
        expect(method.rpcMethod)
            .toBe('personal_listAccounts');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        Utils.toChecksumAddress
            .mockReturnValueOnce('0x0');

        expect(method.afterExecution(['0x0'])[0]).toBe('0x0');

        expect(Utils.toChecksumAddress)
            .toHaveBeenCalledWith('0x0')
    });
});
