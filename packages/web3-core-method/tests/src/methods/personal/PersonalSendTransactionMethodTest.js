import {formatters} from 'web3-core-helpers';
import PersonalSendTransactionMethod from '../../../../src/methods/personal/PersonalSendTransactionMethod';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSendTransactionMethod test
 */
describe('PersonalSendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSendTransactionMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

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
