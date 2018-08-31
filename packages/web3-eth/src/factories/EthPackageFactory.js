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
 * @file EthPackageFactory.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var SubscriptionsResolver = require('../resolvers/SubscriptionsResolver');
var Eth = require('../Eth');


function EthPackageFactory () { }

/**
 * Returns object of type SubscriptionsResolver
 *
 * @method createSubscriptionsResolver
 *
 * @param {Object} provider
 * @param {CoreFactory} coreFactory
 *
 * @returns {SubscriptionsResolver}
 */
EthPackageFactory.prototype.createSubscriptionsResolver = function (provider, coreFactory) {
    return new SubscriptionsResolver(provider, coreFactory)
};

/**
 * Returns object of type Eth
 *
 * @method createEth
 *
 * @param {ConnectionModel} connectionModel
 * @param {PackageFactory} packageFactory
 * @param {CoreFactory} coreFactory
 *
 * @returns {Eth}
 */
EthPackageFactory.prototype.createEth = function (connectionModel, packageFactory, coreFactory) {
    return new Eth(
        connectionModel,
        packageFactory,
        coreFactory,
        this.createSubscriptionsResolver(connectionModel.provider, coreFactory)
    );
};
