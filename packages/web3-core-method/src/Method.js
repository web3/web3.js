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
 * @file Method.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');

/**
 * @param {Object} provider
 * @param {Object} accounts
 * @param {string} rpcMethod
 * @param {array} parameters
 * @param {array} inputFormatters
 * @param {Function} outputFormatter
 * @param {Object} promiEvent
 * @param {Object} transactionConfirmationWorkflow
 * @param {Object} transactionSigner
 * @param {Object} messageSigner
 * @constructor
 */
function Method(
    provider,
    accounts,
    rpcMethod,
    parameters,
    inputFormatters,
    outputFormatter,
    promiEvent,
    transactionConfirmationWorkflow,
    transactionSigner,
    messageSigner
) {
    this.provider = provider;
    this.accounts = accounts;
    this.rpcMethod = rpcMethod;
    this.parameters = parameters;
    this.inputFormatters = inputFormatters;
    this.outputFormatter = outputFormatter;
    this.promiEvent = promiEvent;
    this.transactionConfirmationWorkflow = transactionConfirmationWorkflow;
    this.transactionSigner = transactionSigner;
    this.messageSigner = messageSigner;
}

/**
 * Sends the JSON-RPC request
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise | eventifiedPromise}
 */
Method.prototype.send = function (callback) {
    var self = this;

    if (this.hasWallets()) {
        if (this.isSign(this.rpcMethod)) {
            return this.messageSigner.sign(this.parameters[0], this.parameters[1]);
        }

        if (this.isSendTransaction(this.rpcMethod)) {
            this.rpcMethod = 'eth_sendRawTransaction';
            this.parameters = [this.transactionSigner.sign(this.parameters[0]).rawTransaction];
            return this.sendTransaction(null, callback);
        }
    }

    if (this.isSendTransaction(this.rpcMethod) || this.isSendRawTransaction(this.rpcMethod)) {
        if (this.isGasPriceDefined()) {
            return this.sendTransaction(null, callback);
        }

        this.getGasPrice().then(function (gasPrice) {
            self.sendTransaction(gasPrice, callback)
        });

        return this.promiEvent;
    }

    if (this.isSign(this.rpcMethod)) {
        return this.messageSigner.sign(this.parameters[0], this.parameters[1]);
    }

    return this.call(callback);
};

/**
 * Sends a JSON-RPC call request
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Method.prototype.call = function (callback) {
    var self = this;
    return this.provider.send(this.rpcMethod, this.formatInput(this.parameters)).then(function (response) {
        return self.formatOutput(response, callback)
    });
};


/**
 * Formats the output of an JSON-RPC call request
 *
 * @param {array | string} response
 * @param callback
 * @returns {*}
 */
Method.prototype.formatOutput = function (response, callback) {
    var self = this;

    if (_.isArray(response)) {
        response = response.map(function (responseItem) {
            if (self.outputFormatter && responseItem) {
                return self.outputFormatter(responseItem);
            }

            return responseItem;
        });

        callback(false, response);

        return response;
    }

    if (self.outputFormatter && result) {
        response = self.outputFormatter(response);
    }

    callback(false, response);

    return response;
};

/**
 * Sends the JSON-RPC sendTransaction request
 *
 * @param {string} gasPrice
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise}
 */
Method.prototype.sendTransaction = function (gasPrice, callback) {
    var self = this;

    if (gasPrice && _.isObject(this.parameters[0])) {
        this.parameters.gasPrice = gasPrice;
    }

    this.provider.send(this.rpcMethod, this.formatInput(this.parameters)).then(function (response) {
        self.transactionConfirmationWorkflow.execute(
            response,
            self.promiEvent,
            callback
        );

        self.promiEvent.eventEmitter.emit('transactionHash', response)
    }).catch(function (error) {
        self.promiEvent.reject(error);
        self.promiEvent.on('error', error);
        self.promiEvent.eventEmitter.removeAllListeners();
    });

    return this.promiEvent;
};

/**
 *  Should be called to get the request which can be used in a batch request
 *
 * @returns {Function}
 */
Method.prototype.request = function () {
    return this.send.bind(this);
};

/**
 * Formats the input parameters
 *
 * @param parameters
 *
 * @returns {array}
 */
Method.prototype.formatInput = function (parameters) {
    return this.inputFormatters.map(function (formatter, key) {
        return formatter ? formatter(parameters[key]) : parameters[key];
    });
};

/**
 * Gets the gasPrice with the eth_gasPrice RPC call.
 *
 * @returns {Promise<string>}
 */
Method.prototype.getGasPrice = function () {
  return this.provider.send('eth_gasPrice', []);
};

/**
 * Determines if the JSON-RPC method is sendTransaction
 *
 * @param {string} rpcMethod
 *
 * @returns {boolean}
 */
Method.prototype.isSendTransaction = function (rpcMethod) {
    return rpcMethod === 'eth_sendTransaction';
};

/**
 * Determines if the JSON-RPC method is sendRawTransaction
 *
 * @param {string} rpcMethod
 *
 * @returns {boolean}
 */
Method.prototype.isSendRawTransaction = function (rpcMethod) {
    return rpcMethod === 'eth_sendRawTransaction';
};

/**
 * Determines if the JSON-RPC method is sign.
 *
 * @param {string} rpcMethod
 *
 * @returns {boolean}
 */
Method.prototype.isSign = function (rpcMethod) {
    return rpcMethod === 'eth_sign';
};

/**
 * Determines if gasPrice is defined in the method options
 *
 * @returns {boolean}
 */
Method.prototype.isGasPriceDefined = function () {
    return _.isObject(this.parameters[0]) && typeof this.parameters[0].gasPrice !== 'undefined';
};

/**
 * Check if wallets are defined in the accounts package
 *
 * @returns {boolean}
 */
Method.prototype.hasWallets = function() {
    return this.accounts.wallet.length > 0;
};

module.exports = Method;
