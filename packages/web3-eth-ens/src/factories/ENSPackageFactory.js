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
 * @file Registry.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Registry = require('../contracts/Registry');
var Resolver = require('../contracts/Resolver');
var AccountsPackage = require('web3-eth-accounts');
var ContractPackage = require('web3-eth-contract');
var ABIPackage = require('web3-eth-abi');
var PromiEventPackage = require('web3-core-promievent');
var BatchRequestPackage = require('web3-core-batch');
var MethodPackage = require('web3-core-method');
var ProvidersPackage = require('web3-core-providers');
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;

function ENSPackageFactory() {

}

/**
 * Returns an object of type Registry
 *
 * @method createRegistry
 *
 * @param {AbstractProviderAdapter} provider
 * @param {Object} contractOptions
 *
 * @returns {Registry}
 */
ENSPackageFactory.prototype.createRegistry = function (provider, contractOptions) {
    return new Registry(
        this.createENSNetworkDetector(),
        provider,
        ProvidersPackage,
        MethodPackage.createMethodController(),
        BatchRequestPackage,
        ContractPackage.createContractPackageFactory(),
        PromiEventPackage,
        ABIPackage.createAbiCoder(),
        Utils,
        formatters,
        AccountsPackage.createAccounts(),
        ContractPackage.createABIMapper(),
        contractOptions
    );
};

/**
 * Returns an object of type Resolver
 *
 * @method createResolver
 *
 * @param {AbstractProviderAdapter} provider
 * @param {Object} contractOptions
 *
 * @returns {Resolver}
 */
ENSPackageFactory.prototype.createResolver = function (provider, contractOptions) {
    return new Resolver(
        this.createENSNetworkDetector(),
        provider,
        ProvidersPackage,
        MethodPackage.createMethodController(),
        BatchRequestPackage,
        ContractPackage.createContractPackageFactory(),
        PromiEventPackage,
        ABIPackage.createAbiCoder(),
        Utils,
        formatters,
        AccountsPackage.createAccounts(),
        ContractPackage.createABIMapper(),
        contractOptions
    );
};

ENSPackageFactory.prototype.createENS = function () {
};

ENSPackageFactory.prototype.createENSNetworkDetector = function () {

};
