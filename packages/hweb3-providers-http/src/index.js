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
/** @file index.js
 * @authors:
 *   Patryk Matyjasiak <patryk.matyjasiak@arianelabs.com>
 * @date 2022
 */

var { Client, Transaction } = require('@hashgraph/sdk');
var { proto } = require("@hashgraph/proto");

/**
 * HttpProvider should be used to send Hedera node calls
 * @param {Client} client
 */
var HttpProvider = function HttpProvider(client) {
    this.connected = true;

    this.client = client;
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Transaction} tx
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function (tx, callback) {
    var _this = this;

    tx.execute(_this.client)
        .then(response => {
            callback(null, response);
        })
        .catch(error => {
            callback(error, null);
        });
};

/**
 * Should be used to take transaction receipt
 *
 * @method getReceipt
 * @param {proto.ITransactionResponse} txResponse
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.getReceipt = function (txResponse, callback) {
    var _this = this;

    txResponse.getReceipt(_this.client)
        .then(response => {
            callback(null, response);
        })
        .catch(error => {
            callback(error, null);
        });
};

/**
 * Sign a message with given client.
 *
 * @param {String} data
 * @returns {Uint8Array} - The signature bytes without the message
 */
HttpProvider.prototype.sign = function (data) {
    const dataInUint8Array = new TextEncoder().encode(data);
    return this.client.operator.sign(dataInUint8Array);
};

/**
 * Sign a transaction with given client.
 *
 * @param {Transaction} tx
 * @returns {Uint8Array} - The signature bytes without the message
 */
HttpProvider.prototype.signTransaction = function (tx) {
    return this.client.operator.signTransaction(tx);
};

HttpProvider.prototype.disconnect = function () {
    //NO OP
    return false;
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 * @returns {boolean}
 */
HttpProvider.prototype.supportsSubscriptions = function () {
    return false;
};

module.exports = HttpProvider;
