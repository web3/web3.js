import {outputTransactionReceiptFormatter} from '../../../src/Formatters';

/**
 * outputTransactionReceiptFormatter test
 */
describe('OutputTransactionReceiptFormatterTest', () => {
    it('call outputTransactionReceiptFormatter with a valid receipt', () => {
        const receipt = {
            status: 0,
            cumulativeGasUsed: 100,
            gasUsed: 100,
            blockNumber: 0,
            transactionIndex: 0,
            gas: 256,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(outputTransactionReceiptFormatter(receipt)).toEqual({
            status: false,
            cumulativeGasUsed: 100,
            gasUsed: 100,
            blockNumber: 0,
            transactionIndex: 0,
            gas: 256,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputTransactionReceiptFormatter with a valid receipt and logs', () => {
        const receipt = {
            status: 0,
            cumulativeGasUsed: 100,
            gasUsed: 100,
            blockNumber: 0,
            transactionIndex: 0,
            gas: 256,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            contractAddress: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            logs: [{}]
        };

        expect(outputTransactionReceiptFormatter(receipt)).toEqual({
            status: false,
            cumulativeGasUsed: 100,
            gasUsed: 100,
            blockNumber: 0,
            transactionIndex: 0,
            gas: 256,
            gasPrice: 100,
            nonce: 1,
            value: 100,
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
