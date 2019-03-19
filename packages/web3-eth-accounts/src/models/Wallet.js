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

import has from 'lodash/has';
import isString from 'lodash/isString';
import Account from './Account';

export default class Wallet {
    /**
     * @param {Utils} utils
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(utils, accounts) {
        this.utils = utils;
        this.accounts = accounts;
        this.length = 0;
        this.defaultKeyName = 'web3js_wallet';
        this.accounts = {};
        this.accountsIndex = 0;

        return new Proxy(this, {
            get: (target, name) => {
                if (this.readWhiteList.includes(name)) {
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
    create(numberOfAccounts, entropy) {
        const account = Account.from(entropy || this.utils.randomHex(32));

        for (let i = 0; i < numberOfAccounts; ++i) {
            this.add(account.privateKey);
        }

        return this;
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
            account = Account.fromPrivateKey(account);
        }

        if (!this.accounts[account.address]) {
            this.accounts[account.index] = account;
            this.accounts[account.address] = account;
            this.accounts[account.address.toLowerCase()] = account;

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
        const account = this[addressOrIndex];

        if (account && account.address) {
            // address
            this.accounts[account.address].privateKey = null;
            delete this.accounts[account.address];
            // address lowercase
            this.accounts[account.address.toLowerCase()].privateKey = null;
            delete this.accounts[account.address.toLowerCase()];
            // index
            this.accounts[account.index].privateKey = null;
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
        while(let i <= this.accountsIndex) {
            this.remove(i);

            i++;
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

        while(let i <= this.accountsIndex) {
            encryptedAccounts.push(this.accounts[index].encrypt(password, options));

            i++;
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
            const account = Account.fromV3Keystore(keystore, password);

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
    load(password, keyName) {
        if (typeof localStorage === 'undefined') {
            throw new TypeError('window.localStorage is undefined.');
        }

        let keystore;
        try {
            keystore = localStorage.getItem(keyName || this.defaultKeyName);

            if (keystore) {
                keystore = JSON.parse(keystore);
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
