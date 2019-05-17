import {txInputFormatter} from '../../../src/Formatters';

/**
 * TxInputFormatter test
 */
describe('TxInputFormatterTest', () => {
    it('call txInputFormatter with valid tx object', () => {
        const tx = {
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: 100,
            gasLimit: undefined,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(txInputFormatter(tx)).toEqual({
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: undefined,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64'
        });
    });

    it('call txInputFormatter with data and input set on the tx object', () => {
        const tx = {
            to: undefined,
            input: '0x0',
            data: '0x0',
            gas: 100,
            gasLimit: undefined,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(() => {
            txInputFormatter(tx);
        }).toThrow(
            'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.'
        );
    });

    it('call txInputFormatter with invalid data property on tx object', () => {
        const tx = {
            to: undefined,
            input: undefined,
            data: 'asdfasd',
            gas: 100,
            gasLimit: undefined,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(() => {
            txInputFormatter(tx);
        }).toThrow('The data field must be HEX encoded data.');
    });

    it('call txInputFormatter with gasLimit instead of gas as tx object property', () => {
        const tx = {
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: undefined,
            gasLimit: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(txInputFormatter(tx)).toEqual({
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: 100,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64'
        });
    });

    it('call txInputFormatter with input instead of data as tx object property', () => {
        const tx = {
            to: undefined,
            input: '0x0',
            data: undefined,
            gas: undefined,
            gasLimit: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(txInputFormatter(tx)).toEqual({
            to: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: 100,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64'
        });
    });

    it('call txInputFormatter with to and input instead of data as tx object property', () => {
        const tx = {
            to: '0x03C9A938fF7f54090d0d99e2c6f80380510Ea078',
            input: '0x0',
            data: undefined,
            gas: undefined,
            gasLimit: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(txInputFormatter(tx)).toEqual({
            to: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            data: '0x0',
            gas: '0x64',
            gasLimit: 100,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64'
        });
    });

    it('call txInputFormatter with to and input instead of data as tx object property and chainId', () => {
        const tx = {
            to: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
            input: '0x0',
            data: undefined,
            gas: undefined,
            gasLimit: 100,
            gasPrice: 100,
            nonce: 1,
            value: 100
        };

        expect(txInputFormatter(tx, 30)).toEqual({
            to: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
            data: '0x0',
            gas: '0x64',
            gasLimit: 100,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64'
        });
    });
});
