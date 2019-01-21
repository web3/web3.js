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

import {isUndefined, isNull, isObject, isBoolean, isString, has, extend} from 'lodash';
import Account from 'eth-lib/lib/account';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Nat from 'eth-lib/lib/nat';
import Bytes from 'eth-lib/lib/bytes';
import scryptsy from 'scrypt.js';
import uuid from 'uuid';
import {AbstractWeb3Module} from 'web3-core';

const cryp = typeof global === 'undefined' ? require('crypto-browserify') : require('crypto');

const isNot = (value) => {
    return isUndefined(value) || isNull(value);
};

const trimLeadingZero = (hex) => {
    while (hex && hex.startsWith('0x0')) {
        hex = `0x${hex.slice(3)}`;
    }
    return hex;
};

const makeEven = (hex) => {
    if (hex.length % 2 === 1) {
        hex = hex.replace('0x', '0x0');
    }

    return hex;
};

export default class Accounts extends AbstractWeb3Module {
    /**
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {MethodFactory} methodFactory
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     *
     * @constructor
     */
    constructor(provider, providersModuleFactory, methodModuleFactory, methodFactory, utils, formatters, options) {
        super(provider, providersModuleFactory, methodModuleFactory, methodFactory, options);

        this.utils = utils;
        this.formatters = formatters;
        this.wallet = new Wallet(this);
    }

    /**
     * Adds the account functions to the given object
     *
     * @method _addAccountFunctions
     *
     * @param {Object} account
     *
     * @returns {Object}
     */
    _addAccountFunctions(account) {
        // add sign functions
        account.signTransaction = (tx, callback) => {
            return this.signTransaction(tx, account.privateKey, callback);
        };

        account.sign = (data) => {
            return this.sign(data, account.privateKey);
        };

        account.encrypt = (password, options) => {
            return this.encrypt(account.privateKey, password, options);
        };

        return account;
    }

    /**
     * Creates an account with a given entropy
     *
     * @method create
     *
     * @param {String} entropy
     *
     * @returns {Object}
     */
    create(entropy) {
        return this._addAccountFunctions(Account.create(entropy || this.utils.randomHex(32)));
    }

