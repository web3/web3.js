import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetTransactionMethod from '../../../../src/methods/transaction/GetTransactionMethod';

/**
 * GetTransactionMethod test
 */
describe('GetTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionByHash');

        expect(method.parametersAmount).toEqual(1);
    });

    it('afterExecution should map the response', () => {
        expect(method.afterExecution({})).toHaveProperty('empty', false);
    });
});
