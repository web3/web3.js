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

var JSONRpcMapper = require('../mappers/JSONRpcMapper.js');
var JSONRpcResponseValidator = require('../validators/JSONRpcResponseValidator.js');
var errors = require('web3-core-helpers').errors;

/**
 * @param {Object} provider
 *
 * @constructor
 */
function AbstractProviderAdapter(provider) {
    this.provider = provider;
}

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

// Inherit EventEmitter
AbstractProviderAdapter.prototype = Object.create(EventEmitter.prototype);
AbstractProviderAdapter.prototype.constructor = AbstractProviderAdapter;

module.exports = AbstractProviderAdapter;
