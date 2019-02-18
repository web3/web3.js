import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {HttpProvider, ProviderDetector, ProviderResolver, ProvidersModuleFactory} from 'web3-providers';
import {GetGasPriceMethod, GetTransactionCountMethod, MethodModuleFactory, VersionMethod} from 'web3-core-method';
import {AbstractWeb3Module} from 'web3-core';
import Account from 'eth-lib/lib/account';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Nat from 'eth-lib/lib/nat';
import Bytes from 'eth-lib/lib/bytes';
import crypto from 'crypto';
import uuid from 'uuid';
import MethodFactory from '../../src/factories/MethodFactory';
import Accounts from '../../src/Accounts';
import scryptSync from '../../src/Scrypt';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('MethodModuleFactory');
jest.mock('eth-lib/lib/account');
jest.mock('eth-lib/lib/rlp');
jest.mock('eth-lib/lib/nat');
jest.mock('eth-lib/lib/bytes');
jest.mock('eth-lib/lib/hash');
jest.mock('crypto');
jest.mock('uuid');

/**
 * Accounts test
 */
describe('AccountsTest', () => {
    let accounts,
        methodFactory,
        methodModuleFactoryMock,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock;

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

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];
        methodModuleFactoryMock.createMethodProxy = jest.fn();

        methodFactory = new MethodFactory(methodModuleFactoryMock, Utils, formatters);

        accounts = new Accounts(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactory,
            Utils,
            formatters,
            {}
        );
    });

    it('constructor check', () => {
        expect(accounts.utils).toEqual(Utils);

        expect(accounts.formatters).toEqual(formatters);

        expect(accounts.wallet.defaultKeyName).toEqual('web3js_wallet');

        expect(accounts).toBeInstanceOf(AbstractWeb3Module);
    });

    it('JSON-RPC methods check', () => {
        expect(accounts.methodFactory.methods).toEqual({
            getGasPrice: GetGasPriceMethod,
            getTransactionCount: GetTransactionCountMethod,
            getId: VersionMethod
        });
    });

    it('calls addAccountFunctions and returns the expected object', () => {
        const object = {};

        expect(accounts._addAccountFunctions(object)).toBeInstanceOf(Object);

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);
    });

    it('calls create with the entropy parameter and returns the expected object', () => {
        const object = {};

        Account.create = jest.fn((entropy) => {
            expect(entropy).toEqual('entropy');

            return object;
        });

        expect(accounts.create('entropy')).toBeInstanceOf(Object);

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);
    });

    it('calls create without the entropy parameter and returns the expected object', () => {
        const object = {};

        Utils.randomHex = jest.fn(() => {
            return '0x0';
        });

        Account.create = jest.fn((entropy) => {
            expect(entropy).toEqual('0x0');

            return object;
        });

        expect(accounts.create()).toBeInstanceOf(Object);

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);

        expect(Utils.randomHex).toHaveBeenCalledWith(32);
    });

    it('calls privateKeyToAccount with the privateKey parameter and returns the expected object', () => {
        const object = {};

        Account.fromPrivate = jest.fn((pk) => {
            expect(pk).toEqual('pk');

            return object;
        });

        expect(accounts.privateKeyToAccount('pk')).toBeInstanceOf(Object);

        expect(object.signTransaction).toBeInstanceOf(Function);

        expect(object.sign).toBeInstanceOf(Function);

        expect(object.encrypt).toBeInstanceOf(Function);
    });

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

    it('calls recoverTransaction and returns the expected string', () => {
        RLP.decode = jest.fn((rawTransaction) => {
            expect(rawTransaction).toEqual('rawTransaction');

            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        });

        Account.encodeSignature = jest.fn((values) => {
            expect(values).toEqual([6, 7, 8]);

            return 'signature';
        });

        Bytes.toNumber = jest.fn((value) => {
            expect(value).toEqual(6);

            return 40;
        });

        Bytes.fromNumber = jest.fn((recovery) => {
            expect(recovery).toEqual(2);

            return 1;
        });

        RLP.encode = jest.fn((signingData) => {
            expect(signingData).toEqual([0, 1, 2, 3, 4, 5, 1, '0x', '0x']);

            return 'encoded';
        });

        Hash.keccak256 = jest.fn((signingDataHex) => {
            expect(signingDataHex).toEqual('encoded');

            return 'hash';
        });

        Account.recover = jest.fn((hash, signature) => {
            expect(hash).toEqual('hash');

            expect(signature).toEqual('signature');

            return 'recovered';
        });

        expect(accounts.recoverTransaction('rawTransaction')).toEqual('recovered');

        expect(Account.recover).toHaveBeenCalled();

        expect(Hash.keccak256).toHaveBeenCalled();

        expect(RLP.encode).toHaveBeenCalled();

        expect(Bytes.fromNumber).toHaveBeenCalled();

        expect(Bytes.toNumber).toHaveBeenCalled();

        expect(Account.encodeSignature).toHaveBeenCalled();

        expect(RLP.decode).toHaveBeenCalled();
    });

    it('calls hashMessage with strict hex and returns the expected string', () => {
        Utils.isHexStrict = jest.fn((data) => {
            expect(data).toEqual('data');

            return true;
        });

        Utils.hexToBytes = jest.fn((data) => {
            expect(data).toEqual('data');

            return 'message';
        });

        Hash.keccak256s = jest.fn((ethMessage) => {
            const messageBuffer = Buffer.from('message');
            const preamble = `\u0019Ethereum Signed Message:\n${'message'.length}`;
            const preambleBuffer = Buffer.from(preamble);
            const message = Buffer.concat([preambleBuffer, messageBuffer]);

            expect(ethMessage).toEqual(message);

            return 'keccak';
        });

        expect(accounts.hashMessage('data')).toEqual('keccak');

        expect(Utils.isHexStrict).toHaveBeenCalled();

        expect(Utils.hexToBytes).toHaveBeenCalled();

        expect(Hash.keccak256s).toHaveBeenCalled();
    });

    it('calls hashMessage with non-strict hex and returns the expected string', () => {
        Utils.isHexStrict = jest.fn((data) => {
            expect(data).toEqual('message');

            return false;
        });

        Hash.keccak256s = jest.fn((ethMessage) => {
            const messageBuffer = Buffer.from('message');
            const preamble = `\u0019Ethereum Signed Message:\n${'message'.length}`;
            const preambleBuffer = Buffer.from(preamble);
            const message = Buffer.concat([preambleBuffer, messageBuffer]);

            expect(ethMessage).toEqual(message);

            return 'keccak';
        });

        expect(accounts.hashMessage('message')).toEqual('keccak');

        expect(Utils.isHexStrict).toHaveBeenCalled();

        expect(Hash.keccak256s).toHaveBeenCalled();
    });

    it('calls sign with non-strict hex and returns the expected string', () => {
        Utils.isHexStrict = jest.fn((data) => {
            expect(data).toEqual('message');

            return false;
        });

        Hash.keccak256s = jest.fn((ethMessage) => {
            const messageBuffer = Buffer.from('message');
            const preamble = `\u0019Ethereum Signed Message:\n${'message'.length}`;
            const preambleBuffer = Buffer.from(preamble);
            const message = Buffer.concat([preambleBuffer, messageBuffer]);

            expect(ethMessage).toEqual(message);

            return 'keccak';
        });

        Account.sign = jest.fn((hash, privateKey) => {
            expect(hash).toEqual('keccak');

            expect(privateKey).toEqual('pk');

            return 'signed';
        });

        Account.decodeSignature = jest.fn((signature) => {
            expect(signature).toEqual('signed');

            return ['v', 'r', 's'];
        });

        expect(accounts.sign('message', 'pk')).toEqual({
            message: 'message',
            messageHash: 'keccak',
            v: 'v',
            r: 'r',
            s: 's',
            signature: 'signed'
        });

        expect(Utils.isHexStrict).toHaveBeenCalled();

        expect(Hash.keccak256s).toHaveBeenCalled();
    });

    it('calls recover with a string as message and returns the expected value', () => {
        Utils.isHexStrict = jest.fn((data) => {
            expect(data).toEqual('message');

            return false;
        });

        Hash.keccak256s = jest.fn((ethMessage) => {
            const messageBuffer = Buffer.from('message');
            const preamble = `\u0019Ethereum Signed Message:\n${'message'.length}`;
            const preambleBuffer = Buffer.from(preamble);
            const message = Buffer.concat([preambleBuffer, messageBuffer]);

            expect(ethMessage).toEqual(message);

            return 'keccak';
        });

        Account.recover = jest.fn((message, signature) => {
            expect(message).toEqual('keccak');

            expect(signature).toEqual('signature');

            return 'recovered';
        });

        expect(accounts.recover('message', 'signature', false)).toEqual('recovered');

        expect(Utils.isHexStrict).toHaveBeenCalled();

        expect(Hash.keccak256s).toHaveBeenCalled();

        expect(Account.recover).toHaveBeenCalled();
    });

    it('calls recover with a object as message and returns the expected value', () => {
        Account.recover = jest.fn((message, signature) => {
            expect(message).toEqual('message');

            expect(signature).toEqual('signature');

            return 'recovered';
        });

        Account.encodeSignature = jest.fn((vrs) => {
            expect(vrs).toEqual(['v', 'r', 's']);

            return 'signature';
        });

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

        expect(Account.recover).toHaveBeenCalled();
    });

    it('calls recover with a string as message, preFixed is true and it returns the expected value', () => {
        Account.recover = jest.fn((message, signature) => {
            expect(message).toEqual('message');

            expect(signature).toEqual('signature');

            return 'recovered';
        });

        Account.encodeSignature = jest.fn((vrs) => {
            expect(vrs).toEqual(['v', 'r', 's']);

            return 'signature';
        });

        expect(accounts.recover('message', 'v', 'r', 's', true)).toEqual('recovered');

        expect(Account.recover).toHaveBeenCalled();
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

        scryptSync.mockReturnValueOnce(Buffer.from('00000000000000000000000000000000'));

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

        expect(scryptSync).toHaveBeenCalledWith(
            Buffer.from('password'),
            Buffer.from('salt', 'hex'),
            'dklen',
            {
              N: 'n',
              r: 'r',
              p: 'p'
            }
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

        scryptSync.mockReturnValueOnce(Buffer.from('0000000000000000'));

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

        expect(scryptSync).toHaveBeenCalledWith(Buffer.from('password'), Buffer.from('random'), 32, {N: 8192, r: 8, p:1});

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
