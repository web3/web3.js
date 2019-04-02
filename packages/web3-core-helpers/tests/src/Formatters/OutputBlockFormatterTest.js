import {outputBlockFormatter} from '../../../src/Formatters';

/**
 * outputBlockFormatter test
 */
describe('OutputBlockFormatterTest', () => {
    it('call outputBlockFormatter with a valid block', () => {
        const block = {
            gasLimit: 0x0,
            gasUsed: 0x0,
            size: 0x0,
            timestamp: 0x0,
            number: 0x0,
            difficulty: 100,
            totalDifficulty: 100,
            transactions: [
                {
                    blockNumber: 0,
                    transactionIndex: 0,
                    gas: 0,
                    gasPrice: 100,
                    nonce: 1,
                    value: 100,
                    to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                    from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
                }
            ],
            miner: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(outputBlockFormatter(block)).toEqual({
            gasLimit: 0x0,
            gasUsed: 0x0,
            size: 0x0,
            timestamp: 0x0,
            number: 0x0,
            difficulty: '100', // Strange some numbers will be handled as string and some as number (gas & nonce)
            totalDifficulty: '100',
            transactions: [
                {
                    blockNumber: 0,
                    transactionIndex: 0,
                    gas: 0,
                    gasPrice: '100',
                    nonce: 1,
                    value: '100',
                    to: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
                    from: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
                }
            ],
            miner: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });
});
