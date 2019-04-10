import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import {encodeSignature, recover} from 'eth-lib/lib/account';
import TransactionSigner from '../__mocks__/TransactionSigner';
import Accounts from '../../src/Accounts';
import Account from '../../src/models/Account';
import {AbstractConfluxWebModule} from 'conflux-web-core';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');
jest.mock('eth-lib/lib/rlp');
jest.mock('eth-lib/lib/nat');
jest.mock('eth-lib/lib/bytes');
jest.mock('eth-lib/lib/hash');
jest.mock('eth-lib/lib/account');
jest.mock('../../src/models/Account');

/**
 * Accounts test
 */
describe('AccountsTest', () => {
    let accounts, providerMock, transactionSignerMock, methodFactoryMock, options;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactoryMock = {
            hasMethod: () => {
                return false;
            }
        };

        transactionSignerMock = new TransactionSigner();

        options = {transactionSigner: transactionSignerMock};

        accounts = new Accounts(providerMock, Utils, formatters, methodFactoryMock, options, {});
    });

    it('constructor check', () => {
        expect(accounts.formatters).toEqual(formatters);

        expect(accounts.transactionSigner).toEqual(options.transactionSigner);

        expect(accounts.defaultKeyName).toEqual('web3js_wallet');

        expect(accounts.accounts).toEqual({});

        expect(accounts.accountsIndex).toEqual(0);

        expect(accounts).toBeInstanceOf(AbstractConfluxWebModule);
    });

    it('calls create with the entropy parameter and returns the expected object', () => {
        Account.from.mockReturnValueOnce(true);

        expect(accounts.create('entropy')).toEqual(true);

        expect(Account.from).toHaveBeenCalledWith('entropy', accounts);
    });

    it('calls privateKeyToAccount with the privateKey parameter and returns the expected object', () => {
        Account.fromPrivateKey.mockReturnValueOnce(true);

        expect(accounts.privateKeyToAccount('pk')).toEqual(true);

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);
    });

    it('calls signTransaction and resolves with a promise', async () => {
        const callback = jest.fn();

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('signed-transaction');
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        const response = await accounts.signTransaction(transaction, 'pk', callback);

        expect(response).toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(transaction, account.privateKey);
    });

    it('calls signTransaction without the chainId property and resolves with a promise', async () => {
        const callback = jest.fn();

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 0
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('signed-transaction');
        });

        accounts.getChainId = jest.fn(() => {
            return Promise.resolve(1);
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

        expect(accounts.getChainId).toHaveBeenCalled();
    });

    it('calls signTransaction without the gasPrice property and resolves with a promise', async () => {
        const callback = jest.fn();

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 0,
            nonce: 1,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('signed-transaction');
        });

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        accounts.getGasPrice = jest.fn(() => {
            return Promise.resolve(1);
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

        expect(accounts.getGasPrice).toHaveBeenCalled();
    });

    it('calls signTransaction without the nonce property and resolves with a promise', async () => {
        const callback = jest.fn();

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 0,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('signed-transaction');
        });

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        accounts.getTransactionCount = jest.fn(() => {
            return Promise.resolve(1);
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

        expect(accounts.getTransactionCount).toHaveBeenCalledWith('0x0');
    });

    it('calls signTransaction and rejects with a promise', async () => {
        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        await expect(accounts.signTransaction(transaction, 'pk')).rejects.toThrow('ERROR');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(transaction, 'pk');
    });

    it('calls signTransaction and calls the callback with a error', (done) => {
        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const account = {privateKey: 'pk', address: '0x0'};
        Account.fromPrivateKey.mockReturnValueOnce(account);

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        formatters.inputCallFormatter.mockReturnValueOnce(transaction);

        accounts.signTransaction(transaction, 'pk', (error, response) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(transaction, 'pk');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(transaction, accounts);

            done();
        });
    });

    it('calls recoverTransaction and returns the expected string', () => {
        RLP.decode.mockReturnValueOnce([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        encodeSignature.mockReturnValueOnce('signature');

        Bytes.toNumber.mockReturnValueOnce(40);

        Bytes.fromNumber.mockReturnValueOnce(1);

        RLP.encode.mockReturnValueOnce('encoded');

        Hash.keccak256.mockReturnValueOnce('hash');

        recover.mockReturnValueOnce('recovered');

        expect(accounts.recoverTransaction('rawTransaction')).toEqual('recovered');

        expect(recover).toHaveBeenCalledWith('hash', 'signature');

        expect(Hash.keccak256).toHaveBeenCalledWith('encoded');

        expect(RLP.encode).toHaveBeenCalledWith([0, 1, 2, 3, 4, 5, 1, '0x', '0x']);

        expect(Bytes.fromNumber).toHaveBeenCalledWith(2);

        expect(Bytes.toNumber).toHaveBeenCalledWith(6);

        expect(encodeSignature).toHaveBeenCalledWith([6, 7, 8]);

        expect(RLP.decode).toHaveBeenCalledWith('rawTransaction');
    });

    it('calls sign with strict hex string and returns the expected value', () => {
        const sign = jest.fn();

        Utils.isHexStrict.mockReturnValueOnce(true);

        Utils.hexToBytes.mockReturnValueOnce('data');

        sign.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({sign: sign});

        expect(accounts.sign('data', 'pk')).toEqual(true);

        expect(sign).toHaveBeenCalledWith('data');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('data');

        expect(Utils.hexToBytes).toHaveBeenCalledWith('data');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);
    });

    it('calls sign with non-strict hex string and returns the expected value', () => {
        const sign = jest.fn();

        Utils.isHexStrict.mockReturnValueOnce(false);

        sign.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({sign: sign});

        expect(accounts.sign('data', 'pk')).toEqual(true);

        expect(sign).toHaveBeenCalledWith('data');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('data');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);
    });

    it('calls recover with a string as message and returns the expected value', () => {
        Utils.isHexStrict.mockReturnValueOnce(false);

        Hash.keccak256s.mockReturnValueOnce('keccak');

        recover.mockReturnValueOnce('recovered');

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('message');

        expect(Hash.keccak256s).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')])
        );

        expect(recover).toHaveBeenCalledWith('keccak', 'signature');
    });

    it('calls recover with a strict hex string as message and returns the expected value', () => {
        Utils.isHexStrict.mockReturnValueOnce(true);

        Utils.hexToBytes.mockReturnValueOnce('message');

        Hash.keccak256s.mockReturnValueOnce('keccak');

        recover.mockReturnValueOnce('recovered');

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('message');

        expect(Utils.hexToBytes).toHaveBeenCalledWith('message');

        expect(Hash.keccak256s).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')])
        );

        expect(recover).toHaveBeenCalledWith('keccak', 'signature');
    });

    it('calls recover with a object as message and returns the expected value', () => {
        recover.mockReturnValueOnce('recovered');

        encodeSignature.mockReturnValueOnce('signature');

        expect(
            accounts.recover(
                {
                    messageHash: 'message',
                    v: 'v',
                    r: 'r',
                    s: 's'
                },
                'signature',
                false
            )
        ).toEqual('recovered');

        expect(recover).toHaveBeenCalledWith('message', 'signature');

        expect(encodeSignature).toHaveBeenCalledWith(['v', 'r', 's']);
    });

    it('calls recover with a string as message, preFixed is true and it returns the expected value', () => {
        recover.mockReturnValueOnce('recovered');

        encodeSignature.mockReturnValueOnce('signature');

        expect(accounts.recover('message', 'v', 'r', 's', true)).toEqual('recovered');

        expect(recover).toHaveBeenCalledWith('message', 'signature');

        expect(encodeSignature).toHaveBeenCalledWith(['v', 'r', 's']);
    });

    it('calls decrypt and returns the expected value', () => {
        Account.fromV3Keystore.mockReturnValueOnce(true);

        expect(accounts.decrypt('v3Keystore', 'password', false)).toEqual(true);

        expect(Account.fromV3Keystore).toHaveBeenCalledWith('v3Keystore', 'password', false, accounts);
    });

    it('calls encrypt and returns the expected value', () => {
        const toV3Keystore = jest.fn();

        toV3Keystore.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({toV3Keystore: toV3Keystore});

        expect(accounts.encrypt('pk', 'password', {})).toEqual(true);

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(toV3Keystore).toHaveBeenCalledWith('password', {});
    });
});
