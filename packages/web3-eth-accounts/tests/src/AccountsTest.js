import {isHexStrict, randomHex, hexToBytes} from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {ChainIdMethod, GetGasPriceMethod, GetTransactionCountMethod} from 'web3-core-method';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import {encodeSignature, recover} from 'eth-lib/lib/account';
import {HttpProvider, ProviderDetector, ProviderResolver, ProvidersModuleFactory} from 'web3-providers';
import TransactionSigner from '../__mocks__/TransactionSigner';
import Accounts from '../../src/Accounts';
import Account from '../../src/models/Account';
import {AbstractWeb3Module} from 'web3-core';

// Mocks
jest.mock('isHexStrict');
jest.mock('hexToBytes');
jest.mock('formatters');
jest.mock('HttpProvider');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('ProvidersModuleFactory');
jest.mock('GetGasPriceMethod');
jest.mock('GetTransactionCountMethod');
jest.mock('ChainIdMethod');
jest.mock('eth-lib/lib/rlp');
jest.mock('eth-lib/lib/nat');
jest.mock('eth-lib/lib/bytes');
jest.mock('eth-lib/lib/hash');
jest.mock('eth-lib/lib/account');
jest.mock('scryptsy');
jest.mock('crypto');
jest.mock('uuid');
jest.mock('../../src/models/Account');

/**
 * Accounts test
 */
