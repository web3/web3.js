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
 * @param {string} rpcMethod
 * @param {array} parameters
 * @param {array} inputFormatters
 * @param {Function} outputFormatter
 * @param {Object} promiEvent
 * @param {Object} transactionConfirmationWorkflow
 * @constructor
 */
function Method(// TODO: Add transaction signing
    provider,
    rpcMethod,
    parameters,
    inputFormatters,
    outputFormatter,
    promiEvent,
    transactionConfirmationWorkflow
) {
    this.provider = provider;
    this.rpcMethod = rpcMethod;
    this.parameters = parameters;
    this.inputFormatters = inputFormatters;
    this.outputFormatter = outputFormatter;
    this.promiEvent = promiEvent;
    this.transactionConfirmationWorkflow = transactionConfirmationWorkflow;
}

/**
 * Sends and rpc request
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise | eventifiedPromise}
 */
Method.prototype.send = function (callback) {
    var self = this;

    if (this.isSendTransaction(this.rpcMethod)) {
        if (this.isGasPriceDefined()) {
            return this.sendTransaction(null, callback);
        }

        this.getGasPrice().then(function (gasPrice) {
            self.sendTransaction(gasPrice, callback)
        });

        return this.promiEvent;
    }

    return this.call(callback);
};

/**
 * Handles a call request
 *
 * @param callback
 * @returns {Promise}
 */
Method.prototype.call = function (callback) {
    var self = this;
    return this.provider.send(this.rpcMethod, this.formatInput(this.parameters)).then(function (response) {
        return self.formatOutput(response, callback)
    });
};


/**
 * Handle call response
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
 * Handles an sendTransaction request
 *
 * @param {string} gasPrice
 * @param {Function} callback
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
 * Formatts the input parameters
 *
 * @param parameters
 * @returns {array}
 */
Method.prototype.formatInput = function (parameters) {
    return this.inputFormatters.map(function (formatter, key) {
        return formatter ? formatter(parameters[key]) : parameters[key];
    });
};

/**
 * Gets the gasPrice with the eth_gasPrice RPC call.
 * @returns {Promise<string>}
 */
Method.prototype.getGasPrice = function () {
  return this.provider.send('eth_gasPrice', []);
};

/**
 * Determines if the JSON-RPC method is a sendTransaction method
 *
 * @param {string} rpcMethod
 * @returns {boolean}
 */
Method.prototype.isSendTransaction = function (rpcMethod) {
    return rpcMethod === 'eth_sendTransaction' || rpcMethod === 'eth_sendRawTransaction';
};

/**
 * Determines if gasPrice is defined in method options
 *
 * @returns {boolean}
 */
Method.prototype.isGasPriceDefined = function () {
    return _.isObject(this.parameters[0]) && typeof this.parameters[0].gasPrice !== 'undefined';
};
