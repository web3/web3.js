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
 * @file Network.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var version = require('../package.json').version;
var ProvidersPackage = require('web3-core-providers');
var MethodPackage = require('web3-core-method');
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');
var Network = require('./Network');
var MethodModelFactory = require('./factories/MethodModelFactory');


module.exports = {
    version: version,

    /**
     * Creates the Network Object
     *
     * @method createNetwork
     *
     * @param {Object} provider
     *
     * @returns {Network}
     */
    createNetwork: function (provider) {
        return new Network(
            provider,
            ProvidersPackage,
            MethodPackage.createMethodService(),
            new MethodModelFactory(Utils, formatters),
            formatters,
            utils
        )
    }
};
