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
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import {encodeSignature, recover} from 'eth-lib/lib/account'; // TODO: Remove this dependency
import {isHexStrict, hexToBytes, randomHex} from 'web3-utils'; // TODO: Use the VO's of a web3-types module.
import {AbstractWeb3Module} from 'web3-core';
import Account from './models/Account';

// TODO: Rename Accounts module to Wallet and move the Wallet class to the eth module.
export default class Accounts extends AbstractWeb3Module {
    /**
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} formatters
     * @param {ChainIdMethod} chainIdMethod
     * @param {GetGasPriceMethod} getGasPriceMethod
     * @param {GetTransactionCountMethod} getTransactionCountMethod
     * @param options
     *
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        formatters,
        chainIdMethod,
        getGasPriceMethod,
        getTransactionCountMethod,
        options
    ) {
        super(provider, providersModuleFactory, null, null, options);
        this.transactionSigner = options.transactionSigner;
        this.formatters = formatters;
        this.chainIdMethod = chainIdMethod;
        this.getGasPriceMethod = getGasPriceMethod;
        this.getTransactionCountMethod = getTransactionCountMethod;
        this.defaultKeyName = 'web3js_wallet';
        this.accounts = {};
        this.accountsIndex = 0;
        this.wallet = this.createWalletProxy();

        return new Proxy(this, {
            get: (target, name) => {
                return target[name];
            }
        });
    }

    /**
     * This is for compatibility reasons and will be removed later when it got added to the eth-module
     *
     * @method createWalletProxy
     *
     * @returns {Accounts}
     */
    createWalletProxy() {
        return new Proxy(this, {
            get: (target, name) => {
                switch (name) {
                    case 'create':
                        return target.addGeneratedAccountsToWallet;
                    case 'encrypt':
                        return target.encryptWallet;
                    case 'decrypt':
                        return target.decryptWallet;
                    case 'clear':
                        return target.clear;
                    default:
                        if(target.accounts[name]) {
                            return target.accounts[name];
                        }
                        
                        return target[name];
                }
            }
        });
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
    addGeneratedAccountsToWallet(numberOfAccounts, entropy) {
        const account = Account.from(entropy || randomHex(32), this);

        for (let i = 0; i < numberOfAccounts; ++i) {
            this.add(account);
        }

        return this;
    }

    /**
     * Adds a account to the wallet
     *
     * @method add
     *
     * @param {Account|String} account - A Account object or privateKey
     *
     * @returns {Account}
     */
    add(account) {
        if (isString(account)) {
            account = Account.fromPrivateKey(account, this);
        }

        if (!this[account.address]) {
            this.accounts[this.accountsIndex] = account;
            this.accounts[account.address] = account;
            this.accounts[account.address.toLowerCase()] = account;

            this.accountsIndex++;

            return account;
        }

        return this.accounts[account.address];
    }

    /**
     * Removes a account from the number by his address or index
     *
     * @method remove
     *
     * @param {String|Number} addressOrIndex
     *
     * @returns {Boolean}
     */
    remove(addressOrIndex) {
        if (this.accounts[addressOrIndex]) {
            Object.keys(this.accounts).forEach((key) => {
                if (this.accounts[key].address === addressOrIndex || key === addressOrIndex) {
                    delete this.accounts[key];

                    this.accountsIndex--;
                }
            });

            return true;
        }

        return false;
    }

    /**
     * Clears the wallet
     *
     * @method clear
     *
     * @returns {Wallet}
     */
    clear() {
        this.accounts = {};
        this.accountsIndex = 0;

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
    encryptWallet(password, options) {
        let encryptedAccounts = [];

        Object.keys(this.accounts).forEach((key) => {
            return encryptedAccounts.push(this.accounts[key].encrypt(password, options));
        });

        return encryptedAccounts;
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
    decryptWallet(encryptedWallet, password) {
        encryptedWallet.forEach((keystore) => {
            const account = Account.fromV3Keystore(keystore, password, false, this);

            if (!account) {
                throw new Error("Couldn't decrypt accounts. Password wrong?");
            }

            this.add(account);
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
        if (typeof localStorage === 'undefined') {
            throw new TypeError('window.localStorage is undefined.');
        }

        try {
            localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encryptWallet(password)));
        } catch (error) {
            // code 18 means trying to use local storage in a iframe
            // with third party cookies turned off
            // we still want to support using web3 in a iframe
            // as by default safari turn these off for all iframes
            // so mask the error
            if (error.code === 18) {
                return true;
            }

            // throw as normal if not
            throw new Error(error);
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
        if (typeof localStorage === 'undefined') {
            throw new TypeError('window.localStorage is undefined.');
        }

        let keystore;
        try {
            keystore = localStorage.getItem(keyName || this.defaultKeyName);

            if (keystore) {
                keystore = JSON.parse(keystore).map((item) => Account.fromV3Keystore(item, password, false, this));
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

        return this.decryptWallet(keystore || [], password);
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
        return Account.from(entropy, this);
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
        return Account.fromPrivateKey(privateKey, this);
    }

    /**
     * TODO: Add deprecation message and extend the signTransaction method in the eth module
     *
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
        const account = Account.fromPrivateKey(privateKey, this);

        if (!tx.chainId) {
            tx.chainId = await this.chainIdMethod.execute(this);
        }

        if (!tx.getGasPrice) {
            tx.getGasPrice = await this.getGasPriceMethod.execute(this);
        }

        if (!tx.nonce) {
            this.getTransactionCountMethod.parameters = [account.address];

            tx.nonce = await this.getTransactionCountMethod.execute(this);
        }

        try {
            const signedTransaction = await account.signTransaction(tx);

            if (isFunction(callback)) {
                callback(false, signedTransaction);
            }

            return signedTransaction;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }
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
        const signature = encodeSignature(values.slice(6, 9));
        const recovery = Bytes.toNumber(values[6]);
        const extraData = recovery < 35 ? [] : [Bytes.fromNumber((recovery - 35) >> 1), '0x', '0x'];
        const signingData = values.slice(0, 6).concat(extraData);
        const signingDataHex = RLP.encode(signingData);

        return recover(Hash.keccak256(signingDataHex), signature);
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
        if (isHexStrict(data)) {
            data = hexToBytes(data);
        }

        return Account.fromPrivateKey(privateKey, this).sign(data);
    }

    /**
     * Recovers the Ethereum address which was used to sign the given data.
     *
     * @method recover
     *
     * @param {String|Object} message
     * @param {String} signature
     * @param {Boolean} preFixed
     *
     * @returns {String}
     */
    recover(message, signature, preFixed) {
        const args = [].slice.apply(arguments);

        if (isObject(message)) {
            return this.recover(message.messageHash, encodeSignature([message.v, message.r, message.s]), true);
        }

        if (!preFixed) {
            if (isHexStrict(message)) {
                message = hexToBytes(message);
            }

            const messageBuffer = Buffer.from(message);
            const preamble = `\u0019Ethereum Signed Message:\n${message.length}`;
            const preambleBuffer = Buffer.from(preamble);
            const ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);

            message = Hash.keccak256s(ethMessage);
        }

        if (args.length >= 4) {
            preFixed = args.slice(-1)[0];
            preFixed = isBoolean(preFixed) ? preFixed : false;

            return this.recover(message, encodeSignature(args.slice(1, 4)), preFixed); // v, r, s
        }

        return recover(message, signature);
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
        return Account.fromV3Keystore(v3Keystore, password, nonStrict, this);
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
        return Account.fromPrivateKey(privateKey, this).toV3Keystore(password, options);
    }
}