describe('AccountsTest', () => {
    let accounts,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock,
        chainIdMethodMock,
        getGasPriceMethodMock,
        getTransactionCountMethodMock,
        transactionSignerMock,
        options;

    beforeEach(() => {
        new HttpProvider();
        providerMock = HttpProvider.mock.instances[0];

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new ProviderDetector();
        providerDetectorMock = ProviderDetector.mock.instances[0];
        providerDetectorMock.detect = jest.fn(() => {
            return null;
        });

        new ProviderResolver();
        providerResolverMock = ProviderResolver.mock.instances[0];
        providerResolverMock.resolve = jest.fn(() => {
            return providerMock;
        });

        providersModuleFactoryMock.createProviderDetector.mockReturnValueOnce(providerDetectorMock);

        providersModuleFactoryMock.createProviderResolver.mockReturnValueOnce(providerResolverMock);

        new ChainIdMethod();
        chainIdMethodMock = ChainIdMethod.mock.instances[0];

        new GetGasPriceMethod();
        getGasPriceMethodMock = GetGasPriceMethod.mock.instances[0];

        new GetTransactionCountMethod();
        getTransactionCountMethodMock = GetTransactionCountMethod.mock.instances[0];

        transactionSignerMock = new TransactionSigner();

        options = {transactionSigner: transactionSignerMock};

        accounts = new Accounts(
            providerMock,
            providersModuleFactoryMock,
            formatters,
            chainIdMethodMock,
            getGasPriceMethodMock,
            getTransactionCountMethodMock,
            options
        );
    });

    it('constructor check', () => {
        expect(accounts.formatters).toEqual(formatters);

        expect(accounts.chainIdMethod).toEqual(chainIdMethodMock);

        expect(accounts.getGasPriceMethod).toEqual(getGasPriceMethodMock);

        expect(accounts.getTransactionCountMethod).toEqual(getTransactionCountMethodMock);

        expect(accounts.transactionSigner).toEqual(options.transactionSigner);

        expect(accounts).toBeInstanceOf(AbstractWeb3Module);
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

        const response = await accounts.signTransaction(transaction, 'pk', callback);

        expect(response).toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

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

        chainIdMethodMock.execute = jest.fn(() => {
            return Promise.resolve(1);
        });

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(chainIdMethodMock.execute).toHaveBeenCalledWith(accounts);
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

        getGasPriceMethodMock.execute = jest.fn(() => {
            return Promise.resolve(1);
        });

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');


        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(getGasPriceMethodMock.execute).toHaveBeenCalledWith(accounts);
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

        getTransactionCountMethodMock.execute = jest.fn(() => {
            return Promise.resolve(1);
        });

        await expect(accounts.signTransaction(transaction, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, account.privateKey);

        expect(getTransactionCountMethodMock.execute).toHaveBeenCalledWith(accounts);
    });

    it('calls signTransaction and rejects with a promise', async () => {
        const callback = jest.fn(),
            transaction = {
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

        await expect(accounts.signTransaction(transaction, 'pk', callback)).rejects.toThrow('ERROR');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);

        expect(callback).toHaveBeenCalledWith(new Error('ERROR'), null);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(transaction, 'pk');
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

        isHexStrict.mockReturnValueOnce(true);

        hexToBytes.mockReturnValueOnce('data');

        sign.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({sign: sign});

        expect(accounts.sign('data', 'pk')).toEqual(true);

        expect(sign).toHaveBeenCalledWith('data');

        expect(isHexStrict).toHaveBeenCalledWith('data');

        expect(hexToBytes).toHaveBeenCalledWith('data');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);
    });

    it('calls sign with non-strict hex string and returns the expected value', () => {
        const sign = jest.fn();

        isHexStrict.mockReturnValueOnce(false);

        sign.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({sign: sign});

        expect(accounts.sign('data', 'pk')).toEqual(true);

        expect(sign).toHaveBeenCalledWith('data');

        expect(isHexStrict).toHaveBeenCalledWith('data');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', accounts);
    });

    it('calls recover with a string as message and returns the expected value', () => {
        isHexStrict.mockReturnValueOnce(false);

        Hash.keccak256s.mockReturnValueOnce('keccak');

        recover.mockReturnValueOnce('recovered');

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(isHexStrict).toHaveBeenCalledWith('message');

        expect(Hash.keccak256s).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')])
        );

        expect(recover).toHaveBeenCalledWith('keccak', 'signature');
    });

    it('calls recover with a strict hex string as message and returns the expected value', () => {
        isHexStrict.mockReturnValueOnce(true);

        hexToBytes.mockReturnValueOnce('message');

        Hash.keccak256s.mockReturnValueOnce('keccak');

        recover.mockReturnValueOnce('recovered');

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(isHexStrict).toHaveBeenCalledWith('message');

        expect(hexToBytes).toHaveBeenCalledWith('message');

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

    it('calls wallet.create and returns the expected value', () => {
        randomHex.mockReturnValueOnce('asdf');

        Account.from.mockReturnValueOnce({address: '0x0', privateKey: '0x0'});

        expect(accounts.wallet.create(1)).toEqual(accounts);

        expect(randomHex).toHaveBeenCalledWith(32);

        expect(Account.from).toHaveBeenCalledWith('asdf', accounts);

        expect(accounts.accountsIndex).toEqual(1);
    });

    it('calls wallet.add with a Account object and returns the expected value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        expect(accounts.wallet.add(accountMock)).toEqual(accountMock);

        expect(accounts.accounts[accountMock.address]).toEqual(accountMock);

        expect(accounts.accounts[0]).toEqual(accountMock);

        expect(accounts.accounts[accountMock.address.toLowerCase()]).toEqual(accountMock);
    });

    it('calls wallet.add with an already existing account and returns the expected value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';
        accounts.accounts[accountMock.address] = accountMock;

        expect(accounts.wallet.add(accountMock)).toEqual(accountMock);

        expect(accounts.accounts[accountMock.address]).toEqual(accountMock);
    });

    it('calls wallet.add with a privateKey and returns the expected value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        Account.fromPrivateKey.mockReturnValueOnce(accountMock);

        expect(accounts.wallet.add('0x0')).toEqual(accountMock);

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('0x0', accounts);

        expect(accounts.accounts[accountMock.address]).toEqual(accountMock);

        expect(accounts.accounts[0]).toEqual(accountMock);

        expect(accounts.accounts[accountMock.address.toLowerCase()]).toEqual(accountMock);
    });

    it('calls wallet.remove and returns true', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        accounts.accounts = {'0x0': accountMock};
        accounts.accountsIndex = 1;

        expect(accounts.wallet.remove('0x0')).toEqual(true);

        expect(accounts.accountsIndex).toEqual(0);
    });

    it('calls wallet.remove and returns false', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        delete accountMock.address;

        accounts.accounts = {};

        expect(accounts.wallet.remove(0)).toEqual(false);

        expect(accounts.accountsIndex).toEqual(0);
    });

    it('calls wallet.clear and returns the expect value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        accounts.accounts = {0: accountMock};

        expect(accounts.wallet.clear()).toEqual(accounts);

        expect(accounts.accountsIndex).toEqual(0);
    });

    it('calls wallet.encrypt and returns the expect value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        accountMock.encrypt.mockReturnValueOnce(true);

        accounts.accounts = {0: accountMock};

        expect(accounts.wallet.encrypt('pw', {})).toEqual([true]);

        expect(accountMock.encrypt).toHaveBeenCalledWith('pw', {});

        expect(accounts.accountsIndex).toEqual(0);
    });

    it('calls wallet.decrypt and returns the expected value', () => {
        new Account();
        const accountMock = Account.mock.instances[0];
        accountMock.address = '0x0';

        Account.fromV3Keystore.mockReturnValueOnce(accountMock);

        expect(accounts.wallet.decrypt([true], 'pw')).toEqual(accounts);

        expect(Account.fromV3Keystore).toHaveBeenCalledWith(true, 'pw', false, accounts);

        expect(accounts.accounts[accountMock.address]).toEqual(accountMock);

        expect(accounts.accounts[0]).toEqual(accountMock);

        expect(accounts.accounts[accountMock.address.toLowerCase()]).toEqual(accountMock);
    });

    it('calls wallet.decrypt and throws an error', () => {
        Account.fromV3Keystore.mockReturnValueOnce(false);

        expect(() => {
            accounts.wallet.decrypt([true], 'pw');
        }).toThrow('Couldn\'t decrypt accounts. Password wrong?');

        expect(Account.fromV3Keystore).toHaveBeenCalledWith(true, 'pw', false, accounts);
    });
});
