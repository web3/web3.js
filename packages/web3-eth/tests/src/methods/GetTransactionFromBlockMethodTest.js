import GetTransactionFromBlockMethod from '../../../src/methods/GetTransactionFromBlockMethod';

/**
 * GetTransactionFromBlockMethod test
 */
describe('GetTransactionFromBlockMethodTest', () => {
    let getTransactionFromBlockMethod;

    beforeEach(() => {
        getTransactionFromBlockMethod = new GetTransactionFromBlockMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });

    it('calls execute with hash', () => {
        getTransactionFromBlockMethod.parameters = ['0x0'];

        getTransactionFromBlockMethod.execute();

        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockHashAndIndex');
    });

    it('calls execute with number', () => {
        getTransactionFromBlockMethod.parameters = [100];

        getTransactionFromBlockMethod.execute();

        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });
});
