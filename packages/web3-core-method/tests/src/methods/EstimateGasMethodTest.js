import AbstractMethod from '../../../lib/methods/AbstractMethod';
import EstimateGasMethod from '../../../src/methods/EstimateGasMethod';

/**
 * EstimateGasMethod test
 */
describe('EstimateGasMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new EstimateGasMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_estimateGas');

        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call the inputCallFormatter', () => {
        method.parameters = [{}];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('empty', true);
    });

    it('afterExecution should call hexToNumber and return the response', () => {
        expect(method.afterExecution({})).toEqual(100);
    });
});
