import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import LockAccountMethodModel from '../../../../src/models/methods/personal/LockAccountMethodModel';

// Mocks
jest.mock('formatters');

/**
 * LockAccountMethodModel test
 */
describe('LockAccountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new LockAccountMethodModel({}, formatters);
    });

    it('rpcMethod should return personal_lockAccount', () => {
        expect(model.rpcMethod)
            .toBe('personal_lockAccount');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should call inputAddressFormatter', () => {
        model.parameters = ['0x0'];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution();

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(model.parameters[0])
            .toBe('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('lockAccount'))
            .toBe('lockAccount');
    });
});
