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
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var version = require('package.json').version;
var ContractPackage = require('web3-eth-contract');
var PromiEventPackage = require('web3-core-promievent');
var REGISTRY_ABI = require('../ressources/ABI/Registry');
var RESOLVER_ABI = require('../ressources/ABI/Resolver');
var ENSPackageFactory = require('./factories/ENSPackageFactory');

module.exports = { // TODO: overthink the ens package architecture and refactor it.
    version: version,

    /**
     * Returns the ENS object
     *
     * @method ENS
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Network} net
     * @param {Accounts} accounts
     *
     * @returns {ENS}
     */
    ENS: function (provider, net, accounts) {
        return new ENSPackageFactory().createENS(
            provider,
            net,
            accounts,
            ContractPackage,
            REGISTRY_ABI,
            RESOLVER_ABI,
            PromiEventPackage
        );
    }
};
