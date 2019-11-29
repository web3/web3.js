import AbstractGetBlockMethod from '../../../../lib/methods/block/AbstractGetBlockMethod';
import GetBlockByNumberMethod from '../../../../src/methods/block/GetBlockByNumberMethod';

/**
 * GetBlockByNumberMethod test
 */
describe('GetBlockByNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockByNumberMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractGetBlockMethod);

        expect(method.rpcMethod).toEqual('eth_getBlockByNumber');
    });
});
