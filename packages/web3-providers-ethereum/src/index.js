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
/** @file ethereumprovider.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

var EventEmitter = require('eventemitter3');

/**
 * EthereumProvider should be used to send rpc calls
 */
var EthereumProvider = function EthereumProvider(provider) {
    this.provider = provider;
};

/**
 * @method send
 * @param {string} method
 * @param {Array<any>} params
 * @returns {Promise<Object|Error>}
 */
EthereumProvider.prototype.send = function (method, params) {

};

/**
 * @param {string} subscriptionType
 * @param {Array<any>} params
 * @returns {Promise<string|Error>}
 */
EthereumProvider.prototype.subscribe = function (subscriptionType, params) {

};

/**
 * @param {string} subscriptionId
 * @returns {Promise<string|Error>}
 */
EthereumProvider.prototype.unsubscribe = function (subscriptionId) {

};

// Extends ethereumProvider with EventEmitter
EthereumProvider.prototype = new EventEmitter();

module.exports = EthereumProvider;
