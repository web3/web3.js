import {outputTransactionFormatter} from '../../../src/Formatters';

/**
 * outputTransactionFormatter test
 */
describe('OutputTransactionFormatterTest', () => {
    it('call outputTransactionFormatter with a receipt object', () => {
        const receipt = {
            blockNumber: undefined,
            transactionIndex: undefined,
            gas: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '',
            from: ''
        };

        expect(outputTransactionFormatter(receipt)).toEqual({
            blockNumber: undefined,
            transactionIndex: undefined,
            gas: 100,
            gasPrice: '100',
            nonce: 1,
            value: '100',
            to: null,
            from: ''
        });
    });

    it('call outputTransactionFormatter with blockNumber and transactionIndex defined', () => {
        const receipt = {
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '',
            from: ''
        };

        expect(outputTransactionFormatter(receipt)).toEqual({
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: '100',
            nonce: 1,
            value: '100',
            to: null,
            from: ''
        });
    });

    it('call outputTransactionFormatter with to and from defined', () => {
        const receipt = {
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(outputTransactionFormatter(receipt)).toEqual({
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: '100',
            nonce: 1,
            value: '100',
            to: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
            from: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputTransactionFormatter with to and from defined and chainId', () => {
        const receipt = {
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            to: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
            from: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'
        };

        expect(outputTransactionFormatter(receipt, 31)).toEqual({
            blockNumber: 0,
            transactionIndex: 0,
            gas: 100,
            gasPrice: '100',
            nonce: 1,
            value: '100',
            to: '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
            from: '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359'
        });
    });
});
