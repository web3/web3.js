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
 * @file AbstractProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var JSONRpcMapper = require('../../src/mappers/JSONRpcMapper.js');
var JSONRpcResponseValidator = require('../../src/validators/JSONRpcResponseValidator.js');
var errors = require('web3-core-helpers').errors;
var EventEmitter = require('eventemitter3');

/**
 * @param {Object} provider
 *
 * @constructor
 */
function AbstractProviderAdapter(provider) {
    this.provider = provider;
}

AbstractProviderAdapter.prototype = Object.create(EventEmitter.prototype);
AbstractProviderAdapter.prototype.constructor = AbstractProviderAdapter;

/**
 * Sends the JSON-RPC request
 *
 * @method send
 *
 * @param {String} method
 * @param {Array} parameters
 *
 * @returns {Promise<any>}
 */
AbstractProviderAdapter.prototype.send = function (method, parameters) {
    var self = this;
    var payload = JSONRpcMapper.toPayload(method, parameters);

    return new Promise(function (resolve, reject) {
        self.provider.send(payload, function (error, response) {
            self.handleResponse(reject, resolve, error, response)
        });

    });
};

/**
 * Sends batch payload
 *
 * @method sendBatch
 *
 * @param {Array} payload
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
AbstractProviderAdapter.prototype.sendBatch = function (payload, callback) {
    this.provider.send(payload, callback);
};

/**
 * Returns Promise with an error if the method is not overwritten
 *
 * @method subscribe
 *
 * @returns {Promise<Error>}
 */
AbstractProviderAdapter.prototype.subscribe = function () {
    var self = this;
    return new Promise(function(resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + self.provider.constructor.name));
    });
};

/**
 * Returns Promise with an error if the method is not overwritten
 *
 * @method unsubscribe
 *
 * @returns {Promise<Error>}
 */
AbstractProviderAdapter.prototype.unsubscribe = function () {
    var self = this;
    return new Promise(function(resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + self.provider.constructor.name));
    });
};

/**
 * Handles the JSON-RPC response
 *
 * @method handleResponse
 *
 * @param {Function} reject
 * @param {Function} resolve
 * @param {Object} error
 * @param {Object} response
 */
AbstractProviderAdapter.prototype.handleResponse = function (reject, resolve, error, response) {
    if (response && response.id && payload.id !== response.id) {
        reject(
            new Error('Wrong response id "' + response.id + '" (expected: "' + payload.id + '") in ' + JSON.stringify(payload))
        );

        return;
    }

    if (response && response.error) {
        reject(errors.ErrorResponse(response));

        return;
    }


    if (!JSONRpcResponseValidator.isValid(response.result)) {
        reject(errors.InvalidResponse(response));

        return;
    }

    if (!error) {
        resolve(response.result);

        return;
    }

    reject(error);
};

/**
 * Checks if the provider is connected
 *
 * @method isConnected
 *
 * @returns {Boolean}
 */
AbstractProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};

module.exports = AbstractProviderAdapter;
