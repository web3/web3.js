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
 * @file SignAndSendMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {MessageSigner} messageSigner
 *
 * @constructor
 */
function SignMessageCommand(messageSigner) {
    this.messageSigner = messageSigner;
}

/**
 * Executes the SignMessageCommand and returns the signed message
 *
 * @param {String} data
 * @param {String} address
 * @param {Accounts} accounts
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {String}
 */
SignMessageCommand.prototype.execute = function (data, address, accounts, callback) {
    var signedMessage;

    try {
        signedMessage = this.messageSigner.sign(data, address, accounts);
    } catch(error) {
        callback(error, null);

        throw error;
    }

    callback(null, signedMessage);

    return signedMessage;
};

module.exports = SignMessageCommand;
