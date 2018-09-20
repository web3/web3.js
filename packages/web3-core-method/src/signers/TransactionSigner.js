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
 * @file TransactionSigner.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSigner = require('../../lib/signers/AbstractSigner');

function TransactionSigner() { }

/**
 * Signs the given transaction
 *
 * @method sign
 *
 * @param {Object} transaction
 * @param {Accounts} accounts
 *
 * @returns {Promise<boolean|String>}
 */
TransactionSigner.prototype.sign = function (transaction, accounts) {
    var wallet = this.getWallet(transaction.from, accounts);

    return new Promise(function(resolve, reject) {
        if (wallet && wallet.privateKey) {
            delete transaction.from;

            accounts.signTransaction(transaction, wallet.privateKey).then(function(response) {
                resolve(response);
            }).catch(function(error) {
                reject(error);
            });
        }

        reject(new Error('Wallet or privateKey for wallet is not set!'));
    });
};

// Inherit from AbstractSigner
TransactionSigner.prototype = Object.create(AbstractSigner.prototype);
TransactionSigner.prototype.constructor = AbstractSigner.prototype.constructor;

module.exports = TransactionSigner;
