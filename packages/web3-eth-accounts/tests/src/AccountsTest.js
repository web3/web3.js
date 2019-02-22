import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {GetGasPriceMethod, GetTransactionCountMethod, VersionMethod} from 'web3-core-method';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import scryptsy from 'scrypt.js';
import crypto from 'crypto';
import uuid from 'uuid';
import TransactionSigner from '../__mocks__/TransactionSigner';
import Wallet from '../../src/models/Wallet';
import Accounts from '../../src/Accounts';
import Account from '../../src/models/Account';
import * as EthAccount from 'eth-lib/lib/account';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('eth-lib/lib/rlp');
jest.mock('eth-lib/lib/nat');
jest.mock('eth-lib/lib/bytes');
jest.mock('eth-lib/lib/hash');
jest.mock('eth-lib/lib/account');
jest.mock('scryptsy');
jest.mock('crypto');
jest.mock('uuid');
jest.mock('../../src/models/Wallet');
jest.mock('../../src/models/Account');

/**
 * Accounts test
 */
describe('AccountsTest', () => {
    let accounts,
        transactionSignerMock,
        walletMock;

    beforeEach(() => {
        transactionSignerMock = new TransactionSigner();

        new Wallet(Utils);
        walletMock = Wallet.mock.instances[0];

        accounts = new Accounts(transactionSignerMock, walletMock, Utils, formatters);
    });

    it('constructor check', () => {
        expect(accounts.utils).toEqual(Utils);

        expect(accounts.formatters).toEqual(formatters);

        expect(accounts.wallet).toEqual(walletMock);

        expect(accounts.transactionSigner).toEqual(transactionSignerMock);
    });

    it('calls create with the entropy parameter and returns the expected object', () => {
        Account.from.mockReturnValueOnce(true);

        expect(accounts.create('entropy')).toEqual(true);

        expect(Account.from).toHaveBeenCalledWith('entropy', transactionSignerMock);
    });

    it('calls privateKeyToAccount with the privateKey parameter and returns the expected object', () => {
        Account.fromPrivateKey.mockReturnValueOnce(true);

        expect(accounts.privateKeyToAccount('pk')).toEqual(true);

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', transactionSignerMock);
    });

    it('calls signTransaction and resolves with a promise', async () => {
        const callback = jest.fn(),
            signTransaction = jest.fn();

        signTransaction.mockReturnValueOnce(Promise.resolve('signed-transaction'));

        Account.fromPrivateKey.mockReturnValueOnce({signTransaction: signTransaction});

        await expect(accounts.signTransaction({}, 'pk', callback)).resolves.toEqual('signed-transaction');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', transactionSignerMock);

        expect(callback).toHaveBeenCalledWith(false, 'signed-transaction');

        expect(signTransaction).toHaveBeenCalledWith({});
    });

    it('calls signTransaction and rejects with a promise', async () => {
        const signTransaction = jest.fn();
        signTransaction.mockReturnValueOnce(Promise.reject('ERROR'));

        const callback = jest.fn();

        Account.fromPrivateKey.mockReturnValueOnce({signTransaction: signTransaction});

        await expect(accounts.signTransaction({}, 'pk', callback)).rejects.toEqual('ERROR');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', transactionSignerMock);

        expect(callback).toHaveBeenCalledWith('ERROR', null);

        expect(signTransaction).toHaveBeenCalledWith({});
    });

    it('calls recoverTransaction and returns the expected string', () => {
        RLP.decode.mockReturnValueOnce([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        EthAccount.encodeSignature.mockReturnValueOnce('signature');

        Bytes.toNumber.mockReturnValueOnce(40);

        Bytes.fromNumber.mockReturnValueOnce(1);

        RLP.encode.mockReturnValueOnce('encoded');

        Hash.keccak256.mockReturnValueOnce('hash');

        EthAccount.recover.mockReturnValueOnce('recovered');


        expect(accounts.recoverTransaction('rawTransaction')).toEqual('recovered');


        expect(EthAccount.recover).toHaveBeenCalledWith('hash', 'signature');

        expect(Hash.keccak256).toHaveBeenCalledWith('encoded');

        expect(RLP.encode).toHaveBeenCalledWith([0, 1, 2, 3, 4, 5, 1, '0x', '0x']);

        expect(Bytes.fromNumber).toHaveBeenCalledWith(2);

        expect(Bytes.toNumber).toHaveBeenCalledWith(6);

        expect(EthAccount.encodeSignature).toHaveBeenCalledWith([6, 7, 8]);

        expect(RLP.decode).toHaveBeenCalledWith('rawTransaction');
    });

    it('calls hashMessage with strict hex and returns the expected string', () => {
        Utils.isHexStrict.mockReturnValueOnce(true);

        Utils.hexToBytes.mockReturnValueOnce('message');

        Hash.keccak256s.mockReturnValueOnce('keccak');

        expect(accounts.hashMessage('data')).toEqual('keccak');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('data');

        expect(Utils.hexToBytes).toHaveBeenCalledWith('data');

        expect(Hash.keccak256s)
            .toHaveBeenCalledWith(
                Buffer.concat(
                    [Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')]
                )
            );
    });

    it('calls hashMessage with non-strict hex and returns the expected string', () => {
        Utils.isHexStrict.mockReturnValueOnce(false);

        Hash.keccak256s.mockReturnValueOnce('keccak');

        expect(accounts.hashMessage('message')).toEqual('keccak');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('message');

        expect(Hash.keccak256s)
            .toHaveBeenCalledWith(
                Buffer.concat(
                    [Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')]
                )
            );
    });

    it('calls sign and returns the expected value', () => {
        const sign = jest.fn();

        sign.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({sign: sign});

        expect(accounts.sign('data', 'pk')).toEqual(true);

        expect(sign).toHaveBeenCalledWith('data');

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', transactionSignerMock);
    });

    it('calls recover with a string as message and returns the expected value', () => {
        Utils.isHexStrict.mockReturnValueOnce(false);

        Hash.keccak256s.mockReturnValueOnce('keccak');

        EthAccount.recover.mockReturnValueOnce('recovered');

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(Utils.isHexStrict).toHaveBeenCalledWith('message');

        expect(Hash.keccak256s)
            .toHaveBeenCalledWith(
                Buffer.concat(
                    [Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')]
                )
            );

        expect(EthAccount.recover).toHaveBeenCalledWith('keccak', 'signature');
    });

    it('calls recover with a object as message and returns the expected value', () => {
        EthAccount.recover.mockReturnValueOnce('recovered');

        EthAccount.encodeSignature.mockReturnValueOnce('signature');

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

        expect(EthAccount.recover).toHaveBeenCalledWith('message', 'signature');

        expect(EthAccount.encodeSignature).toHaveBeenCalledWith(['v', 'r', 's']);
    });

    it('calls recover with a string as message, preFixed is true and it returns the expected value', () => {
        EthAccount.recover.mockReturnValueOnce('recovered');

        EthAccount.encodeSignature.mockReturnValueOnce('signature');

        expect(accounts.recover('message', 'v', 'r', 's', true)).toEqual('recovered');

        expect(EthAccount.recover).toHaveBeenCalledWith('message', 'signature');

        expect(EthAccount.encodeSignature).toHaveBeenCalledWith(['v', 'r', 's']);
    });

    it('calls decrypt and returns the expected value', () => {
        Account.fromV3Keystore.mockReturnValueOnce(true);

        expect(accounts.decrypt('v3Keystore', 'password', false)).toEqual(true);

        expect(Account.fromV3Keystore).toHaveBeenCalledWith('v3Keystore', 'password', false, transactionSignerMock);
    });

    it('calls encrypt and returns the expected value', () => {
        const toV3Keystore = jest.fn();

        toV3Keystore.mockReturnValueOnce(true);

        Account.fromPrivateKey.mockReturnValueOnce({toV3Keystore: toV3Keystore});

        expect(accounts.encrypt('pk', 'password', {})).toEqual(true);

        expect(Account.fromPrivateKey).toHaveBeenCalledWith('pk', transactionSignerMock);

        expect(toV3Keystore).toHaveBeenCalledWith('password', {});
    });
})
;
