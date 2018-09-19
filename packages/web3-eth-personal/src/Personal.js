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

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * TODO: Add missing documentation for getAccounts, lockAccount, importRawKey and sendTransaction!
 *
 * @param {any} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodService} methodService
 * @param {MethodModelFactory} methodModelFactory
 * @param {Network} net
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function Personal(provider, providersPackage, methodService, methodModelFactory, net, utils, formatters) {
    AbstractWeb3Object.call(this, provider, providersPackage, methodService, methodModelFactory);
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
                defaultAccount = utils.toChecksumAddress(formatters.inputAddressFormatter(val));
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

/**
 * Extends setProvider method from AbstractWeb3Object.
 * This is required for updating the provider also in the sub package Net.
 *
 * @param {any} provider
 */
Personal.prototype.setProvider = function (provider) {
    AbstractWeb3Object.setProvider.call(provider);
    this.net.setProvider(provider);
};

Personal.prototype = Object.create(AbstractWeb3Object);

module.exports = Personal;


