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
 * @file HttpProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Jsonrpc = require('./jsonrpc.js'); //TODO:  Fix import

// TODO: Methods should have the same behavior like the EthereumProvider.
/**
 * @param {HttpProvider} httpProvider
 * @constructor
 */
function HttpProviderAdapter (httpProvider) {
    this.provider = httpProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
HttpProviderAdapter.prototype.send = function (method, parameters) {
    return new Promise(function(resolve, reject) {
        this.provider.send(Jsonrpc.toPayload(method, parameters), function(result, error) {
            if(!error) {
                resolve(result);
                this.emit('data', result);
                return;
            }

            reject(error);
            this.emit('error', error);
        });

    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.prototype.subscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('HTTP does not support subscriptions'));
    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.prototype.unsubscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('HTTP does not support subscriptions'));
    });
};

/**
 * @returns {boolean}
 */
HttpProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};

HttpProviderAdapter.prototype = new EventEmitter();
