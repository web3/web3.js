import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetUncleMethod from '../../../../lib/methods/block/AbstractGetUncleMethod';

/**
 * AbstractGetUncleMethod test
 */
describe('AbstractGetUncleMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetUncleMethod('rpcMethod', {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(2);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block hash as parameter and calls the inputBlockNumberFormatter', () => {
        method.parameters = ['0x0', 100];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
        expect(method.parameters[1]).toEqual('0x0');
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution({})).toHaveProperty('block', true);
    });
});
