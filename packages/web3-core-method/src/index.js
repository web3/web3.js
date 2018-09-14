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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var version = require('./package.json');
var AccountsPackage = require('web3-eth-accounts');
var MethodPackageFactory = require('./factories/MethodPackageFactory');
var PromiEventPackage = require('web3-core-promievent');
var SubscriptionPackage = require('web3-core-subscription');

module.exports = {
    version: version,

    /**
     * Creates the Method object
     *
     * @method create
     *
     * @param {Object} provider
     * @param {String} rpcMethod
     * @param {Array} parameters
     * @param {Function} inputFormatters
     * @param {Function} outputFormatters
     *
     * @returns {Method}
     */
    create: function (provider, rpcMethod, parameters, inputFormatters, outputFormatters) {
        return new MethodPackageFactory().createMethod(
            provider,
            AccountsPackage.create(),
            rpcMethod,
            parameters,
            inputFormatters,
            outputFormatters,
            PromiEventPackage.create(),
            SubscriptionPackage
        );
    }
};
