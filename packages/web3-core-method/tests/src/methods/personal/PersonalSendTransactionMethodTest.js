import {formatters} from 'web3-core-helpers';
import PersonalSendTransactionMethod from '../../../../src/methods/personal/PersonalSendTransactionMethod';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * PersonalSendTransactionMethod test
 */
describe('PersonalSendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSendTransactionMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_sendTransaction');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputTransactionFormatter', () => {
        method.parameters = [{}];

        formatters.inputTransactionFormatter.mockReturnValueOnce({send: true});

        method.beforeExecution({});

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith({}, {});

        expect(method.parameters[0]).toHaveProperty('send', true);
    });
});
