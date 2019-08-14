import UnlockAccountMethod from '../../../../src/methods/personal/UnlockAccountMethod';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';

/**
 * UnlockAccountMethod test
 */
describe('UnlockAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new UnlockAccountMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_unlockAccount');

        expect(method.parametersAmount).toEqual(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['0x0'];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x00');
    });
});
