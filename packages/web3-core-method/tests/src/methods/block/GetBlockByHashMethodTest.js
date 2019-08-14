import GetBlockByHashMethod from '../../../../src/methods/block/GetBlockByHashMethod';

/**
 * GetBlockByHashMethod test
 */
describe('GetBlockByHashMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockByHashMethod({});
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('eth_getBlockByHash');
    });
});
