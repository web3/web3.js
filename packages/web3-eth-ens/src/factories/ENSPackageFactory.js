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
 * @file ENS.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var ENS = require('./ENS');
var Registry = require('./contracts/Registry');
var ResolverMethodHandler = require('../handlers/ResolverMethodHandler');

function ENSPackageFactory () { }

/**
 * Returns an object of type ENS
 *
 * @method createENS
 *
 * @param {Network} net
 * @param {Accounts} accounts
 * @param {ContractPackage} contractPackage
 * @param {Object} registryAbi
 * @param {Object} resolverAbi
 * @param {PromiEventPackage} promiEventPackage
 *
 * @returns {ENS}
 */
ENSPackageFactory.prototype.createENS = function (
    net,
    accounts,
    contractPackage,
    registryAbi,
    resolverAbi,
    promiEventPackage
) {
    var registry = this.createRegistry(net, accounts, contractPackage, registryAbi, resolverAbi);

    return new ENS(registry, this.createResolverMethodHandler(registry, promiEventPackage));
};

/**
 * Returns an object of type Registry
 *
 * @method createRegistry
 *
 * @param {Network} net
 * @param {Accounts} accounts
 * @param {ContractPackage} contractPackage
 * @param {Object} registryAbi
 * @param {Object} resolverAbi
 *
 * @returns {Registry}
 */
ENSPackageFactory.prototype.createRegistry = function (net, accounts, contractPackage, registryAbi, resolverAbi) {
    return new Registry(net, accounts, contractPackage, registryAbi, resolverAbi);
};

/**
 * Returns an object of type ResolverMethodHandler
 *
 * @method createResolverMethodHandler
 *
 * @param {Registry} registry
 * @param {PromiEventPackage} promiEventPackage
 *
 * @returns {ResolverMethodHandler}
 */
ENSPackageFactory.prototype.createResolverMethodHandler = function (registry, promiEventPackage) {
    return new ResolverMethodHandler(registry, promiEventPackage);
};

module.exports = ENSPackageFactory;
