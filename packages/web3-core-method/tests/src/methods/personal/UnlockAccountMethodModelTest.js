import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import UnlockAccountMethodModel from '../../../../src/models/methods/personal/UnlockAccountMethodModel';

// Mocks
jest.mock('formatters');

/**
 * UnlockAccountMethodModel test
 */
describe('UnlockAccountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new UnlockAccountMethodModel({}, formatters);
    });

    it('rpcMethod should return personal_unlockAccount', () => {
        expect(model.rpcMethod)
            .toBe('personal_unlockAccount');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount)
            .toBe(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        model.parameters = ['0x0'];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x00');

        model.beforeExecution();

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.parameters[0]).toBe('0x00');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('unlockAccount'))
            .toBe('unlockAccount');
    });
});
