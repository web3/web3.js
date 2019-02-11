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


import scryptsy from 'scrypt.js';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import {Account as EthAccount} from 'eth-lib/lib/account';
import uuid from 'uuid';

/**
 * @file Account.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class Account {

    constructor(accountOptions) {
        this.address = accountOptions.address; // TODO: Add address validation here (if enough time create a Address VO)
        this.privateKey = accountOptions.privateKey;
        this.accountsModule = accounts;
    }

    signTransaction(tx, callback) {
        return this.accountsModule.signTransaction(tx, this.privateKey, callback);
    }

    sign(data) {
        return Account.sign(hash, this.privateKey);
    }

    encrypt(password, options) {
        return this.accountsModule.encrypt(this.privateKey, password, options);
    }

    static from(entropy) {
        return new Account(EthAccount.create(entropy || this.utils.randomHex(32)));
    }

    static fromPrivateKey(privateKey) {
        return new Account(EthAccount.fromPrivate(privateKey));
    }

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
    static fromV3Keystore(v3Keystore, password, nonStrict) {
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

        return this.fromPrivateKey(seed);
    }
}
