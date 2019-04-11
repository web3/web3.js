import {inputLogFormatter} from '../../../src/Formatters';

/**
 * InputLogFormatter test
 */
describe('InputLogFormatterTest', () => {
    it('call inputLogFormatter with a valid log', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest_state',
            topics: ['0x0'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest_state',
            topics: ['0x0'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with a array of addresses in the log', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest_state',
            topics: ['0x0'],
            address: ['0x03C9A938fF7f54090d0d99e2c6f80380510Ea078', '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078']
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest_state',
            topics: ['0x0'],
            address: ['0x03c9a938ff7f54090d0d99e2c6f80380510ea078', '0x03c9a938ff7f54090d0d99e2c6f80380510ea078']
        });
    });

    it('call inputLogFormatter with an topic item of null', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest_mined',
            topics: [null],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest_mined',
            topics: [null],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with an topic item that does not start with "0x"', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest_mined',
            topics: ['00'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest_mined',
            topics: ['0x3030'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });
});
