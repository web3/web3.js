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
            gas: 256,
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
            gas: 256,
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
            gas: 256,
            gasPrice: '100',
            nonce: 1,
            value: '100',
            to: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
            from: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });
});
