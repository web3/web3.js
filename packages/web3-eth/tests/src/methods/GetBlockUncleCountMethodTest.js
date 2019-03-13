import {formatters} from 'web3-core-helpers';
import GetBlockUncleCountMethod from '../../../src/methods/GetBlockUncleCountMethod';

// Mocks
jest.mock('formatters');

/**
 * GetBlockUncleCountMethod test
 */
describe('GetBlockUncleCountMethodTest', () => {
    let getBlockUncleCountMethod;

    beforeEach(() => {
        getBlockUncleCountMethod = new GetBlockUncleCountMethod({}, formatters, {});
    });

    it('constructor check', () => {
        expect(getBlockUncleCountMethod.rpcMethod).toEqual('eth_getUncleCountByBlockNumber');
    });

    it('calls execute with hash', () => {
        getBlockUncleCountMethod.parameters = ['0x0'];

        getBlockUncleCountMethod.execute();

        expect(getBlockUncleCountMethod.rpcMethod).toEqual('eth_getUncleCountByBlockHash');
    });

    it('calls execute with number', () => {
        getBlockUncleCountMethod.parameters = [100];

        getBlockUncleCountMethod.execute();

        expect(getBlockUncleCountMethod.rpcMethod).toEqual('eth_getUncleCountByBlockNumber');
    });
});
