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

var version = require('../package.json').version;
var PromiEventPackage = require('web3-core-promievent');
var MethodPackage = require('web3-core-method');
var ProvidersPackage = require('web3-providers');
var ABIPackage = require('web3-eth-abi');
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;
var Contract = require('./Contract');
var ContractDeployMethodModel = require('./models/methods/ContractDeployMethodModel');
var ContractPackageFactory = require('./factories/ContractPackageFactory');

module.exports = {
    version: version,

    Contract: Contract,
    ContractDeployMethodModel: ContractDeployMethodModel,

    /**
     * Returns an object of type Contract
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Accounts} accounts
     * @param {Object} abi
     * @param {String} address
     * @param {Object} options
     *
     * @returns {Contract}
     */
    createContract: function (provider, accounts, abi, address, options) {
        return new ContractPackageFactory(
            Utils,
            formatters,
            ABIPackage.createAbiCoder(),
            accounts
        ).createContract(
            provider,
            ProvidersPackage,
            MethodPackage.createMethodController(),
            PromiEventPackage,
            abi,
            address,
            options
        );
    }
};
