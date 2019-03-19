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
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2019
 */

import isString from 'lodash/isString';
import Account from './Account';

export default class Wallet {
    /**
     * @param {Utils} utils
     * @param {Accounts} accountsModule
     *
     * @constructor
     */
    constructor(utils, accountsModule) {
        this.utils = utils;
        this.accountsModule = accountsModule;
        this.defaultKeyName = 'web3js_wallet';
        this.accounts = {};
        this.accountsIndex = 0;
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
            this.add(Account.from(entropy || this.utils.randomHex(32), this.accountsModule));
        }

        return this;
    }

    /**
     * Returns the account by the given index or address.
     *
     * @method get
     *
     * @param {Number|String} account
     *
     * @returns {Account}
     */
    get(account) {
        return this.accounts[account];
    }

    /**
     * Adds a account to the wallet
     *
     * @method add
     *
     * @param {Account|String} account
     *
     * @returns {Object}
     */
    add(account) {
        if (isString(account)) {
            account = Account.fromPrivateKey(account, this.accountsModule);
        }

        if (!this.accounts[account.address]) {
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
        const account = this.accounts[addressOrIndex];

        if (account) {
            delete this.accounts[account.address];
            delete this.accounts[account.address.toLowerCase()];
            delete this.accounts[account.index];

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
        for (let i = 0; i <= this.accountsIndex; i++) {
            this.remove(i);
        }

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
     * @returns {Account[]}
     */
    encrypt(password, options) {
        let encryptedAccounts = [];

        for (let i = 0; i <= this.accountsIndex; i++) {
            encryptedAccounts.push(this.accounts[i].encrypt(password, options));
        }

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
    decrypt(encryptedWallet, password) {
        encryptedWallet.forEach((keystore) => {
            const account = Account.fromV3Keystore(keystore, password, false, this.accountsModule);

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
    /* istanbul ignore next */ save(password, keyName) {
        console.warn("SECURITY WARNING: It's not highly insecure to store accounts in the localStorage!");

        if (typeof localStorage === 'undefined') {
            throw new TypeError('window.localStorage is undefined.');
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
    /* istanbul ignore next */ load(password, keyName) {
        console.warn("SECURITY WARNING: It's not highly insecure to store accounts in the localStorage!");

        if (typeof localStorage === 'undefined') {
            throw new TypeError('window.localStorage is undefined.');
        }

        let keystore;
        try {
            keystore = localStorage.getItem(keyName || this.defaultKeyName);

            if (keystore) {
                keystore = JSON.parse(keystore).map((item) => {
                    Account.fromV3Keystore(item, password, false, this.accountsModule);
                });
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
