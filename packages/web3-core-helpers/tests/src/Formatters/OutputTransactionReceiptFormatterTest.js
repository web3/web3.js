import {outputTransactionReceiptFormatter} from '../../../src/Formatters';

/**
 * outputTransactionReceiptFormatter test
 */
describe('OutputTransactionReceiptFormatterTest', () => {
    it('call outputTransactionReceiptFormatter with a valid receipt', () => {
        const receipt = {
            status: '0x0',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            gas: 256,
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(outputTransactionReceiptFormatter(receipt)).toEqual({
            status: false,
            cumulativeGasUsed: 256,
            gasUsed: 256,
            gas: 256,
            blockNumber: 256,
            transactionIndex: 10,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputTransactionReceiptFormatter with a valid receipt and logs', () => {
        const receipt = {
            status: '0x0',
            cumulativeGasUsed: '0x100',
            gasUsed: '0x100',
            gas: 256,
            blockNumber: '0x100',
            transactionIndex: '0xa',
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            logs: [{}]
        };

        expect(outputTransactionReceiptFormatter(receipt)).toEqual({
            status: false,
            cumulativeGasUsed: 256,
            gasUsed: 256,
            gas: 256,
            blockNumber: 256,
            transactionIndex: 10,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
            logs: [
                {
                    blockNumber: undefined,
                    id: null,
                    logIndex: undefined,
                    transactionIndex: undefined
                }
            ]
        });
    });
});
