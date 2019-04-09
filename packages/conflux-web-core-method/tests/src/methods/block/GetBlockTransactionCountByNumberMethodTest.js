import AbstractGetBlockTransactionCountMethod from '../../../../lib/methods/block/AbstractGetBlockTransactionCountMethod';
import GetBlockTransactionCountByNumberMethod from '../../../../src/methods/block/GetBlockTransactionCountByNumberMethod';

/**
 * GetBlockTransactionCountByNumberMethod test
 */
describe('GetBlockTransactionCountByNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockTransactionCountByNumberMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockTransactionCountMethod);

        expect(method.rpcMethod).toEqual('eth_getBlockTransactionCountByNumber');
    });
});
