import {inputLogFormatter} from '../../../src/Formatters';

/**
 * InputLogFormatter test
 */
describe('InputLogFormatterTest', () => {
    it('call inputLogFormatter with a valid log', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with a array of addresses in the log', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: ['0x03C9A938fF7f54090d0d99e2c6f80380510Ea078', '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078']
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x0'],
            address: ['0x03c9a938ff7f54090d0d99e2c6f80380510ea078', '0x03c9a938ff7f54090d0d99e2c6f80380510ea078']
        });
    });

    it('call inputLogFormatter with an topic item of null', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: [null],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: [null],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with an topic item that does not start with "0x"', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['00'],
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x3030'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter with an topic is of type string', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: '',
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: [],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter when fromBlock is undefined', () => {
        const log = {
            toBlock: 'latest',
            topics: ['00'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            toBlock: 'latest',
            topics: ['0x3030'],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter when toBlock is undefined', () => {
        const log = {
            fromBlock: 'earliest',
            topics: '',
            address: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078'
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            topics: [],
            address: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputLogFormatter when address is undefined', () => {
        const log = {
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['00']
        };

        expect(inputLogFormatter(log)).toEqual({
            fromBlock: 'earliest',
            toBlock: 'latest',
            topics: ['0x3030']
        });
    });
});
