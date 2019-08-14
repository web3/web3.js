import PersonalSendTransactionMethod from '../../../../src/methods/personal/PersonalSendTransactionMethod';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';

/**
 * PersonalSendTransactionMethod test
 */
describe('PersonalSendTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSendTransactionMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_sendTransaction');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputTransactionFormatter', () => {
        method.parameters = [{}];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('send', true);
    });
});
