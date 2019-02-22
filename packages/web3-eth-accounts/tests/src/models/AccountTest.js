import scryptsy from 'scrypt.js';
import crypto from 'crypto';
import uuid from 'uuid';
import Hash from 'eth-lib/lib/hash';
import TransactionSigner from '../../__mocks__/TransactionSigner';
import Account from '../../../src/models/Account';

// Mocks
jest.mock('');

/**
 * AccountTest test
 */
describe('AccountTestTest', () => {
    let account, transactionSignerMock;

    beforeEach(() => {
        transactionSignerMock = new TransactionSigner();

        account = new Account({address: 'address', privateKey: 'pk'}, transactionSignerMock);
    });

    it('constructor check', () => {
        expect(account.address).toEqual('address');

        expect(account.privateKey).toEqual('pk');

        expect(account.transactionSigner).toEqual(transactionSignerMock);
    });

    it('calls signTransaction and returns the expected value', () => {
        transactionSignerMock.sign.mockReturnValueOnce(true);

        expect(account.sign({})).toEqual(true);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith({}, 'pk');
    });

    it('calls sign with non-strict hex and returns the expected string', () => {
        Hash.keccak256s.mockReturnValueOnce('keccak');

        Account.sign.mockReturnValueOnce('signed');

        Account.decodeSignature.mockReturnValueOnce(['v', 'r', 's']);

        expect(account.sign('message')).toEqual({
            message: 'message',
            messageHash: 'keccak',
            v: 'v',
            r: 'r',
            s: 's',
            signature: 'signed'
        });

        expect(Hash.keccak256s)
            .toHaveBeenCalledWith(
                Buffer.concat(
                    [Buffer.from(`\u0019Ethereum Signed Message:\n${'message'.length}`), Buffer.from('message')]
                )
            );

        expect(Account.sign).toHaveBeenCalledWith('keccak', 'pk');

        expect(Account.decodeSignature).toHaveBeenCalledWith('signed');
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

    it('calls decrypt and returns the expected object', () => {
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

        const object = {};

        Account.fromPrivate = jest.fn((seed) => {
            expect(seed).toEqual(`0x${Buffer.concat([Buffer.from('0'), Buffer.from('0')]).toString('hex')}`);

            return object;
        });

        scryptsy.mockReturnValueOnce(Buffer.from('00000000000000000000000000000000'));

        Utils.sha3.mockReturnValueOnce('0xmac');

        const decipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        decipher.update.mockReturnValueOnce(Buffer.from('0'));

        decipher.final.mockReturnValueOnce(Buffer.from('0'));

        crypto.createDecipheriv = jest.fn((cipher, derivedKey, buffer) => {
            expect(cipher).toEqual('cipher');

            expect(derivedKey).toEqual(Buffer.from('0000000000000000'));

            expect(buffer).toEqual(Buffer.from(['0x0'], 'hex'));

            return decipher;
        });

        expect(accounts.decrypt(json, 'password', false)).toEqual(object);

        expect(scryptsy).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('salt', 'hex'),
            'n',
            'r',
            'p',
            'dklen'
        );

        expect(Utils.sha3).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );

        expect(crypto.createDecipheriv).toHaveBeenCalled();

        expect(decipher.update).toHaveBeenCalledWith(Buffer.from(json.crypto.ciphertext, 'hex'));

        expect(decipher.final).toHaveBeenCalled();

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);
    });

    it('calls decrypt with pbkdf2 and returns the expected object', () => {
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

        const object = {};

        Account.fromPrivate = jest.fn((seed) => {
            expect(seed).toEqual(`0x${Buffer.concat([Buffer.from('0'), Buffer.from('0')]).toString('hex')}`);

            return object;
        });

        Utils.sha3.mockReturnValueOnce('0xmac');

        const decipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        decipher.update.mockReturnValueOnce(Buffer.from('0'));

        decipher.final.mockReturnValueOnce(Buffer.from('0'));

        crypto.createDecipheriv = jest.fn((cipher, derivedKey, buffer) => {
            expect(cipher).toEqual('cipher');

            expect(derivedKey).toEqual(Buffer.from('0000000000000000'));

            expect(buffer).toEqual(Buffer.from(['0x0'], 'hex'));

            return decipher;
        });

        crypto.pbkdf2Sync = jest.fn((password, salt, c, dklen, sha256) => {
            expect(password).toEqual(Buffer.from(password));

            expect(salt).toEqual(Buffer.from('salt', 'hex'));

            expect(c).toEqual(1);

            expect(dklen).toEqual('dklen');

            expect(sha256).toEqual('sha256');

            return Buffer.from('00000000000000000000000000000000');
        });

        expect(accounts.decrypt(json, 'password', false)).toEqual(object);

        expect(crypto.pbkdf2Sync).toHaveBeenCalled();

        expect(Utils.sha3).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );

        expect(crypto.createDecipheriv).toHaveBeenCalled();

        expect(decipher.update).toHaveBeenCalledWith(Buffer.from(json.crypto.ciphertext, 'hex'));

        expect(decipher.final).toHaveBeenCalled();

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);
    });

    it('calls decrypt and throws an error because of the missing password paramerter', () => {
        expect(() => {
            accounts.decrypt('');
        }).toThrow('No password given.');
    });

    it('calls decrypt and throws an error because of a wrong keystore version', () => {
        expect(() => {
            accounts.decrypt({version: 0}, 'password', false);
        }).toThrow('Not a valid V3 wallet');
    });

    it('calls decrypt with pbkdf2 and throws an error because of a wrong PRF property', () => {
        expect(() => {
            accounts.decrypt({version: 3, crypto: {kdf: 'pbkdf2', kdfparams: {prf: 'nope'}}}, 'password', false);
        }).toThrow('Unsupported parameters to PBKDF2');
    });

    it('calls decrypt with unsupported scheme and throws an error', () => {
        expect(() => {
            accounts.decrypt({version: 3, crypto: {kdf: 'asdf'}}, 'password', false);
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

        Utils.sha3.mockReturnValueOnce('0xmac');

        crypto.pbkdf2Sync = jest.fn((password, salt, c, dklen, sha256) => {
            expect(password).toEqual(Buffer.from(password));

            expect(salt).toEqual(Buffer.from('salt', 'hex'));

            expect(c).toEqual(1);

            expect(dklen).toEqual('dklen');

            expect(sha256).toEqual('sha256');

            return Buffer.from('00000000000000000000000000000000');
        });

        expect(() => {
            accounts.decrypt(json, 'password', false);
        }).toThrow('Key derivation failed - possibly wrong password');

        expect(crypto.pbkdf2Sync).toHaveBeenCalled();

        expect(Utils.sha3).toHaveBeenCalledWith(
            Buffer.concat([Buffer.from('0000000000000000'), Buffer.from(json.crypto.ciphertext, 'hex')])
        );
    });


    it('calls encrypt and returns the expected object', () => {
        const account = {
            privateKey: '0xxx',
            address: '0xA'
        };

        const options = {};

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return account;
        });

        crypto.randomBytes.mockReturnValue(Buffer.from('random'));

        const cipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        cipher.update.mockReturnValueOnce(Buffer.from('0'));

        cipher.final.mockReturnValueOnce(Buffer.from('0'));

        crypto.createCipheriv.mockReturnValue(cipher);

        scryptsy.mockReturnValueOnce(Buffer.from('0000000000000000'));

        Utils.sha3.mockReturnValueOnce('0xmac');

        uuid.v4.mockReturnValueOnce(0);

        expect(accounts.encrypt('pk', 'password', options)).toEqual({
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

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(3, 16);

        expect(scryptsy).toHaveBeenCalledWith(Buffer.from('password'), Buffer.from('random'), 8192, 8, 1, 32);

        expect(crypto.createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );

        expect(cipher.update).toHaveBeenCalledWith(Buffer.from(account.privateKey.replace('0x', ''), 'hex'));

        expect(cipher.final).toHaveBeenCalled();

        expect(Utils.sha3).toHaveBeenCalledWith(
            Buffer.concat([
                Buffer.from('0000000000000000').slice(16, 32),
                Buffer.from(Buffer.concat([Buffer.from('0'), Buffer.from('0')]), 'hex')
            ])
        );

        expect(uuid.v4).toHaveBeenCalledWith({random: Buffer.from('random')});
    });

    it('calls encrypt with the pbkdf2 sheme and returns the expected object', () => {
        const account = {
            privateKey: '0xxx',
            address: '0xA'
        };

        const options = {kdf: 'pbkdf2'};

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return account;
        });

        crypto.randomBytes.mockReturnValue(Buffer.from('random'));

        const cipher = {
            update: jest.fn(),
            final: jest.fn()
        };

        cipher.update.mockReturnValueOnce(Buffer.from('0'));

        cipher.final.mockReturnValueOnce(Buffer.from('0'));

        crypto.createCipheriv.mockReturnValue(cipher);

        crypto.pbkdf2Sync = jest.fn(() => {
            return Buffer.from('0000000000000000');
        });

        Utils.sha3.mockReturnValueOnce('0xmac');

        uuid.v4.mockReturnValueOnce(0);

        expect(accounts.encrypt('pk', 'password', options)).toEqual({
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

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(3, 16);

        expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('random'),
            262144,
            32,
            'sha256'
        );

        expect(crypto.createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );

        expect(cipher.update).toHaveBeenCalledWith(Buffer.from(account.privateKey.replace('0x', ''), 'hex'));

        expect(cipher.final).toHaveBeenCalled();

        expect(Utils.sha3).toHaveBeenCalledWith(
            Buffer.concat([
                Buffer.from('0000000000000000').slice(16, 32),
                Buffer.from(Buffer.concat([Buffer.from('0'), Buffer.from('0')]), 'hex')
            ])
        );

        expect(uuid.v4).toHaveBeenCalledWith({random: Buffer.from('random')});
    });

    it('calls encrypt with a unsupported sheme', () => {
        const account = {
            privateKey: '0xxx',
            address: '0xA'
        };

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return account;
        });

        crypto.randomBytes.mockReturnValue(Buffer.from('random'));

        expect(() => {
            accounts.encrypt('pk', 'password', {kdf: 'nope'});
        }).toThrow('Unsupported kdf');

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(2, 16);
    });

    it('calls encrypt with a unsupported cipher', () => {
        const account = {
            privateKey: '0xxx',
            address: '0xA'
        };

        const options = {kdf: 'pbkdf2'};

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return account;
        });

        crypto.randomBytes.mockReturnValue(Buffer.from('random'));

        crypto.createCipheriv.mockReturnValue(false);

        crypto.pbkdf2Sync = jest.fn(() => {
            return Buffer.from('0000000000000000');
        });

        Utils.sha3.mockReturnValueOnce('0xmac');

        expect(() => {
            accounts.encrypt('pk', 'password', options);
        }).toThrow('Unsupported cipher');

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(1, 32);

        expect(crypto.randomBytes).toHaveBeenNthCalledWith(2, 16);

        expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('random'),
            262144,
            32,
            'sha256'
        );

        expect(crypto.createCipheriv).toHaveBeenCalledWith(
            'aes-128-ctr',
            Buffer.from('0000000000000000').slice(0, 16),
            Buffer.from('random')
        );
    });
});
