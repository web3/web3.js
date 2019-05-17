import {inputCallFormatter} from '../../../src/Formatters';

/**
 * InputCallFormatter test
 */
describe('InputCallFormatterTest', () => {
    it('call inputCallFormatter without an from property on the tx object', () => {
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

        expect(inputCallFormatter(tx, {defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'})).toEqual({
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: undefined,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputCallFormatter with an from property on the tx object', () => {
        const tx = {
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: 100,
            gasLimit: undefined,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        };

        expect(inputCallFormatter(tx, {})).toEqual({
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: undefined,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64',
            from: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078'
        });
    });

    it('call inputCallFormatter with an from property on the tx object and chainId', () => {
        const tx = {
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: 100,
            gasLimit: undefined,
            gasPrice: 100,
            nonce: 1,
            value: 100,
            from: '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359'
        };

        expect(inputCallFormatter(tx, {defaultChainId: 30})).toEqual({
            to: undefined,
            input: undefined,
            data: '0x0',
            gas: '0x64',
            gasLimit: undefined,
            gasPrice: '0x64',
            nonce: '0x1',
            value: '0x64',
            from: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'
        });
    });
});
