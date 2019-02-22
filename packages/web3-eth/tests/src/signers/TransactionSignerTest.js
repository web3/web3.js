// Mocks
import Account from 'web3-eth-accounts/src/models/Account';
import {formatters} from 'web3-core-helpers';

jest.mock('');

/**
 * TransactionSignerTest test
 */
describe('TransactionSignerTestTest', () => {
    let TransactionSignerTest;

    beforeEach(() => {
        TransactionSignerTest = new TransactionSignerTest();
    });

    it('constructor check', () => {});

    it('calls signTransaction and returns a resolved promise', async () => {
        const callback = jest.fn();

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

        formatters.inputCallFormatter.mockReturnValueOnce(tx);

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

        await expect(accounts.signTransaction(tx, 'pk', callback)).resolves.toEqual({
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(callback).toHaveBeenCalledWith(null, {
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(tx, accounts);

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

        expect(Hash.keccak256).toHaveBeenNthCalledWith(1, 'encoded');

        expect(Hash.keccak256).toHaveBeenNthCalledWith(2, 'encoded');

        expect(Nat.toNumber).toHaveBeenCalledWith(1);

        expect(Account.makeSigner).toHaveBeenCalledWith(37);

        expect(signer).toHaveBeenCalledWith('hash', 'pk');

        expect(RLP.decode).toHaveBeenCalledWith('encoded');

        expect(Account.decodeSignature).toHaveBeenCalledWith('signature');
    });

    it('calls signTransaction without chainId, gasPrice, nonce and returns a resolved promise', async () => {
        const callback = jest.fn();

        const tx = {
            gas: 1,
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
        accounts.getId = jest.fn();
        accounts.getGasPrice = jest.fn();
        accounts.getTransactionCount = jest.fn();

        formatters.inputCallFormatter.mockReturnValueOnce(tx);

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

        accounts.getId.mockReturnValueOnce(Promise.resolve(4));

        accounts.getGasPrice.mockReturnValueOnce(Promise.resolve(3));

        accounts.getTransactionCount.mockReturnValueOnce(Promise.resolve(2));

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return {address: '0x0'};
        });

        await expect(accounts.signTransaction(tx, 'pk', callback)).resolves.toEqual({
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(callback).toHaveBeenCalledWith(null, {
            messageHash: 'hash',
            v: 'six',
            r: 'seven',
            s: 'eight',
            rawTransaction: 'encoded'
        });

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(tx, accounts);

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

        expect(Hash.keccak256).toHaveBeenNthCalledWith(1, 'encoded');

        expect(Hash.keccak256).toHaveBeenNthCalledWith(2, 'encoded');

        expect(Nat.toNumber).toHaveBeenCalledWith(1);

        expect(Account.makeSigner).toHaveBeenCalledWith(37);

        expect(signer).toHaveBeenCalledWith('hash', 'pk');

        expect(RLP.decode).toHaveBeenCalledWith('encoded');

        expect(Account.decodeSignature).toHaveBeenCalledWith('signature');

        expect(accounts.getTransactionCount).toHaveBeenCalledWith('0x0');

        expect(accounts.getId).toHaveBeenCalled();

        expect(accounts.getGasPrice).toHaveBeenCalled();
    });

    it('calls singTransaction and returns a rejected promise because it could not fetch the missing properties', async () => {
        accounts.getId = jest.fn();
        accounts.getGasPrice = jest.fn();
        accounts.getTransactionCount = jest.fn();

        accounts.getId.mockReturnValueOnce(Promise.resolve(null));

        accounts.getGasPrice.mockReturnValueOnce(Promise.resolve(null));

        accounts.getTransactionCount.mockReturnValueOnce(Promise.resolve(null));

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return {address: '0x0'};
        });

        await expect(accounts.signTransaction({}, 'pk', () => {})).rejects.toThrow(
            `One of the values 'chainId', 'gasPrice', or 'nonce' couldn't be fetched: ${JSON.stringify([
                null,
                null,
                null
            ])}`
        );

        expect(accounts.getTransactionCount).toHaveBeenCalledWith('0x0');

        expect(accounts.getId).toHaveBeenCalled();

        expect(accounts.getGasPrice).toHaveBeenCalled();
    });

    it('calls singTransaction and returns a rejected promise because of invalid values in the TX', async () => {
        const tx = {
            gas: -1,
            nonce: -2,
            gasPrice: -3,
            chainId: -4,
            value: 5,
            to: 'LOWERCASE',
            data: 'data'
        };

        await expect(accounts.signTransaction(tx, 'pk', () => {})).rejects.toThrow(
            'Gas, gasPrice, nonce or chainId is lower than 0'
        );
    });

    it('calls singTransaction and returns a rejected promise because the gas limit property is missing', async () => {
        const tx = {
            nonce: 2,
            gasPrice: 3,
            chainId: 4,
            value: 5,
            to: 'LOWERCASE',
            data: 'data'
        };

        await expect(accounts.signTransaction(tx, 'pk', () => {})).rejects.toThrow('gas is missing');
    });

    it('calls singTransaction and returns a rejected promise because of the inputCallFormatter', async () => {
        const tx = {
            gas: 1,
            nonce: 2,
            gasPrice: 3,
            chainId: 4,
            value: 5,
            to: 'LOWERCASE',
            data: 'data'
        };

        const callback = jest.fn();

        formatters.inputCallFormatter = jest.fn(() => {
            throw new Error('ERROR');
        });

        await expect(accounts.signTransaction(tx, 'pk', callback)).rejects.toThrow('ERROR');

        expect(callback).toHaveBeenCalledWith(new Error('ERROR'));
    });

    it('calls singTransaction and returns a rejected promise because of the missing TX parameter', async () => {
        const callback = jest.fn();

        await expect(accounts.signTransaction(undefined, 'pk', callback)).rejects.toThrow(
            'No transaction object given!'
        );

        expect(callback).toHaveBeenCalledWith(new Error('No transaction object given!'));
    });
});
