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
 * @file Account.js
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2019
 */

import scryptsy from 'scrypt.js';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import * as EthAccount from 'eth-lib/lib/account'; // TODO: Remove this dependency
import uuid from 'uuid';
import Hash from 'eth-lib/lib/hash';
import {isHexStrict, hexToBytes, randomHex} from 'web3-utils'; // TODO: Use the VO's of a web3-types module.
const crypto = typeof global === 'undefined' ? require('crypto-browserify') : require('crypto');

export default class Account {
    /**
     * @param {Object} options TODO: Pass a Address VO in the options
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(options, accounts = null) {
        this.address = options.address;
        this.privateKey = options.privateKey;
        this.accounts = accounts;

        return new Proxy(this, {
            get: (target, name) => {
                return target[name];
            }
        });
    }

    /**
     * TODO: Add deprecation message, remove accounts dependency and extend the signTransaction method in the eth module.
     * Signs a transaction object with the given privateKey
     *
     * @method signTransaction
     *
     * @param {Object} tx
     * @param {String} privateKey
     * @param {Function }callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object>}
     */
    signTransaction(tx, privateKey, callback) {
        return this.accounts.signTransaction(tx, this.privateKey, callback);
    }

    /**
     * This method does sign a given string with the current account.
     *
     * @method sign
     *
     * @param {String} data
     *
     * @returns {String}
     */
    sign(data) {
        if (isHexStrict(data)) {
            data = hexToBytes(data);
        }

        const messageBuffer = Buffer.from(data);
        const preamble = `\u0019Ethereum Signed Message:\n${message.length}`;
        const preambleBuffer = Buffer.from(preamble);
        const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
        const hash = Hash.keccak256s(ethMessage);
        const signature = EthAccount.sign(hash, this.privateKey);
        const vrs = EthAccount.decodeSignature(signature);

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
     * This methods returns the EncryptedKeystoreV3Json object from the current account.
     *
     * @param {String} password
     * @param {Object} options
     *
     * @returns {EncryptedKeystoreV3Json | {version, id, address, crypto}}
     */
    encrypt(password, options) {
        return Account.fromPrivateKey(this.privateKey, this.accounts.transactionSinger).toV3Keystore(password, options);
    }

    /**
     * This static methods gives us the possibility to create a new account.
     *
     * @param {String} entropy
     * @param {TransactionSigner} transactionSigner
     *
     * @returns {Account}
     */
    static from(entropy, transactionSigner = null) {
        return new Account(EthAccount.create(entropy || randomHex(32)), this.accounts.transactionSigner);
    }

    /**
     * This static method gived us the possibility to create a Account object from a private key.
     *
     * @param {String} privateKey
     * @param {TransactionSigner} transactionSigner
     *
     * @returns {Account}
     */
    static fromPrivateKey(privateKey, transactionSigner = null) {
        return new Account(EthAccount.fromPrivate(privateKey), this.accounts.transactionSigner);
    }

    /**
     * This method will map the current Account object to V3Keystore object.
     *
     * @method toV3Keystore
     *
     * @param {String} password
     * @param {Object} options
     *
     * @returns {{version, id, address, crypto}}
     */
    toV3Keystore(password, options) {
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
            cipher.update(Buffer.from(this.privateKey.replace('0x', ''), 'hex')),
            cipher.final()
        ]);

        const mac = this.utils
            .sha3(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]))
            .replace('0x', '');

        return {
            version: 3,
            id: uuid.v4({random: options.uuid || crypto.randomBytes(16)}),
            address: this.address.toLowerCase().replace('0x', ''),
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

    /**
     * TODO: Clean up this method
     *
     * Returns an Account object by the given V3Keystore object.
     *
     * Note: Taken from https://github.com/ethereumjs/ethereumjs-wallet
     *
     * @method fromV3Keystore
     *
     * @param {Object|String} v3Keystore
     * @param {String} password
     * @param {Boolean} nonStrict
     * @param {TransactionSigner} transactionSigner
     *
     * @returns {Account}
     */
    static fromV3Keystore(v3Keystore, password, nonStrict = false, transactionSigner = null) {
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

        return this.fromPrivateKey(seed, this.accounts.transactionSigner);
    }
}
