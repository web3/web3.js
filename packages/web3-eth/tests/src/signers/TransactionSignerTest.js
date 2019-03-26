import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import TransactionSigner from '../../../src/signers/TransactionSigner';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * TransactionSigner test
 */
describe('TransactionSignerTest', () => {
    let transactionSigner;

    beforeEach(() => {
        transactionSigner = new TransactionSigner(Utils, formatters);
    });

    it('constructor check', () => {
        expect(transactionSigner.formatters).toEqual(formatters);

        expect(transactionSigner.utils).toEqual(Utils);
    });

    it('calls sign and returns the expected resolved promise', async () => {
        const tx = {
            chainId: '0x11',
            data: '0x',
            gas: '0x7530',
            gasPrice: '0x3b9aca00',
            nonce: '0x3',
            to: '0xb414031Aa4838A69e27Cb2AE31E709Bcd674F0Cb',
            value: '0x64'
        };

        await expect(
            transactionSigner.sign(tx, '3a0ce9a362c73439adb38c595e739539be1e34d19c5e9f04962c101c86bd7616')
        ).resolves.toEqual({
            messageHash: '91e0ad336c23d84f757aa4cde2d0bb557daf5e1ca0a0b850b6431f3277fc167b',
            rawTransaction:
                '0xf86303843b9aca0082753094b414031aa4838a69e27cb2ae31e709bcd674f0cb648045a01fff9fa845437523b0a7f334b7d2a0ab14364a3581f898cd1bba3b5909465867a01415137f53eeddf0687e966f8d59984676d6d92ce88140765ed343db6936679e',
            r: '0x1fff9fa845437523b0a7f334b7d2a0ab14364a3581f898cd1bba3b5909465867',
            s: '0x1415137f53eeddf0687e966f8d59984676d6d92ce88140765ed343db6936679e',
            v: '0x45'
        });
    });

    it('calls sign and throws an error because no private key is given', async () => {
        await expect(transactionSigner.sign({})).rejects.toThrow('No privateKey given to the TransactionSigner.');
    });

    it('calls sign with a prefixed pk and returns the expected resolved promise', async () => {
        const tx = {
            chainId: '0x11',
            data: '0x',
            gas: '0x7530',
            gasPrice: '0x3b9aca00',
            nonce: '0x3',
            to: '0xb414031Aa4838A69e27Cb2AE31E709Bcd674F0Cb',
            value: '0x64'
        };

        await expect(
            transactionSigner.sign(tx, '0x3a0ce9a362c73439adb38c595e739539be1e34d19c5e9f04962c101c86bd7616')
        ).resolves.toEqual({
            messageHash: '91e0ad336c23d84f757aa4cde2d0bb557daf5e1ca0a0b850b6431f3277fc167b',
            rawTransaction:
                '0xf86303843b9aca0082753094b414031aa4838a69e27cb2ae31e709bcd674f0cb648045a01fff9fa845437523b0a7f334b7d2a0ab14364a3581f898cd1bba3b5909465867a01415137f53eeddf0687e966f8d59984676d6d92ce88140765ed343db6936679e',
            r: '0x1fff9fa845437523b0a7f334b7d2a0ab14364a3581f898cd1bba3b5909465867',
            s: '0x1415137f53eeddf0687e966f8d59984676d6d92ce88140765ed343db6936679e',
            v: '0x45'
        });
    });

    it('calls sign and returns a rejected promise', async () => {
        const tx = {
            chainId: '0x11',
            data: '0x',
            gas: '0x0',
            gasPrice: '0x3b9aca00',
            nonce: '0x3',
            to: '0xb414031Aa4838A69e27Cb2AE31E709Bcd674F0Cb',
            value: '0x64'
        };

        await expect(
            transactionSigner.sign(tx, '0x3a0ce9a362c73439adb38c595e739539be1e34d19c5e9f04962c101c86bd7616')
        ).rejects.toThrow('TransactionSigner Error: gas limit is too low. Need at least 21000');
    });
});