    /**
     * Creates an Account object from a privateKey
     *
     * @method privateKeyToAccount
     *
     * @param {String} privateKey
     *
     * @returns {Object}
     */
    privateKeyToAccount(privateKey) {
        return this._addAccountFunctions(Account.fromPrivate(privateKey));
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
    signTransaction(tx, privateKey, callback) {
        const _this = this;
        let error = false;
        let result;

        callback = callback || (() => {});

        if (!tx) {
            error = new Error('No transaction object given!');

            callback(error);
            return Promise.reject(error);
        }

        function signed(tx) {
            if (!tx.gas && !tx.gasLimit) {
                error = new Error('gas is missing');
            }

            if (tx.nonce < 0 || tx.gas < 0 || tx.gasPrice < 0 || tx.chainId < 0) {
                error = new Error('Gas, gasPrice, nonce or chainId is lower than 0');
            }

            if (error) {
                callback(error);
                return Promise.reject(error);
            }

            try {
                tx = _this.formatters.inputCallFormatter(tx);

                const transaction = tx;
                transaction.to = tx.to || '0x';
                transaction.data = tx.data || '0x';
                transaction.value = tx.value || '0x';
                transaction.chainId = _this.utils.numberToHex(tx.chainId);

                const rlpEncoded = RLP.encode([
                    Bytes.fromNat(transaction.nonce),
                    Bytes.fromNat(transaction.gasPrice),
                    Bytes.fromNat(transaction.gas),
                    transaction.to.toLowerCase(),
                    Bytes.fromNat(transaction.value),
                    transaction.data,
                    Bytes.fromNat(transaction.chainId || '0x1'),
                    '0x',
                    '0x'
                ]);

                const hash = Hash.keccak256(rlpEncoded);

                const signature = Account.makeSigner(Nat.toNumber(transaction.chainId || '0x1') * 2 + 35)(
                    Hash.keccak256(rlpEncoded),
                    privateKey
                );

                const rawTx = RLP.decode(rlpEncoded)
                    .slice(0, 6)
                    .concat(Account.decodeSignature(signature));

                rawTx[6] = makeEven(trimLeadingZero(rawTx[6]));
                rawTx[7] = makeEven(trimLeadingZero(rawTx[7]));
                rawTx[8] = makeEven(trimLeadingZero(rawTx[8]));

                const rawTransaction = RLP.encode(rawTx);

                const values = RLP.decode(rawTransaction);
                result = {
                    messageHash: hash,
                    v: trimLeadingZero(values[6]),
                    r: trimLeadingZero(values[7]),
                    s: trimLeadingZero(values[8]),
                    rawTransaction
                };
            } catch (error) {
                callback(error);
                return Promise.reject(error);
            }

            callback(null, result);

            return result;
        }

        // Resolve immediately if nonce, chainId and price are provided
        if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
            return Promise.resolve(signed(tx));
        }

        // Otherwise, get the missing info from the Ethereum Node
        return Promise.all([
            isNot(tx.chainId) ? _this.getId() : tx.chainId,
            isNot(tx.gasPrice) ? _this.getGasPrice() : tx.gasPrice,
            isNot(tx.nonce) ? _this.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce
        ]).then((args) => {
            if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
                throw new Error(
                    `One of the values 'chainId', 'gasPrice', or 'nonce' couldn't be fetched: ${JSON.stringify(args)}`
                );
            }

            return signed(extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
        });
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
     * @returns {Object}
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

            derivedKey = cryp.pbkdf2Sync(
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

        const decipher = cryp.createDecipheriv(
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
        const salt = options.salt || cryp.randomBytes(32);
        const iv = options.iv || cryp.randomBytes(16);

        let derivedKey;
        const kdf = options.kdf || 'scrypt';
        const kdfparams = {
            dklen: options.dklen || 32,
            salt: salt.toString('hex')
        };

        if (kdf === 'pbkdf2') {
            kdfparams.c = options.c || 262144;
            kdfparams.prf = 'hmac-sha256';
            derivedKey = cryp.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
        } else if (kdf === 'scrypt') {
            // FIXME: support progress reporting callback
            kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
            kdfparams.r = options.r || 8;
            kdfparams.p = options.p || 1;
            derivedKey = scryptsy(Buffer.from(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
        } else {
            throw new Error('Unsupported kdf');
        }

        const cipher = cryp.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
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
            id: uuid.v4({random: options.uuid || cryp.randomBytes(16)}),
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

// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

/**
 * @param {Object} accounts
 *
 * @constructor
 */
class Wallet {
    constructor(accounts) {
        this._accounts = accounts;
        this.length = 0;
        this.defaultKeyName = 'web3js_wallet';
    }

    /**
     * Finds the safe index
     *
     * @method _findSafeIndex
     * @private
     *
     * @param {Number} pointer
     *
     * @returns {*}
     */
    _findSafeIndex(pointer = 0) {
        if (has(this, pointer)) {
            return this._findSafeIndex(pointer + 1);
        } else {
            return pointer;
        }
    }

    /**
     * Gets the correntIndexes array
     *
     * @method _currentIndexes
     * @private
     *
     * @returns {Number[]}
     */
    _currentIndexes() {
        const keys = Object.keys(this);
        const indexes = keys
            .map((key) => {
                return parseInt(key);
            })
            .filter((n) => {
                return n < 9e20;
            });

        return indexes;
    }

    /**
     * Creates new accounts with a given entropy
     *
     * @method create
     *
     * @param {Number} numberOfAccounts
     * @param {String} entropy
     *
     * @returns {Wallet}
     */
    create(numberOfAccounts, entropy) {
        for (let i = 0; i < numberOfAccounts; ++i) {
            this.add(this._accounts.create(entropy).privateKey);
        }
        return this;
    }

    /**
     * Adds a account to the wallet
     *
     * @method add
     *
     * @param {Object} account
     *
     * @returns {Object}
     */
    add(account) {
        if (isString(account)) {
            account = this._accounts.privateKeyToAccount(account);
        }
        if (!this[account.address]) {
            account = this._accounts.privateKeyToAccount(account.privateKey);
            account.index = this._findSafeIndex();

            this[account.index] = account;
            this[account.address] = account;
            this[account.address.toLowerCase()] = account;

            this.length++;

            return account;
        } else {
            return this[account.address];
        }
    }

    /**
     * Removes a account from the number by his address or index
     *
     * @method remove
     *
     * @param {String|Number} addressOrIndex
     *
     * @returns {boolean}
     */
    remove(addressOrIndex) {
        const account = this[addressOrIndex];

        if (account && account.address) {
            // address
            this[account.address].privateKey = null;
            delete this[account.address];
            // address lowercase
            this[account.address.toLowerCase()].privateKey = null;
            delete this[account.address.toLowerCase()];
            // index
            this[account.index].privateKey = null;
            delete this[account.index];

            this.length--;

            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears the wallet
     *
     * @method clear
     *
     * @returns {Wallet}
     */
    clear() {
        const _this = this;
        const indexes = this._currentIndexes();

        indexes.forEach((index) => {
            _this.remove(index);
        });

        return this;
    }

    /**
     * Encrypts all accounts
     *
     * @method encrypt
     *
     * @param {String} password
     * @param {Object} options
     *
     * @returns {any[]}
     */
    encrypt(password, options) {
        const _this = this;
        const indexes = this._currentIndexes();

        const accounts = indexes.map((index) => {
            return _this[index].encrypt(password, options);
        });

        return accounts;
    }

    /**
     * Decrypts all accounts
     *
     * @method decrypt
     *
     * @param {Wallet} encryptedWallet
     * @param {String} password
     *
     * @returns {Wallet}
     */
    decrypt(encryptedWallet, password) {
        const _this = this;

        encryptedWallet.forEach((keystore) => {
            const account = _this._accounts.decrypt(keystore, password);

            if (account) {
                _this.add(account);
            } else {
                throw new Error("Couldn't decrypt accounts. Password wrong?");
            }
        });

        return this;
    }

    /**
     * Saves the current wallet in the localStorage of the browser
     *
     * @method save
     *
     * @param {String} password
     * @param {String} keyName
     *
     * @returns {boolean}
     */
    save(password, keyName) {
        try {
            localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));
        } catch (error) {
            // code 18 means trying to use local storage in a iframe
            // with third party cookies turned off
            // we still want to support using web3 in a iframe
            // as by default safari turn these off for all iframes
            // so mask the error
            if (error.code === 18) {
                return true;
            } else {
                // throw as normal if not
                throw new Error(error);
            }
        }

        return true;
    }

    /**
     * Loads the stored wallet by his keyName from the localStorage of the browser
     *
     * @method load
     *
     * @param {String} password
     * @param {String} keyName
     *
     * @returns {Wallet}
     */
    load(password, keyName) {
        let keystore;
        try {
            keystore = localStorage.getItem(keyName || this.defaultKeyName);

            if (keystore) {
                try {
                    keystore = JSON.parse(keystore);
                } catch (error) {}
            }
        } catch (error) {
            // code 18 means trying to use local storage in a iframe
            // with third party cookies turned off
            // we still want to support using web3 in a iframe
            // as by default safari turn these off for all iframes
            // so mask the error
            if (error.code === 18) {
                keystore = this.defaultKeyName;
            } else {
                // throw as normal if not
                throw new Error(error);
            }
        }

        return this.decrypt(keystore || [], password);
    }
}

try {
    if (typeof localStorage === 'undefined') {
        delete Wallet.prototype.save;
        delete Wallet.prototype.load;
    }
} catch (error) {
    // code 18 means trying to use local storage in a iframe
    // with third party cookies turned off
    // we still want to support using web3 in a iframe
    // as by default safari turn these off for all iframes
    // so mask the error
    if (error.code !== 18) {
        throw new Error(error);
    }
}
