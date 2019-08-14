import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import LockAccountMethod from '../../../../src/methods/personal/LockAccountMethod';

/**
 * LockAccountMethod test
 */
describe('LockAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new LockAccountMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_lockAccount');

        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call inputAddressFormatter', () => {
        method.parameters = ['0x0'];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
    });
});
