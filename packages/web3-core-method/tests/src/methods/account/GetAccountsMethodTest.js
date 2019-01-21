import * as Utils from 'web3-utils';
import GetAccountsMethod from '../../../../src/methods/account/GetAccountsMethod';

// Mocks
jest.mock('Utils');

/**
 * GetAccountsMethod test
 */
describe('GetAccountsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetAccountsMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetAccountsMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_accounts', () => {
        expect(method.rpcMethod).toEqual('eth_accounts');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        Utils.toChecksumAddress.mockReturnValueOnce('0x0');

        expect(method.afterExecution([{}])[0]).toEqual('0x0');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith({});
    });
});
