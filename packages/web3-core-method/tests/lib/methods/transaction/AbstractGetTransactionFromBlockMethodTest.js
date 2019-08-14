import AbstractGetTransactionFromBlockMethod from '../../../../lib/methods/transaction/AbstractGetTransactionFromBlockMethod';

/**
 * AbstractGetTransactionFromBlockMethod test
 */
describe('AbstractGetTransactionFromBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetTransactionFromBlockMethod('rpcMethod', {});
        method.parameters = [{}, 1];
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution and executes the inputBlockNumberFormatter and the numberToHex method', () => {
        method.beforeExecution();

        expect(method.parameters[0]).toEqual('blockNumber');
        expect(method.parameters[1]).toEqual('0x0');
    });

    it('calls afterExecution and executes the outputTransactionFormatter', () => {
        expect(method.afterExecution({})).toEqual(true);
    });
});
