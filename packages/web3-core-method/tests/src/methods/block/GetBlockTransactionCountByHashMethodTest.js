import AbstractGetBlockTransactionCountMethod from '../../../../lib/methods/block/AbstractGetBlockTransactionCountMethod';
import GetBlockTransactionCountByHashMethod from '../../../../src/methods/block/GetBlockTransactionCountByHashMethod';

/**
 * GetBlockTransactionCountByHashMethod test
 */
describe('GetBlockTransactionCountByHashMethodMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockTransactionCountByHashMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockTransactionCountMethod);

        expect(method.rpcMethod).toEqual('eth_getBlockTransactionCountByHash');
    });
});
