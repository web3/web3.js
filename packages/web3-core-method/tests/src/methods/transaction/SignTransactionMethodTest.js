import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SignTransactionMethod from '../../../../src/methods/transaction/SignTransactionMethod';

/**
 * SignTransactionMethod test
 */
describe('SignTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SignTransactionMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_signTransaction');

        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should execute the inputTransactionFormatter', () => {
        method.parameters = [{}];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('empty', false);
    });
});
