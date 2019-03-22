import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import Nat from 'eth-lib/lib/nat';
import Bytes from 'eth-lib/lib/bytes';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Account from 'eth-lib/lib/account';
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
            gas: 1,
            nonce: 2,
            gasPrice: 3,
            chainId: 4,
            value: 5,
            to: 'LOWERCASE',
            data: 'data'
        };

        RLP.encode = jest.fn();
        RLP.decode = jest.fn();
        Hash.keccak256 = jest.fn();
        Account.makeSigner = jest.fn();
        Account.decodeSignature = jest.fn();
        Nat.toNumber = jest.fn();
        Bytes.fromNat = jest.fn();

        formatters.txInputFormatter.mockReturnValueOnce(tx);

        Utils.numberToHex.mockReturnValueOnce(1);

        RLP.encode.mockReturnValue('encoded');

        Bytes.fromNat.mockReturnValue(1);

        Hash.keccak256.mockReturnValue('hash');

        const signer = jest.fn();

        Account.makeSigner.mockReturnValueOnce(signer);

        signer.mockReturnValueOnce('signature');

        Nat.toNumber.mockReturnValueOnce(1);

        Account.decodeSignature.mockReturnValueOnce(['seven', 'eight', 'nine']);

        RLP.decode
            .mockReturnValueOnce(['zero', 'one', 'two', 'three', 'four', 'five', 'six'])
            .mockReturnValueOnce(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);

        await expect(transactionSigner.sign(tx, 'pk')).resolves.toEqual({
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(tx);

        expect(Utils.numberToHex).toHaveBeenCalledWith(4);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(1, 2);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(2, 3);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(3, 1);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(4, 5);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(5, 1);

        expect(RLP.encode).toHaveBeenNthCalledWith(1, [1, 1, 1, 'lowercase', 1, 'data', 1, '0x', '0x']);

        expect(RLP.encode).toHaveBeenNthCalledWith(2, [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'seven',
            'eight',
            'nine'
        ]);

        expect(Hash.keccak256).toHaveBeenCalledWith('encoded');

        expect(Nat.toNumber).toHaveBeenCalledWith(1);

        expect(Account.makeSigner).toHaveBeenCalledWith(37);

        expect(signer).toHaveBeenCalledWith('hash', 'pk');

        expect(RLP.decode).toHaveBeenCalledWith('encoded');

        expect(Account.decodeSignature).toHaveBeenCalledWith('signature');
    });

    it('calls sign and throws an error because no private key is given', async () => {
        await expect(transactionSigner.sign({})).rejects.toThrow('No privateKey given to the TransactionSigner.');
    });

    it('calls sign with a prefixed pk and returns the expected resolved promise', async () => {
        const tx = {
            gas: 1,
            nonce: 2,
            gasPrice: 3,
            chainId: 4,
            value: 5,
            to: 'LOWERCASE',
            data: 'data'
        };

        RLP.encode = jest.fn();
        RLP.decode = jest.fn();
        Hash.keccak256 = jest.fn();
        Account.makeSigner = jest.fn();
        Account.decodeSignature = jest.fn();
        Nat.toNumber = jest.fn();
        Bytes.fromNat = jest.fn();

        formatters.txInputFormatter.mockReturnValueOnce(tx);

        Utils.numberToHex.mockReturnValueOnce(1);

        RLP.encode.mockReturnValue('encoded');

        Bytes.fromNat.mockReturnValue(1);

        Hash.keccak256.mockReturnValue('hash');

        const signer = jest.fn();

        Account.makeSigner.mockReturnValueOnce(signer);

        signer.mockReturnValueOnce('signature');

        Nat.toNumber.mockReturnValueOnce(1);

        Account.decodeSignature.mockReturnValueOnce(['seven', 'eight', 'nine']);

        RLP.decode
            .mockReturnValueOnce(['zero', 'one', 'two', 'three', 'four', 'five', 'six'])
            .mockReturnValueOnce(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);

        await expect(transactionSigner.sign(tx, '0xpk')).resolves.toEqual({
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(tx);

        expect(Utils.numberToHex).toHaveBeenCalledWith(4);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(1, 2);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(2, 3);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(3, 1);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(4, 5);

        expect(Bytes.fromNat).toHaveBeenNthCalledWith(5, 1);

        expect(RLP.encode).toHaveBeenNthCalledWith(1, [1, 1, 1, 'lowercase', 1, 'data', 1, '0x', '0x']);

        expect(RLP.encode).toHaveBeenNthCalledWith(2, [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'seven',
            'eight',
            'nine'
        ]);

        expect(Hash.keccak256).toHaveBeenCalledWith('encoded');

        expect(Nat.toNumber).toHaveBeenCalledWith(1);

        expect(Account.makeSigner).toHaveBeenCalledWith(37);

        expect(signer).toHaveBeenCalledWith('hash', 'pk');

        expect(RLP.decode).toHaveBeenCalledWith('encoded');

        expect(Account.decodeSignature).toHaveBeenCalledWith('signature');
    });
});
