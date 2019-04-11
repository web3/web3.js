import AbstractGetTransactionFromBlockMethod from '../../../../lib/methods/transaction/AbstractGetTransactionFromBlockMethod';
import GetTransactionByBlockAddressAndIndexMethod from '../../../../src/methods/transaction/GetTransactionByBlockAddressAndIndexMethod';

/**
 * GetTransactionByBlockAddressAndIndexMethod test
 */
describe('GetTransactionByBlockAddressAndIndexMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionByBlockAddressAndIndexMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetTransactionFromBlockMethod);

        expect(method.rpcMethod).toEqual('cfx_getTransactionByBlockAddressAndIndex');
    });
});
