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

var JSONRpcMapper = require('./JSONRpcMapperMapper.js');

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
        this.provider.send(JSONRpcMapper.toPayload(method, parameters), function(result, error) {
            if(!error) {
                resolve(result);
                return;
            }

            reject(error);
        });

    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.prototype.subscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + this.provider.constructor.name));
    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.prototype.unsubscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + this.provider.constructor.name));
    });
};

/**
 * @returns {boolean}
 */
HttpProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};
