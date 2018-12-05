import {formatters} from 'web3-core-helpers';
import PersonalSignMethodModel from '../../../../src/models/methods/personal/PersonalSignMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSignMethod test
 */
describe('PersonalSignMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new PersonalSignMethodModel({}, formatters);
    });

    it('rpcMethod should return personal_sign', () => {
        expect(model.rpcMethod)
            .toBe('personal_sign');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount)
            .toBe(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        model.parameters = ['sign', '0x0'];

        formatters.inputSignFormatter
            .mockReturnValueOnce('signed');

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x00');

        model.beforeExecution();

        expect(model.parameters[0])
            .toBe('signed');

        expect(model.parameters[1])
            .toBe('0x00');

        expect(formatters.inputSignFormatter)
            .toHaveBeenCalledWith('sign');

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('personalSign'))
            .toBe('personalSign');
    });
});
