import {formatters} from 'web3-core-helpers';
import GetBlockTransactionCountMethod from '../../../src/methods/GetBlockTransactionCountMethod';

// Mocks
jest.mock('formatters');

/**
 * GetBlockTransactionCountMethod test
 */
describe('GetBlockTransactionCountMethodTest', () => {
    let getBlockTransactionCountMethod;

    beforeEach(() => {
        getBlockTransactionCountMethod = new GetBlockTransactionCountMethod({}, formatters, {});
    });

    it('constructor check', () => {
        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByNumber');
    });

    it('calls execute with hash', () => {
        getBlockTransactionCountMethod.parameters = ['0x0'];

        getBlockTransactionCountMethod.execute();

        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByHash');
    });

    it('calls execute with number', () => {
        getBlockTransactionCountMethod.parameters = [100];

        getBlockTransactionCountMethod.execute();

        expect(getBlockTransactionCountMethod.rpcMethod).toEqual('eth_getBlockTransactionCountByNumber');
    });
});
