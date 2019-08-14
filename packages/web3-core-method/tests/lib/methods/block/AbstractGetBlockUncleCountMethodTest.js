import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockUncleCountMethod from '../../../../lib/methods/block/AbstractGetBlockUncleCountMethod';

/**
 * AbstractGetBlockUncleCountMethod test
 */
describe('AbstractGetBlockUncleCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockUncleCountMethod('rpcMethod', {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(1);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block number hash as parameter and calls the inputBlockNumberFormatter', () => {
        method.parameters = ['0x0'];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
    });

    it('afterExecution should map the hex string to a number', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
