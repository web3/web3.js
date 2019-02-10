/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file Accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import Account from 'eth-lib/lib/account';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import scryptsy from 'scrypt.js';
import uuid from 'uuid';
import {AbstractWeb3Module} from 'web3-core';
const crypto = typeof global === 'undefined' ? require('crypto-browserify') : require('crypto'); // TODO: This should moved later to the factory method

export default class Accounts extends AbstractWeb3Module {
    /**
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AccountsModuleFactory} accountsModuleFactory
     * @param {Object} options
     *
     * @constructor
     */
    constructor(provider, providersModuleFactory, utils, formatters, accountsModuleFactory, transactionSigner, options) {
        super(provider, providersModuleFactory, null, null, options);

        this.utils = utils;
        this.formatters = formatters;
        this.accountsModuleFactory = accountsModuleFactory;
        this.wallet = this.accountsModuleFactory.createWallet(this);
        this.transactionSigner = transactionSigner;
    }

    /**
     * Creates an account with a given entropy
     *
     * @method create
     *
     * @param {String} entropy
     *
     * @returns {Account}
     */
    create(entropy) {
        return this.accountsModuleFactory.createAccount(Account.create(entropy || this.utils.randomHex(32)), this);
    }

    /**
     * Creates an Account object from a privateKey
     *
     * @method privateKeyToAccount
     *
     * @param {String} privateKey
     *
     * @returns {Account}
     */
    privateKeyToAccount(privateKey) {
        return this.accountsModuleFactory.createAccount(Account.fromPrivate(privateKey), this);
    }


    /**
     * Signs a transaction object with the given privateKey
     *
     * @method signTransaction
     *
     * @param {Object} tx
     * @param {String} privateKey
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object>}
     */
    async signTransaction(tx, privateKey, callback) {
        try {
            const transaction = new Transaction(tx);
            const signedTransaction = await this.transactionSigner.sign(transaction, privateKey);
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }

        if (isFunction(callback)) {
            callback(false, signedTransaction);
        }

        return signedTransaction;
    }

    /**
     * Recovers transaction
     *
     * @method recoverTransaction
     *
     * @param {String} rawTx
     *
     * @returns {String}
     */
    recoverTransaction(rawTx) {
        const values = RLP.decode(rawTx);
        const signature = Account.encodeSignature(values.slice(6, 9));
        const recovery = Bytes.toNumber(values[6]);
        const extraData = recovery < 35 ? [] : [Bytes.fromNumber((recovery - 35) >> 1), '0x', '0x'];
        const signingData = values.slice(0, 6).concat(extraData);
        const signingDataHex = RLP.encode(signingData);

        return Account.recover(Hash.keccak256(signingDataHex), signature);
    }

    /**
     * Hashes a given message
     *
     * @method hashMessage
     *
     * @param {String} data
     *
     * @returns {String}
     */
    hashMessage(data) {
        const message = this.utils.isHexStrict(data) ? this.utils.hexToBytes(data) : data;
        const messageBuffer = Buffer.from(message);
        const preamble = `\u0019Ethereum Signed Message:\n${message.length}`;
        const preambleBuffer = Buffer.from(preamble);
        const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);

