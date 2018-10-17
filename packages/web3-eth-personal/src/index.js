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

var version = require('./package.json').version;
var Personal = require('./Personal');
var MethodController = require('web3-core-method').MethodController;
var Network = require('web3-net').Network;
var ProvidersPackage = require('web3-providers');
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;
var MethodModelFactory = require('./factories/MethodModelFactory');

module.exports = {
    version: version,

    /**
     * Returns the Personal object
     *
     * @method Personal
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     *
     * @returns {Personal}
     */
    Personal: function (provider) {
        return new Personal(
            provider,
            ProvidersPackage,
            new MethodController(),
            new MethodModelFactory(Utils, formatters),
            new Network(provider),
            Utils,
            formatters
        );
    }
};


