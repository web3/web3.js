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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var AbstractWeb3Module = require('web3-core').AbstractWeb3Module;

/**
 * TODO: Add missing documentation for getAccounts, lockAccount, importRawKey and sendTransaction!
 *
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {MethodModelFactory} methodModelFactory
 * @param {Network} net
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function Personal(provider, providersPackage, methodController, methodModelFactory, net, utils, formatters) {
    AbstractWeb3Module.call(this, provider, providersPackage, methodController, methodModelFactory);

    this.utils = utils;
    this.formatters = formatters;
    this.net = net;

    var defaultAccount = null;
    var defaultBlock = 'latest';

    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if(val) {
                defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return defaultBlock;
        },
        set: function (val) {
            defaultBlock = val;
        },
        enumerable: true
    });
}

Personal.prototype = Object.create(AbstractWeb3Module);
Personal.prototype.constructor = Personal;

/**
 * Extends setProvider method from AbstractWeb3Module.
 *
 * @method setProvider
 *
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @returns {Boolean}
 */
Personal.prototype.setProvider = function (provider, net) {
    return !!(AbstractWeb3Module.setProvider.call(this, provider, net) && this.net.setProvider(provider, net));
};

module.exports = Personal;


