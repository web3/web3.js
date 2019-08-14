import AbstractGetTransactionFromBlockMethod from '../../../../lib/methods/transaction/AbstractGetTransactionFromBlockMethod';
import GetTransactionByBlockHashAndIndexMethod from '../../../../src/methods/transaction/GetTransactionByBlockHashAndIndexMethod';

/**
 * GetTransactionByBlockHashAndIndexMethod test
 */
describe('GetTransactionByBlockHashAndIndexMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionByBlockHashAndIndexMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetTransactionFromBlockMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockHashAndIndex');
    });
});
