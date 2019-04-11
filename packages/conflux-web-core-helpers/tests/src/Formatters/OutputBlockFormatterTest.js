import {outputBlockFormatter} from '../../../src/Formatters';

/**
 * outputBlockFormatter test
 */
describe('OutputBlockFormatterTest', () => {
    it('call outputBlockFormatter with a valid block', () => {
        const block = {
            gasLimit: 0x0,
            size: 0x0,
            timestamp: 0x0,
            height: 0x0,
            epochNumber: 0x0,
            difficulty: 100,
            deferredReceiptsRoot: '0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c',
            deferredStateRoot: '0x8d9fa8e7b2d2033a7acd4581a899b9b4ee9b81ff6c0edb15e831d4ff615fe483',
            transactionsRoot: '0xc2fe657e2470e0ebac549ed1562bf194fa95016b97566acf3a5bd8c9ff710dfb',
            nonce: '0x961319d60a8f648c',
            parentHash: '0x14ecd0e8bd42e42ec4c3657deac0c8063b164f9950971cceb4a0f6ad352b6985',
            refereeHashes: [],
            transactions: [
                {
                    blockHash: '0xd8516006e858acb7fb1c4885b6966c2765bfbd1cc99cc87e42e607135b92a9c2',
                    transactionIndex: 0,
                    gas: 100,
                    gasPrice: 100,
                    nonce: 1,
                    value: 100,
                    to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                    from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                    r: '0x232323',
                    s: '0x323232',
                    v: '0x1'
                }
            ],
            miner: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(outputBlockFormatter(block)).toEqual({
            gasLimit: 0x0,
            size: 0x0,
            timestamp: 0x0,
            height: 0x0,
            epochNumber: 0x0,
            difficulty: '100', // Strange some numbers will be handled as string and some as number (gas & nonce)
            deferredReceiptsRoot: '0x959684cc863003d5ac5cb31bcf5baf7e1b4fc60963fcc36fbc1bf4394a0e2e3c',
            deferredStateRoot: '0x8d9fa8e7b2d2033a7acd4581a899b9b4ee9b81ff6c0edb15e831d4ff615fe483',
            transactionsRoot: '0xc2fe657e2470e0ebac549ed1562bf194fa95016b97566acf3a5bd8c9ff710dfb',
            nonce: '0x961319d60a8f648c',
            parentHash: '0x14ecd0e8bd42e42ec4c3657deac0c8063b164f9950971cceb4a0f6ad352b6985',
            refereeHashes: [],
            transactions: [
                {
                    blockHash: '0xd8516006e858acb7fb1c4885b6966c2765bfbd1cc99cc87e42e607135b92a9c2',
                    transactionIndex: 0,
                    gas: 100,
                    gasPrice: '100',
                    nonce: 1,
                    value: '100',
                    to: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
                    from: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
                    r: '0x232323',
                    s: '0x323232',
                    v: 1
                }
            ],
            miner: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });
});
