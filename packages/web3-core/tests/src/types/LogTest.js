import Log from '../../../src/types/Log';

/**
 * Log test
 */
describe('LogTest', () => {
    let logMock = {
        address: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        blockHash: '0x0',
        blockNumber: '0x0',
        data: '0x0',
        logIndex: '0x0',
        topics: ['0x0'],
        transactionHash: '0x0',
        transactionIndex: '0x0',
        removed: false
    };

    it('calls the constructor and defines all properties correctly', () => {
        const log = new Log(logMock);

        expect(log.address).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(log.blockHash).toEqual('0x0');

        expect(log.blockNumber).toEqual(0);

        expect(log.data).toEqual('0x0');

        expect(log.logIndex).toEqual(0);

        expect(log.topics).toEqual(['0x0']);

        expect(log.transactionHash).toEqual('0x0');

        expect(log.transactionIndex).toEqual(0);

        expect(log.removed).toEqual(false);

        expect(log.id).toEqual('log_0x35b5b8bece53958bb309db665734c38515f37439f69bfdbc64808f1af9a97c31');
    });
});
