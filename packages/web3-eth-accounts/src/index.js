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
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

/* eslint-disable no-underscore-dangle, class-methods-use-this */

import _ from 'lodash';
import core from 'web3-core';
import Method from 'web3-core-method';
import Promise from 'bluebird';
import Account from 'eth-lib/lib/account';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import crypto from 'crypto';
import scryptsy from 'scrypt.js';
import uuidv4 from 'uuid/v4';
import {
    numberToHex,
    sha3,
    hexToNumber,
    hexToUtf8,
    isAddress,
    randomHex,
    isHex,
} from 'web3-utils';
import {
    inputAddressFormatter,
} from 'web3-core-helpers/lib/formatters';

import Wallet from './wallet';

function isNot (value) {
    return _.isUndefined(value) || _.isNull(value);
}

class Accounts {
    constructor (...args) {
        // sets _requestmanager
        core.packageInit(this, args);

        // remove unecessary core functions
        delete this.BatchRequest;
        delete this.extend;

        const _ethereumCall = [
            new Method({
                name: 'getId',
                call: 'net_version',
                params: 0,
                outputFormatter: hexToNumber,
            }),
            new Method({
                name: 'getGasPrice',
                call: 'eth_gasPrice',
                params: 0,
            }),
            new Method({
                name: 'getTransactionCount',
                call: 'eth_getTransactionCount',
                params: 2,
                inputFormatter: [
                    (address) => {
                        if (isAddress(address)) {
                            return address;
                        }
                        throw new Error(`Address ${address} is not a valid address to get the "transactionCount".`);
                    },
                    () => 'latest',
                ],
            }),
        ];

        // attach methods to this._ethereumCall
        this._ethereumCall = {};
        _.each(_ethereumCall, (method) => {
            method.attachToObject(this._ethereumCall);
            method.setRequestManager(this._requestManager);
        });

        this.wallet = new Wallet(this);
    }


    _addAccountFunctions (account) {
        /* eslint-disable no-param-reassign */

        // add sign functions
        account.signTransaction = (tx, callback) => this.signTransaction(
            tx,
            account.privateKey,
            callback,
        );
        account.sign = data => this.sign(
            data,
            account.privateKey,
        );
        account.encrypt = (password, options) => this.encrypt(
            account.privateKey,
            password,
            options,
        );
        return account;

        /* eslint-enable no-param-reassign */
    }

    create (entropy) {
        return this._addAccountFunctions(Account.create(entropy || randomHex(32)));
    }

    privateKeyToAccount (privateKey) {
        return this._addAccountFunctions(Account.fromPrivate(privateKey));
    }

    signTransaction (tx, privateKey, callback) {
        const signed = (txn) => {
            if (!txn.gas && !txn.gasLimit) {
                throw new Error('"gas" is missing');
            }

            const transaction = {
                nonce: numberToHex(txn.nonce),
                to: txn.to ? inputAddressFormatter(txn.to) : '0x',
                data: txn.data || '0x',
                value: txn.value ? numberToHex(txn.value) : '0x',
                gas: numberToHex(txn.gasLimit || txn.gas),
                gasPrice: numberToHex(txn.gasPrice),
                chainId: numberToHex(txn.chainId),
            };

            const hash = Hash.keccak256(Account.transactionSigningData(transaction));
            const rawTransaction = Account.signTransaction(transaction, privateKey);
            const values = RLP.decode(rawTransaction);
            const result = {
                messageHash: hash,
                v: values[6],
                r: values[7],
                s: values[8],
                rawTransaction,
            };

            if (_.isFunction(callback)) {
                callback(null, result);
            }
            return result;
        };

        // Returns synchronously if nonce, chainId and price are provided
        if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
            return signed(tx);
        }

