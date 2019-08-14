import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import NewAccountMethod from '../../../../src/methods/personal/NewAccountMethod';

/**
 * NewAccountMethod test
 */
describe('NewAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NewAccountMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_newAccount');

        expect(method.parametersAmount).toEqual(1);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution('0x0')).toEqual('0x0');
    });
});
