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
 * @file EthereumProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {EthereumProvider} ethereumProvider
 * @constructor
 */
function EthereumProviderAdapter (ethereumProvider) {
    this.provider = ethereumProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
EthereumProviderAdapter.prototype.send = function (method, parameters) {
    return this.provider.send(method, parameters);
};

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise}
 */
EthereumProviderAdapter.prototype.subscribe = function (subscriptionType, parameters) {
    return this.provider.subscribe(subscriptionType, parameters);
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
EthereumProviderAdapter.prototype.unsubscribe = function (subscriptionId) {
    return this.provider.unsubscribe(subscriptionId);
};

/**
 * @returns {*} //TODO: define return value
 */
EthereumProviderAdapter.prototype.isConnected = function () {
    return this.provider.isConnected();
};
