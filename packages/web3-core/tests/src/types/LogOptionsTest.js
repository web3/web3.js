import LogOptions from '../../../src/types/LogOptions';

/**
 * LogOptions test
 */
describe('LogOptionsTest', () => {
    const optionsMock = {
        address: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        fromBlock: 'latest',
        toBlock: 'latest',
        blockHash: '0x0',
        topics: ['0x0']
    };

    it('calls the constructor and defines all properties correctly', () => {
        const logOptions = new LogOptions(optionsMock);

        expect(logOptions.address).toEqual('0x6d6dc708643a2782be27191e2abcae7e1b0ca38b');

        expect(logOptions.fromBlock).toEqual('latest');

        expect(logOptions.toBlock).toEqual('latest');

        expect(logOptions.blockHash).toEqual('0x0');

        expect(logOptions.topics).toEqual(['0x0']);
    });

    it('calls the constructor with an address array and defines all properties correctly', () => {
        optionsMock.address = [
            '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
            '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B'
        ];

        const logOptions = new LogOptions(optionsMock);

        expect(logOptions.address).toEqual([
            '0x6d6dc708643a2782be27191e2abcae7e1b0ca38b',
            '0x6d6dc708643a2782be27191e2abcae7e1b0ca38b'
        ]);

        expect(logOptions.fromBlock).toEqual('latest');

        expect(logOptions.toBlock).toEqual('latest');

        expect(logOptions.blockHash).toEqual('0x0');

        expect(logOptions.topics).toEqual(['0x0']);
    });
});
