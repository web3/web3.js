import {formatters} from 'web3-core-helpers';
import PersonalSendTransactionMethod from '../../../../src/methods/personal/PersonalSendTransactionMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSendTransactionMethod test
 */
describe('PersonalSendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSendTransactionMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(PersonalSendTransactionMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return personal_sendTransaction', () => {
        expect(method.rpcMethod).toEqual('personal_sendTransaction');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputTransactionFormatter', () => {
        method.parameters = [{}];

        formatters.inputTransactionFormatter.mockReturnValueOnce({send: true});

        method.beforeExecution({});

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith({}, {});

        expect(method.parameters[0]).toHaveProperty('send', true);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('personalSend')).toEqual('personalSend');
    });
});
