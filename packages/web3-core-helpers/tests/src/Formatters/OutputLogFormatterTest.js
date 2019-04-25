import {outputLogFormatter} from '../../../src/Formatters';

/**
 * OutputLogFormatter test
 */
describe('OutputLogFormatterTest', () => {
    it('call outputLogFormatter with a valid log', () => {
        const log = {
            blockHash: '0x0',
            transactionHash: '0x0',
            logIndex: '0x0',
            blockNumber: '0x0',
            transactionIndex: '0x0',
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(outputLogFormatter(log)).toEqual({
            id: 'log_0x35b5b8bece53958bb309db665734c38515f37439f69bfdbc64808f1af9a97c31',
            blockHash: '0x0',
            transactionHash: '0x0',
            logIndex: 0,
            blockNumber: 0,
            transactionIndex: 0,
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputLogFormatter with a valid log and log.id should be null', () => {
        const log = {
            blockHash: 0,
            transactionHash: '0x0',
            logIndex: '0x0',
            blockNumber: '0x0',
            transactionIndex: '0x0',
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(outputLogFormatter(log)).toEqual({
            id: null,
            blockHash: 0,
            transactionHash: '0x0',
            logIndex: 0,
            blockNumber: 0,
            transactionIndex: 0,
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        });
    });

    it('call outputLogFormatter with a valid log and logIndex should not be null', () => {
        const log = {
            blockNumber: null,
            id: null,
            logIndex: '0x0',
            transactionIndex: null
        };

        expect(outputLogFormatter(log)).toEqual({
            blockNumber: null,
            id: null,
            logIndex: 0,
            transactionIndex: null
        });
    });

    it('call outputLogFormatter with a valid log and blockNumber should not be null', () => {
        const log = {
            blockNumber: '0x0',
            id: null,
            logIndex: null,
            transactionIndex: null
        };

        expect(outputLogFormatter(log)).toEqual({
            blockNumber: 0,
            id: null,
            logIndex: null,
            transactionIndex: null
        });
    });

    it('call outputLogFormatter with a valid log and transactionIndex should not be null', () => {
        const log = {
            blockNumber: null,
            id: null,
            logIndex: null,
            transactionIndex: '0x0'
        };

        expect(outputLogFormatter(log)).toEqual({
            blockNumber: null,
            id: null,
            logIndex: null,
            transactionIndex: 0
        });
    });
});
