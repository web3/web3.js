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
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

/**
 * @param {Accounts} accounts
 *
 * @constructor
 */
function Wallet(accounts) {
    this._accounts = accounts;
    this.length = 0;
    this.defaultKeyName = "web3js_wallet";
}

/**
 * Find the safe index in the given pointer
 *
 * @method _findSafeIndex
 * @private
 *
 * @param {Number} pointer
 *
 * @returns {number}
 */
Wallet.prototype._findSafeIndex = function (pointer) {
    pointer = pointer || 0;
    if (_.has(this, pointer)) {
        return this._findSafeIndex(pointer + 1);
    }

    return pointer;
};

/**
 * Gets the current indexes as array
 *
 * @private
 *
 * @returns {Number[]}
 */
Wallet.prototype._currentIndexes = function () {
    return Object.keys(this).map(function (key) {
        return parseInt(key);
    }).filter(function (n) {
        return (n < 9e20);
    });
};

/**
 * Creates a new wallet
 *
 * @method create
 *
 * @param {Number} numberOfAccounts
 * @param {Number} entropy
 *
 * @returns {Wallet}
 */
Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(this._accounts.create(entropy).privateKey);
    }

    return this;
};

/**
 * Adds a account to the wallets
 *
 * @method add
 *
 * @param {Account} account
 *
 * @returns {Account | Account[]}
 */
Wallet.prototype.add = function (account) {

    if (_.isString(account)) {
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
    }

    return this[account.address];
};

/**
 * Removes an account from the wallet array
 *
 * @method remove
 *
 * @param {Number} addressOrIndex
 *
 * @returns {boolean}
 */
Wallet.prototype.remove = function (addressOrIndex) {
    var account = this[addressOrIndex];

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
    }

    return false;
};

/**
 * Removes all addresses from the wallet
 *
 * @method clear
 *
 * @returns {Wallet}
 */
Wallet.prototype.clear = function () {
    var _this = this;
    this._currentIndexes().forEach(function (index) {
        _this.remove(index);
    });

    return this;
};

/**
 * Encodes the wallet
 *
 * @method encrypt
 *
 * @param {String} password
 * @param {Object} options
 *
 * @returns {Account[]}
 */
Wallet.prototype.encrypt = function (password, options) {
    var self = this;

    return this._currentIndexes().map(function (index) {
        return self[index].encrypt(password, options);
    });
};

/**
 * Decodes the wallet
 *
 * @method decrypt
 *
 * @param {Array} encryptedWallet
 * @param {String} password
 *
 * @returns {Wallet}
 */
Wallet.prototype.decrypt = function (encryptedWallet, password) {
    var _this = this;

    encryptedWallet.forEach(function (keystore) {
        var account = _this._accounts.decrypt(keystore, password);

        if (account) {
            _this.add(account);
        } else {
            throw new Error('Couldn\'t decrypt accounts. Password wrong?');
        }
    });

    return this;
};

/**
 * Saves the wallet in the localStorage
 *
 * @method save
 *
 * @param {String} password
 * @param {String} keyName
 *
 * @returns {boolean}
 */
Wallet.prototype.save = function (password, keyName) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));

        return true;
    }

    throw new Error('Can\'t save wallet in localStorage. It is not supported in this environment.');
};

/**
 * Load the stored wallet from localStorage
 *
 * @method load
 *
 * @param {String} password
 * @param {String} keyName
 *
 * @returns {Wallet}
 */
Wallet.prototype.load = function (password, keyName) {
    if (typeof localStorage !== 'undefined') {
        var keystore = localStorage.getItem(keyName || this.defaultKeyName);

        if (keystore) {
            try {
                keystore = JSON.parse(keystore);

                return this.decrypt(keystore, password);
            } catch (e) {
                throw new Error('Invalid keystore in localStorage found!');
            }
        }

        return this;
    }

    throw new Error('Can\'t load wallet from localStorage. It is not supported in this environment');
};
