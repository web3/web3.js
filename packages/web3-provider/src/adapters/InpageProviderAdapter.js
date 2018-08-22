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
    along with web3.js.  If not, see <Legacy://www.gnu.org/licenses/>.
*/
/**
 * @file LegacyProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Jsonrpc = require('./jsonrpc.js'); //TODO:  Fix import

/**
 * @param {InpageProvider} legacyProvider
 * @constructor
 */
function InpageProviderAdapter(legacyProvider) {
    this.provider = legacyProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
InpageProviderAdapter.prototype.send = function (method, parameters) {
    return new Promise(function (resolve, reject) {
        this.provider.sendAsync(Jsonrpc.toPayload(method, parameters), function (error, result) {
            if (!error) {
                resolve(result);
                return;
            }

            reject(error);
        });

    });
};

/**
 * @param {Array} payloadBatch
 * @returns {Promise}
 */
InpageProviderAdapter.prototype.sendBatch = function (payloadBatch) {
    return new Promise(function (resolve, reject) {
        this.provider.sendAsync(Jsonrpc.toBatchPayload(payloadBatch), function (error, result) {
            if (!error) {
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
InpageProviderAdapter.prototype.subscribe = function () {
    return new Promise(function (resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + this.provider.constructor.name));
    });
};

/**
 * @returns {Promise<Error>}
 */
InpageProviderAdapter.prototype.unsubscribe = function () {
    return new Promise(function (resolve, reject) {
        reject(new Error('The current provider does not support subscriptions: ' + this.provider.constructor.name));
    });
};

/**
 * @returns {boolean}
 */
InpageProviderAdapter.prototype.isConnected = this.provider.isConnected;
