import AbstractGetTransactionFromBlockMethod from '../../../../lib/methods/transaction/AbstractGetTransactionFromBlockMethod';
import GetTransactionByBlockNumberAndIndexMethod from '../../../../src/methods/transaction/GetTransactionByBlockNumberAndIndexMethod';

/**
 * GetTransactionByBlockNumberAndIndexMethod test
 */
describe('GetTransactionByBlockNumberAndIndexMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionByBlockNumberAndIndexMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetTransactionFromBlockMethod);

        expect(method.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });
});
