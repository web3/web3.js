import {formatters} from 'web3-core-helpers';
import PersonalSendTransactionMethodModel from '../../../../src/models/methods/personal/PersonalSendTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSendTransactionMethod test
 */
describe('PersonalSendTransactionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new PersonalSendTransactionMethodModel({}, formatters);
    });

    it('rpcMethod should return personal_sendTransaction', () => {
        expect(model.rpcMethod)
            .toBe('personal_sendTransaction');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call inputTransactionFormatter', () => {
        model.parameters = [{}];

        formatters.inputTransactionFormatter
            .mockReturnValueOnce({send: true});

        model.beforeExecution({});

        expect(formatters.inputTransactionFormatter)
            .toHaveBeenCalledWith({}, {});

        expect(model.parameters[0]).toHaveProperty('send', true);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('personalSend'))
            .toBe('personalSend');
    });
});