        // Otherwise, get the missing info from the Ethereum Node
        return Promise.all([
            isNot(tx.chainId) ? this._ethereumCall.getId() : tx.chainId,
            isNot(tx.gasPrice) ? this._ethereumCall.getGasPrice() : tx.gasPrice,
            // eslint-disable-next-line max-len
            isNot(tx.nonce) ? this._ethereumCall.getTransactionCount(this.privateKeyToAccount(privateKey).address) : tx.nonce,
        ]).then((args) => {
            if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
                throw new Error(`One of the values "chainId", "gasPrice", or "nonce" couldn't be fetched: ${JSON.stringify(args)}`);
            }

            return signed(_.extend(tx, {
                chainId: args[0],
                gasPrice: args[1],
                nonce: args[2],
            }));
        });
    }

    recoverTransaction (rawTx) {
        return Account.recoverTransaction(rawTx);
    }

    hashMessage (data) {
        const message = isHex(data) ? hexToUtf8(data) : data;
        const ethMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
        return Hash.keccak256s(ethMessage);
    }

    sign (data, privateKey) {
        const hash = this.hashMessage(data);
        const signature = Account.sign(hash, privateKey);
        const vrs = Account.decodeSignature(signature);
        return {
            message: data,
            v: vrs[0],
            r: vrs[1],
            s: vrs[2],
            signature,
        };
    }

    recover (...args) {
        const [h, signature] = args;
        let hash = h;
        if (_.isObject(hash)) {
            const vrs = [hash.v, hash.r, hash.s];
            return this.recover(hash.messageHash, Account.encodeSignature(vrs));
        }

        if (!isHex(hash)) {
            hash = this.hashMessage(hash);
        }

        if (arguments.length === 4) {
            return this.recover(
                hash,
                Account.encodeSignature([].slice.call(args, 1, 4)), // v, r, s
            );
        }
        return Account.recover(hash, signature);
    }

    // Taken from https://github.com/ethereumjs/ethereumjs-wallet
    decrypt (v3Keystore, password, nonStrict) {
        if (!_.isString(password)) {
            throw new Error('No password given.');
        }

        let json;
        if (_.isObject(v3Keystore)) {
            json = v3Keystore;
        } else {
            json = JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);
        }

        if (json.version !== 3) {
            throw new Error('Not a valid V3 wallet');
        }

        let derivedKey;
        let kdfparams;
        if (json.crypto.kdf === 'scrypt') {
            ({ kdfparams } = json.crypto);

            // FIXME: support progress reporting callback
            derivedKey = scryptsy(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.n,
                kdfparams.r,
                kdfparams.p,
                kdfparams.dklen,
            );
        } else if (json.crypto.kdf === 'pbkdf2') {
            ({ kdfparams } = json.crypto);

            if (kdfparams.prf !== 'hmac-sha256') {
                throw new Error('Unsupported parameters to PBKDF2');
            }

            derivedKey = crypto.pbkdf2Sync(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.c,
                kdfparams.dklen,
                'sha256',
            );
        } else {
            throw new Error('Unsupported key derivation scheme');
        }

        const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

        const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
        if (mac !== json.crypto.mac) {
            throw new Error('Key derivation failed - possibly wrong password');
        }

        const decipher = crypto.createDecipheriv(
            json.crypto.cipher,
            derivedKey.slice(0, 16),
            Buffer.from(json.crypto.cipherparams.iv, 'hex'),
        );
        const seed = `0x${Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex')}`;
        return this.privateKeyToAccount(seed);
    }

    encrypt (privateKey, password, options = {}) {
        const account = this.privateKeyToAccount(privateKey);
        const salt = options.salt || crypto.randomBytes(32);
        const iv = options.iv || crypto.randomBytes(16);

        let derivedKey;
        const kdf = options.kdf || 'scrypt';
        const kdfparams = {
            dklen: options.dklen || 32,
            salt: salt.toString('hex'),
        };

        if (kdf === 'pbkdf2') {
            kdfparams.c = options.c || 262144;
            kdfparams.prf = 'hmac-sha256';
            derivedKey = crypto.pbkdf2Sync(
                Buffer.from(password),
                salt,
                kdfparams.c,
                kdfparams.dklen,
                'sha256',
            );
        } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
            kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
            kdfparams.r = options.r || 8;
            kdfparams.p = options.p || 1;
            derivedKey = scryptsy(
                Buffer.from(password),
                salt,
                kdfparams.n,
                kdfparams.r,
                kdfparams.p,
                kdfparams.dklen,
            );
        } else {
            throw new Error('Unsupported kdf');
        }

        const cipher = crypto.createCipheriv(
            options.cipher || 'aes-128-ctr',
            derivedKey.slice(0, 16),
            iv,
        );
        if (!cipher) {
            throw new Error('Unsupported cipher');
        }

        const ciphertext = Buffer.concat([
            cipher.update(Buffer.from(account.privateKey.replace('0x', ''), 'hex')),
            cipher.final(),
        ]);

        const mac = sha3(Buffer.concat([
            derivedKey.slice(16, 32),
            Buffer.from(ciphertext, 'hex'),
        ])).replace('0x', '');

        return {
            version: 3,
            id: uuidv4({ random: options.uuid || crypto.randomBytes(16) }),
            address: account.address.toLowerCase().replace('0x', ''),
            crypto: {
                ciphertext: ciphertext.toString('hex'),
                cipherparams: {
                    iv: iv.toString('hex'),
                },
                cipher: options.cipher || 'aes-128-ctr',
                kdf,
                kdfparams,
                mac: mac.toString('hex'),
            },
        };
    }
}

module.exports = Accounts;
