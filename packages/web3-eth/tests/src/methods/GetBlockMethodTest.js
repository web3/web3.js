import GetBlockMethod from '../../../src/methods/GetBlockMethod';

/**
 * GetBlockMethod test
 */
describe('GetBlockMethodTest', () => {
    let getBlockMethod;

    beforeEach(() => {
        getBlockMethod = new GetBlockMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(getBlockMethod.rpcMethod).toEqual('eth_getBlockByNumber');
    });

    it('calls execute with hash', () => {
        getBlockMethod.parameters = ['0x0'];

        getBlockMethod.execute();

        expect(getBlockMethod.rpcMethod).toEqual('eth_getBlockByHash');
    });

    it('calls execute with number', () => {
        getBlockMethod.parameters = [100];

        getBlockMethod.execute();

        expect(getBlockMethod.rpcMethod).toEqual('eth_getBlockByNumber');
    });
});
