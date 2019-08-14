import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import EcRecoverMethod from '../../../../src/methods/personal/EcRecoverMethod';

/**
 * EcRecoverMethod test
 */
describe('EcRecoverMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new EcRecoverMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_ecRecover');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [{}, '0x0'];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('sign', true);

        expect(method.parameters[1]).toEqual('0x0');
    });
});
