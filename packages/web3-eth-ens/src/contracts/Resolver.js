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

var Contract = require('web3-eth-contract').Contract;
var RESOLVER_ABI = require('../ressources/ABI/Resolver');


/**
 * A wrapper around the ENS resolver contract.
 *
 * @param {ENSNetworkDetector} ensNetworkDetector
 * @param {*} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {BatchRequestPackage} batchRequestPackage
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {PromiEventPackage} promiEventPackage
 * @param {ABICoder} abiCoder
 * @param {Object} utils
 * @param {Object}formatters
 * @param {Accounts} accounts
 * @param {ABIMapper} abiMapper
 * @param {Object} options
 *
 * @constructor
 */
function Resolver(
    ensNetworkDetector,
    provider,
    providersPackage,
    methodController,
    batchRequestPackage,
    contractPackageFactory,
    promiEventPackage,
    abiCoder,
    utils,
    formatters,
    accounts,
    abiMapper,
    options
) {
    Contract.call(this,
        provider,
        providersPackage,
        methodController,
        batchRequestPackage,
        contractPackageFactory,
        promiEventPackage,
        abiCoder,
        utils,
        formatters,
        accounts,
        abiMapper,
        RESOLVER_ABI,
        null,
        options
    );

    ensNetworkDetector.detect().then(function (address) {
        self.options.address = address;
    });
}

Resolver.prototype = Object.create(Contract.prototype);
Resolver.prototype.constructor = Resolver;

module.exports = Resolver;
