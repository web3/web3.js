import * as Utils from 'web3-utils';
import NewAccountMethodModel from '../../../../src/models/methods/personal/NewAccountMethod';

// Mocks
jest.mock('Utils');

/**
 * NewAccountMethod test
 */
describe('NewAccountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new NewAccountMethodModel(Utils, {});
    });

    it('rpcMethod should return personal_newAccount', () => {
        expect(model.rpcMethod)
            .toBe('personal_newAccount');
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

        expect(model.afterExecution('0x0'))
            .toBe('0x0');

        expect(Utils.toChecksumAddress)
            .toHaveBeenCalledWith('0x0');
    });
});
