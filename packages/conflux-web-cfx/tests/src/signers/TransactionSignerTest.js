import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import TransactionSigner from '../../../src/signers/TransactionSigner';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

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
            messageHash: 'd1cef8bdad2a90e92844383b9a4130b13ceac9a2e023523cefad0518bf133871',
            rawTransaction:
                '0xf86303843b9aca0082753094b414031aa4838a69e27cb2ae31e709bcd674f0cb648080a069a7ddcdf61725dd27023102244a59e838564407d8467c99fcf70ac397c34fd4a0703df54635a6de4d4f0a66d1af3e5e09d05c3b8b2316201d1879913477346300',
            r: '0x69a7ddcdf61725dd27023102244a59e838564407d8467c99fcf70ac397c34fd4',
            s: '0x703df54635a6de4d4f0a66d1af3e5e09d05c3b8b2316201d1879913477346300',
            v: '0x'
        });
    });

    it('calls sign and throws an error because no private key is given', async () => {
        await expect(transactionSigner.sign({})).rejects.toThrow('No privateKey given to the TransactionSigner.');
    });

    it('calls sign with a prefixed pk and returns the expected resolved promise', async () => {
        const tx = {
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
            messageHash: 'd1cef8bdad2a90e92844383b9a4130b13ceac9a2e023523cefad0518bf133871',
            rawTransaction:
                '0xf86303843b9aca0082753094b414031aa4838a69e27cb2ae31e709bcd674f0cb648080a069a7ddcdf61725dd27023102244a59e838564407d8467c99fcf70ac397c34fd4a0703df54635a6de4d4f0a66d1af3e5e09d05c3b8b2316201d1879913477346300',
            r: '0x69a7ddcdf61725dd27023102244a59e838564407d8467c99fcf70ac397c34fd4',
            s: '0x703df54635a6de4d4f0a66d1af3e5e09d05c3b8b2316201d1879913477346300',
            v: '0x'
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
