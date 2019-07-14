import scryptsy from 'scrypt.js';
import randomBytes from 'randombytes';
import {pbkdf2Sync} from 'pbkdf2';
import {createCipheriv, createDecipheriv} from 'browserify-cipher';
import uuid from 'uuid';
import Hash from 'eth-lib/lib/hash';
import {fromPrivate, sign, decodeSignature} from 'eth-lib/lib/account';
import {hexToBytes, isHexStrict, keccak256} from 'web3-utils';
import TransactionSigner from '../../__mocks__/TransactionSigner';
import Accounts from '../../../src/Accounts';
import Account from '../../../src/models/Account';

// Mocks
jest.mock('eth-lib/lib/account');
jest.mock('eth-lib/lib/hash');
jest.mock('web3-utils');
jest.mock('uuid');
jest.mock('randombytes');
jest.mock('pbkdf2');
jest.mock('browserify-cipher');
jest.mock('scrypt.js');
jest.mock('../../../src/Accounts');

/**
 * AccountTest test
 */
describe('AccountTest', () => {
    let account, accountsMock, transactionSignerMock;

    beforeEach(() => {
        transactionSignerMock = new TransactionSigner();

        new Accounts();
        accountsMock = Accounts.mock.instances[0];
        accountsMock.transactionSigner = transactionSignerMock;

        account = new Account({address: 'address', privateKey: 'pk'}, accountsMock);
    });

    it('constructor check', () => {
        expect(account.address).toEqual('address');

        expect(account.privateKey).toEqual('pk');

        expect(account.accounts).toEqual(accountsMock);
    });

    it('calls signTransaction and returns the expected value', () => {
        const callback = jest.fn();

        accountsMock.signTransaction.mockReturnValueOnce(true);

        expect(account.signTransaction({}, callback)).toEqual(true);

        expect(accountsMock.signTransaction).toHaveBeenCalledWith({}, 'pk', callback);
    });

    it('calls fromPrivateKey with incorrect private key length and throws error', () => {
        expect(() => {
            Account.fromPrivateKey('asdfasdf')
        }).toThrow('Private key must be 32 bytes long');
    });

    it('calls fromPrivateKey with incorrect private key prefix and throws error', () => {
        const mockKey = '0z0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        expect(() => {
            Account.fromPrivateKey(mockKey)
        }).toThrow('Private key must be 32 bytes long');
    });

    it('calls sign with non-strict hex and returns the expected string', () => {
        isHexStrict.mockReturnValue(false);

        Hash.keccak256s.mockReturnValueOnce('keccak');

        sign.mockReturnValueOnce('signed');

        decodeSignature.mockReturnValueOnce(['v', 'r', 's']);

        expect(account.sign('message')).toEqual({
            message: 'message',
            messageHash: 'keccak',
            v: 'v',
            r: 'r',
            s: 's',
            signature: 'signed'
        });

        expect(Hash.keccak256s).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')])
        );

        expect(sign).toHaveBeenCalledWith('keccak', 'pk');

        expect(decodeSignature).toHaveBeenCalledWith('signed');

        expect(isHexStrict).toHaveBeenCalledWith('message');
    });

    it('calls sign with strict hex and returns the expected string', () => {
        isHexStrict.mockReturnValue(true);

        hexToBytes.mockReturnValue('message');

        Hash.keccak256s.mockReturnValueOnce('keccak');

        sign.mockReturnValueOnce('signed');

        decodeSignature.mockReturnValueOnce(['v', 'r', 's']);

        expect(account.sign('message')).toEqual({
            message: 'message',
            messageHash: 'keccak',
            v: 'v',
            r: 'r',
            s: 's',
            signature: 'signed'
        });

        expect(Hash.keccak256s).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')])
        );

        expect(sign).toHaveBeenCalledWith('keccak', 'pk');

        expect(decodeSignature).toHaveBeenCalledWith('signed');

        expect(hexToBytes).toHaveBeenCalledWith('message');

        expect(isHexStrict).toHaveBeenCalledWith('message');
    });

    it('calls the factory method fromV3Keystore and returns the expected Account class', () => {
        const json = {
            version: 3,
            crypto: {
                kdf: 'scrypt',
                mac: 'mac',
                ciphertext: 'xx',
                cipher: 'cipher',
                cipherparams: {
                    iv: ['0x0']
                },
                kdfparams: {
                    n: 'n',
                    r: 'r',
                    p: 'p',
                    dklen: 'dklen',
                    salt: 'salt'
                }
            }
        };

        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            address: '0x0',
            privateKey: '0x0'
        });

        scryptsy.mockReturnValueOnce(Buffer.from('00000000000000000000000000000000'));

        keccak256.mockReturnValueOnce('0xmac');

        const decipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        decipher.update.mockReturnValueOnce(Buffer.from(mockKey.slice(2,34), 'hex'));

        decipher.final.mockReturnValueOnce(Buffer.from(mockKey.slice(34,66), 'hex'));

        createDecipheriv.mockReturnValueOnce(decipher);

        expect(Account.fromV3Keystore(json, 'password', false)).toBeInstanceOf(Account);

        expect(fromPrivate).toHaveBeenLastCalledWith(mockKey);

        expect(scryptsy).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('salt', 'hex'),
            'n',
            'r',
            'p',
            'dklen'
        );

        expect(keccak256).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );

        expect(createDecipheriv).toHaveBeenCalledWith(
            'cipher',
            Buffer.from('0000000000000000'),
            Buffer.from(['0x0'], 'hex')
        );

        expect(decipher.update).toHaveBeenCalledWith(Buffer.from(json.crypto.ciphertext, 'hex'));

        expect(decipher.final).toHaveBeenCalled();
    });

    it('calls the factory method fromV3Keystore with pbkdf2 and returns the expected object', () => {
        const json = {
            version: 3,
            crypto: {
                kdf: 'pbkdf2',
                mac: 'mac',
                ciphertext: 'xx',
                cipher: 'cipher',
                cipherparams: {
                    iv: ['0x0']
                },
                kdfparams: {
                    c: 1,
                    dklen: 'dklen',
                    salt: 'salt',
                    prf: 'hmac-sha256'
                }
            }
        };

        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            address: '0x0',
            privateKey: '0x0'
        });

        keccak256.mockReturnValueOnce('0xmac');

        const decipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        decipher.update.mockReturnValueOnce(Buffer.from(mockKey.slice(2,34), 'hex'));

        decipher.final.mockReturnValueOnce(Buffer.from(mockKey.slice(34,66), 'hex'));

        createDecipheriv.mockReturnValueOnce(decipher);

        pbkdf2Sync.mockReturnValueOnce(Buffer.from('00000000000000000000000000000000'));

        expect(Account.fromV3Keystore(json, 'password', false)).toBeInstanceOf(Account);

        expect(fromPrivate).toHaveBeenCalledWith(mockKey);

        expect(pbkdf2Sync).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('salt', 'hex'),
            1,
            'dklen',
            'sha256'
        );

        expect(keccak256).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );

        expect(createDecipheriv).toHaveBeenCalledWith(
            'cipher',
            Buffer.from('0000000000000000'),
            Buffer.from(['0x0'], 'hex')
        );

        expect(decipher.update).toHaveBeenCalledWith(Buffer.from(json.crypto.ciphertext, 'hex'));

        expect(decipher.final).toHaveBeenCalled();
    });

    it('calls decrypt and throws an error because of the missing password paramerter', () => {
        expect(() => {
            Account.fromV3Keystore('');
        }).toThrow('No password given.');
    });

    it('calls decrypt and throws an error because of a wrong keystore version', () => {
        expect(() => {
            Account.fromV3Keystore({version: 0}, 'password', false);
        }).toThrow('Not a valid V3 wallet');
    });

    it('calls decrypt with pbkdf2 and throws an error because of a wrong PRF property', () => {
        expect(() => {
            Account.fromV3Keystore({version: 3, crypto: {kdf: 'pbkdf2', kdfparams: {prf: 'nope'}}}, 'password', false);
        }).toThrow('Unsupported parameters to PBKDF2');
    });

    it('calls decrypt with unsupported scheme and throws an error', () => {
        expect(() => {
            Account.fromV3Keystore({version: 3, crypto: {kdf: 'asdf'}}, 'password', false);
        }).toThrow('Unsupported key derivation scheme');
    });

    it('calls decrypt and the key derivation failed and throws an error', () => {
        const json = {
            version: 3,
            crypto: {
                kdf: 'pbkdf2',
                mac: 'macs',
                ciphertext: 'xx',
                cipher: 'cipher',
                cipherparams: {
                    iv: ['0x0']
                },
                kdfparams: {
                    c: 1,
                    dklen: 'dklen',
                    salt: 'salt',
                    prf: 'hmac-sha256'
                }
            }
        };

        keccak256.mockReturnValueOnce('0xmac');

        pbkdf2Sync.mockReturnValueOnce(Buffer.from('00000000000000000000000000000000'));

        expect(() => {
            Account.fromV3Keystore(json, 'password', false);
        }).toThrow('Key derivation failed - possibly wrong password');

        expect(pbkdf2Sync).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('salt', 'hex'),
            1,
            'dklen',
            'sha256'
        );

        expect(keccak256).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );
    });

    it('calls toV3Keystore and returns the expected object', () => {
        const options = {};
        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            privateKey: '0xxx',
            address: '0xA'
        });

        randomBytes.mockReturnValue(Buffer.from('random'));

        const cipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        cipher.update.mockReturnValueOnce(Buffer.from('0'));

        cipher.final.mockReturnValueOnce(Buffer.from('0'));

        createCipheriv.mockReturnValue(cipher);

        scryptsy.mockReturnValueOnce(Buffer.from('0000000000000000'));

        keccak256.mockReturnValueOnce('0xmac');

        uuid.v4.mockReturnValueOnce(0);

        expect(Account.fromPrivateKey(mockKey).toV3Keystore('password', options)).toEqual({
            version: 3,
            id: 0,
            address: 'a',
            crypto: {
                ciphertext: '3030',
                cipherparams: {iv: '72616e646f6d'},
                cipher: 'aes-128-ctr',
                kdf: 'scrypt',
                kdfparams: {
                    dklen: 32,
                    salt: '72616e646f6d',
                    n: 8192,
                    p: 1,
                    r: 8
                },
                mac: 'mac'
            }
        });

        expect(fromPrivate).toHaveBeenCalledWith(mockKey);

        expect(randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(randomBytes).toHaveBeenNthCalledWith(3, 16);

        expect(scryptsy).toHaveBeenCalledWith(Buffer.from('password'), Buffer.from('random'), 8192, 8, 1, 32);

        expect(createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );

        expect(cipher.update).toHaveBeenCalledWith(Buffer.from(account.privateKey.replace('0x', ''), 'hex'));

        expect(cipher.final).toHaveBeenCalled();

        expect(keccak256).toHaveBeenCalledWith(
            Buffer.concat([
                Buffer.from('0000000000000000').slice(16, 32),
                Buffer.from(Buffer.concat([Buffer.from('0'), Buffer.from('0')]), 'hex')
            ])
        );

        expect(uuid.v4).toHaveBeenCalledWith({random: Buffer.from('random')});
    });

    it('calls toV3Keystore with the pbkdf2 sheme and returns the expected object', () => {
        const options = {kdf: 'pbkdf2'};
        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            privateKey: '0xxx',
            address: '0xA'
        });

        randomBytes.mockReturnValue(Buffer.from('random'));

        const cipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        cipher.update.mockReturnValueOnce(Buffer.from('0'));

        cipher.final.mockReturnValueOnce(Buffer.from('0'));

        createCipheriv.mockReturnValue(cipher);

        pbkdf2Sync.mockReturnValueOnce(Buffer.from('0000000000000000'));

        keccak256.mockReturnValueOnce('0xmac');

        uuid.v4.mockReturnValueOnce(0);

        expect(Account.fromPrivateKey(mockKey).toV3Keystore('password', options)).toEqual({
            version: 3,
            id: 0,
            address: 'a',
            crypto: {
                ciphertext: '3030',
                cipherparams: {iv: '72616e646f6d'},
                cipher: 'aes-128-ctr',
                kdf: 'pbkdf2',
                kdfparams: {
                    dklen: 32,
                    salt: '72616e646f6d',
                    c: 262144,
                    prf: 'hmac-sha256'
                },
                mac: 'mac'
            }
        });

        expect(fromPrivate).toHaveBeenCalledWith(mockKey);

        expect(randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(randomBytes).toHaveBeenNthCalledWith(3, 16);

        expect(pbkdf2Sync).toHaveBeenCalledWith(Buffer.from('password'), Buffer.from('random'), 262144, 32, 'sha256');

        expect(createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );

        expect(cipher.update).toHaveBeenCalledWith(Buffer.from(account.privateKey.replace('0x', ''), 'hex'));

        expect(cipher.final).toHaveBeenCalled();

        expect(keccak256).toHaveBeenCalledWith(
            Buffer.concat([
                Buffer.from('0000000000000000').slice(16, 32),
                Buffer.from(Buffer.concat([Buffer.from('0'), Buffer.from('0')]), 'hex')
            ])
        );

        expect(uuid.v4).toHaveBeenCalledWith({random: Buffer.from('random')});
    });

    it('calls encrypt with a unsupported sheme', () => {
        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            privateKey: '0xxx',
            address: '0xA'
        });

        randomBytes.mockReturnValue(Buffer.from('random'));

        expect(() => {
            Account.fromPrivateKey(mockKey).toV3Keystore('password', {kdf: 'nope'});
        }).toThrow('Unsupported kdf');

        expect(fromPrivate).toHaveBeenCalledWith(mockKey);

        expect(randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(randomBytes).toHaveBeenNthCalledWith(2, 16);
    });

    it('calls encrypt with a unsupported cipher', () => {
        const options = {kdf: 'pbkdf2'};
        const mockKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

        fromPrivate.mockReturnValueOnce({
            privateKey: '0xxx',
            address: '0xA'
        });

        randomBytes.mockReturnValue(Buffer.from('random'));

        createCipheriv.mockReturnValue(false);

        pbkdf2Sync.mockReturnValueOnce(Buffer.from('0000000000000000'));

        keccak256.mockReturnValueOnce('0xmac');

        expect(() => {
            Account.fromPrivateKey(mockKey).toV3Keystore('password', options);
        }).toThrow('Unsupported cipher');

        expect(fromPrivate).toHaveBeenCalledWith(mockKey);

        expect(randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(pbkdf2Sync).toHaveBeenCalledWith(Buffer.from('password'), Buffer.from('random'), 262144, 32, 'sha256');

        expect(createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );
    });
});
