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
 * @file Wallet.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import has from 'lodash/has';
import isString from 'lodash/isString';

class Wallet {
    /**
     * @param {Accounts} accounts
     *
     * @constructor
     */
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
                throw new Error('Couldn\'t decrypt accounts. Password wrong?');
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
        if (typeof localStorage === 'undefined') {
            throw new Error('window.localStorage is undefined.')
        }

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
        if (typeof localStorage === 'undefined') {
            throw new Error('window.localStorage is undefined.')
        }

        let keystore;
        try {
            keystore = localStorage.getItem(keyName || this.defaultKeyName);

            if (keystore) {
                try {
                    keystore = JSON.parse(keystore);
                } catch (error) {
                }
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