        return Hash.keccak256s(ethMessage);
    }

    /**
     * Signs a string with the given privateKey
     *
     * @method sign
     *
     * @param {String} data
     * @param {String} privateKey
     *
     * @returns {Object}
     */
    sign(data, privateKey) {
        const hash = this.hashMessage(data);
        const signature = Account.sign(hash, privateKey);
        const vrs = Account.decodeSignature(signature);

        return {
            message: data,
            messageHash: hash,
            v: vrs[0],
            r: vrs[1],
            s: vrs[2],
            signature
        };
    }

    /**
     * Recovers
     *
     * @method recover
     *
     * @param {String|Object} message
     * @param {String} signature
     * @param {Boolean} preFixed
     *
     * @returns {*}
     */
    recover(message, signature, preFixed) {
        const args = [].slice.apply(arguments);

        if (isObject(message)) {
            return this.recover(message.messageHash, Account.encodeSignature([message.v, message.r, message.s]), true);
        }

        if (!preFixed) {
            message = this.hashMessage(message);
        }

        if (args.length >= 4) {
            preFixed = args.slice(-1)[0];
            preFixed = isBoolean(preFixed) ? preFixed : false;

            return this.recover(message, Account.encodeSignature(args.slice(1, 4)), preFixed); // v, r, s
        }

        return Account.recover(message, signature);
    }

    /**
     * Decrypts account
     *
     * Note: Taken from https://github.com/ethereumjs/ethereumjs-wallet
     *
     * @method decrypt
     *
     * @param {Object|String} v3Keystore
     * @param {String} password
     * @param {Boolean} nonStrict
     *
     * @returns {Account}
     */
    decrypt(v3Keystore, password, nonStrict) {
        if (!isString(password)) {
            throw new Error('No password given.');
        }

        const json = isObject(v3Keystore) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

        if (json.version !== 3) {
            throw new Error('Not a valid V3 wallet');
        }

        let derivedKey;
        let kdfparams;
        if (json.crypto.kdf === 'scrypt') {
            kdfparams = json.crypto.kdfparams;

            // FIXME: support progress reporting callback
            derivedKey = scryptsy(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.n,
                kdfparams.r,
                kdfparams.p,
                kdfparams.dklen
            );
        } else if (json.crypto.kdf === 'pbkdf2') {
            kdfparams = json.crypto.kdfparams;

            if (kdfparams.prf !== 'hmac-sha256') {
                throw new Error('Unsupported parameters to PBKDF2');
            }

            derivedKey = crypto.pbkdf2Sync(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.c,
                kdfparams.dklen,
                'sha256'
            );
        } else {
            throw new Error('Unsupported key derivation scheme');
        }

        const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

        const mac = this.utils.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
        if (mac !== json.crypto.mac) {
            throw new Error('Key derivation failed - possibly wrong password');
        }

        const decipher = crypto.createDecipheriv(
            json.crypto.cipher,
            derivedKey.slice(0, 16),
            Buffer.from(json.crypto.cipherparams.iv, 'hex')
        );
        const seed = `0x${Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex')}`;

        return this.privateKeyToAccount(seed);
    }

    /**
     * Encrypts the account
     *
     * @method encrypt
     *
     * @param {String} privateKey
     * @param {String} password
     * @param {Object} options
     *
     * @returns {Object}
     */
    encrypt(privateKey, password, options) {
        const account = this.privateKeyToAccount(privateKey);

        options = options || {};
        const salt = options.salt || crypto.randomBytes(32);
        const iv = options.iv || crypto.randomBytes(16);

        let derivedKey;
        const kdf = options.kdf || 'scrypt';
        const kdfparams = {
            dklen: options.dklen || 32,
            salt: salt.toString('hex')
        };

        if (kdf === 'pbkdf2') {
            kdfparams.c = options.c || 262144;
            kdfparams.prf = 'hmac-sha256';
            derivedKey = crypto.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
        } else if (kdf === 'scrypt') {
            // FIXME: support progress reporting callback
            kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
            kdfparams.r = options.r || 8;
            kdfparams.p = options.p || 1;
            derivedKey = scryptsy(Buffer.from(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
        } else {
            throw new Error('Unsupported kdf');
        }

        const cipher = crypto.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
        if (!cipher) {
            throw new Error('Unsupported cipher');
        }

        const ciphertext = Buffer.concat([
            cipher.update(Buffer.from(account.privateKey.replace('0x', ''), 'hex')),
            cipher.final()
        ]);

        const mac = this.utils
            .sha3(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]))
            .replace('0x', '');

        return {
            version: 3,
            id: uuid.v4({random: options.uuid || crypto.randomBytes(16)}),
            address: account.address.toLowerCase().replace('0x', ''),
            crypto: {
                ciphertext: ciphertext.toString('hex'),
                cipherparams: {
                    iv: iv.toString('hex')
                },
                cipher: options.cipher || 'aes-128-ctr',
                kdf,
                kdfparams,
                mac: mac.toString('hex')
            }
        };
    }
}
