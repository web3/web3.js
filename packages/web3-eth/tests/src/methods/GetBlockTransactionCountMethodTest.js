import GetBlockTransactionCountMethod from '../../../src/methods/GetBlockTransactionCountMethod';

/**
 * GetBlockTransactionCountMethod test
 */
describe('GetBlockTransactionCountMethodTest', () => {
    let getBlockTransactionCountMethod;

    beforeEach(() => {
        getBlockTransactionCountMethod = new GetBlockTransactionCountMethod({});
    });

    it('constructor check', () => {
        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByNumber');
    });

    it('calls execute with hash', () => {
        getBlockTransactionCountMethod.parameters = ['0x0'];

        getBlockTransactionCountMethod.beforeExecution();

        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByHash');
    });

    it('calls execute with number', () => {
        getBlockTransactionCountMethod.parameters = [100];

        getBlockTransactionCountMethod.beforeExecution();

        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByNumber');
    });
});
