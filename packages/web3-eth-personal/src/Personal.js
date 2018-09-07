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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

/**
 * TODO: Add missing documenation for getAccounts, lockAccount, importRawKey and sendTransaction!
 *
 * @param {ConnectionModel} connectionModel
 * @param {MethodPackage} methodPackage
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
var Personal = function Personal(connectionModel, methodPackage, utils, formatters) {
    this.connectionModel = connectionModel;
    this.methodPackage = methodPackage;
    this.utils = utils;
    this.formatters = formatters;
    this.net = this.connectionModel.getNetworkMethodsAsObject();
};

/**
 * Gets a list of accounts
 *
 * @method getAccounts
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 *
 * @returns {Promise<Array>}
 */
Personal.prototype.getAccounts = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_listAccounts',
        null,
        null,
        this.utils.toChecksumAddress
    ).send(callback);
};

/**
 * Creates an new account
 *
 * @method newAccount
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Personal.prototype.newAccount = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_newAccount',
        null,
        null,
        this.utils.toChecksumAddress
    ).send(callback);
};

/**
 * Unlocks an account
 * TODO: Fix typo in documentation
 *
 * @method unlockAccount
 *
 * @param {String} address
 * @param {String} password
 * @param {Number} unlockDuration
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Personal.prototype.unlockAccount = function (address, password, unlockDuration, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_unlockAccount',
        [address, password, unlockDuration],
        [
            this.formmaters.inputAddressFormatter,
            null,
            null
        ],
        null
    ).send(callback);
};

/**
 * Locks a account by the given address
 *
 * @method lockAccount
 *
 * @param {String} address
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Personal.prototype.lockAccount = function (address, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_lockAccount',
        [address],
        [this.formmaters.inputAddressFormatter],
        null
    ).send(callback);
};

/**
 * Imports the unencrypted key in to the keystore and encrypt it with the given passphrase
 *
 * @method importRawKey
 *
 * @param {String} keydata
 * @param {String} passphrase
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Personal.prototype.importRawKey = function (keydata, passphrase, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_importRawKey',
        [keydata, passphrase],
        null,
        null
    ).send(callback);
};

/**
 * Sends the transaction
 *
 * @method sendTransaction
 *
 * @param {Object} transactionObject
 * @param {String} passphrase
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Personal.prototype.sendTransaction = function (transactionObject, passphrase, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_sendTransaction',
        [transactionObject, passphrase],
        [this.formatters.inputTransactionFormatter, null],
        null
    ).send(callback);
};

/**
 * Signs the given transaction
 *
 * @method signTransaction
 *
 * @param {Object} transactionObject
 * @param {String} passphrase
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Object>}
 */
Personal.prototype.signTransaction = function (transactionObject, passphrase, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_signTransaction',
        [transactionObject, passphrase],
        [this.formatters.inputTransactionFormatter, null],
        null
    ).send(callback);
};

/**
 * Signs a given string
 *
 * @method sign
 *
 * @param {String} data
 * @param {String} address
 * @param {String} password
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Personal.prototype.sign = function (data, address, password, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_sign',
        [data, address, password],
        [this.formatters.inputSignFormatter, this.formatters.inputAddressFormatter, null],
        null
    ).send(callback);
};

/**
 * Recovers a signed string
 *
 * @method ecRecover
 *
 * @param {String} data
 * @param {String} signature
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Personal.prototype.ecRecover = function (data, signature, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'personal_ecRecover',
        [data, address, password],
        [this.formatters.inputSignFormatter, this.formatters.inputAddressFormatter, null],
        null
    ).send(callback);
};

module.exports = Personal;


