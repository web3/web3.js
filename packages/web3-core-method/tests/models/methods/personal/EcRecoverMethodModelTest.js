import {formatters} from 'web3-core-helpers';
import EcRecoverMethodModel from '../../../../src/models/methods/personal/EcRecoverMethodModel';

// Mocks
jest.mock('formatters');

/**
 * EcRecoverMethodModel test
 */
describe('EcRecoverMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new EcRecoverMethodModel({}, formatters);
    });

    it('rpcMethod should return personal_ecRecover', () => {
        expect(model.rpcMethod)
            .toBe('personal_ecRecover');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount)
            .toBe(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [{}, '0x0'];

        formatters.inputSignFormatter
            .mockReturnValueOnce({sign: true});

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        model.beforeExecution();

        expect(model.parameters[0])
            .toHaveProperty('sign', true);

        expect(model.parameters[1])
            .toBe('0x0');

        expect(formatters.inputSignFormatter)
            .toHaveBeenCalledWith({});

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('submitWork'))
            .toBe('submitWork');
    });
});
