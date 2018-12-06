import * as Utils from 'packages/web3-utils/dist/web3-utils.cjs';
import GetAccountsMethodModel from '../../../../src/models/methods/account/GetAccountsMethodModel';

// Mocks
jest.mock('Utils');

/**
 * GetAccountsMethodModel test
 */
describe('GetAccountsMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetAccountsMethodModel(Utils, {});
    });

    it('rpcMethod should return eth_accounts', () => {
        expect(model.rpcMethod)
            .toBe('eth_accounts');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        Utils.toChecksumAddress
            .mockReturnValueOnce('0x0');

        expect(model.afterExecution([{}])[0])
            .toBe('0x0');

        expect(Utils.toChecksumAddress)
            .toHaveBeenCalledWith({});
    });
});
