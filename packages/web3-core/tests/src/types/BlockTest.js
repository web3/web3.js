import Transaction from '../../../src/types/Transaction';
import Block from '../../../src/types/Block';

/**
 * BlockTest test
 */
describe('BlockTestTest', () => {
    let blockMock = {
        gasLimit: '0x0',
        gasUsed: '0x0',
        size: '0x0',
        timestamp: '0x0',
        number: '0x0',
        difficulty: ['0x0'],
        totalDifficulty: '0x0',
        transactions: [
            {
                nonce: '0x0',
                gas: '0x0',
                gasPrice: '0x0',
                value: '0x0',
                blockNumber: '0x0',
                transactionIndex: '0x0',
                cumulativeGasUsed: '0x0',
                gasUsed: '0x0',
                to: '',
                from: '',
                logs: '',
                contractAddress: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
                status: '0x1'
            },
            '0x0'
        ],
        miner: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B'
    };

    it('calls the constructor and defines all properties correctly', () => {
        const block = new Block(blockMock);

        expect(block.gasLimit).toEqual(0);

        expect(block.gasUsed).toEqual(0);

        expect(block.size).toEqual(0);

        expect(block.timestamp).toEqual(0);

        expect(block.number).toEqual(0);

        expect(block.difficulty).toEqual('0');

        expect(block.totalDifficulty).toEqual('0');

        expect(block.transactions).toEqual([
            new Transaction({
                nonce: '0x0',
                gas: '0x0',
                gasPrice: '0x0',
                value: '0x0',
                blockNumber: '0x0',
                transactionIndex: '0x0',
                cumulativeGasUsed: '0x0',
                gasUsed: '0x0',
                to: '',
                from: '',
                logs: '',
                contractAddress: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
                status: '0x1'
            }),
            '0x0'
        ]);

        expect(block.miner).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');
    });
});
