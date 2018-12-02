import * as Utils from 'web3-utils';
import ListAccountsMethodModel from '../../../../src/models/methods/personal/ListAccountsMethodModel';

// Mocks
jest.mock('Utils');

/**
 * ListAccountsMethodModel test
 */
describe('ListAccountsMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new ListAccountsMethodModel(Utils, {});
    });

    it('rpcMethod should return personal_listAccounts', () => {
        expect(model.rpcMethod)
            .toBe('personal_listAccounts');
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

        expect(model.afterExecution(['0x0'])[0]).toBe('0x0');

        expect(Utils.toChecksumAddress)
            .toHaveBeenCalledWith('0x0')
    });
});
