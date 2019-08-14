import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import AbstractGetBlockTransactionCountMethod from '../../../../lib/methods/block/AbstractGetBlockTransactionCountMethod';

/**
 * AbstractGetBlockTransactionCountMethod test
 */
describe('AbstractGetBlockTransactionCountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetBlockTransactionCountMethod('rpcMethod', {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(1);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution with a block number as parameter and calls inputBlockNumberFormatter', () => {
        method.parameters = [100];

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('0x0');
    });

    it('calls afterExecution and maps the hex string to a number', () => {
        expect(method.afterExecution('0x0')).toEqual(100);
    });
});
