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
var SubscriptionsResolver = require('./resolvers/SubscriptionsResolver');
var Eth = require('./Eth');
var NetPackage = require('web3-net');
var ContractPackage = require('web3-eth-contract');
var AccountsPackage = require('web3-eth-accounts');
var PersonalPackage = require('web3-eth-personal');
var ENSPackage = require('web3-eth-ens');
var AbiPackage = require('web3-eth-abi');
var SubscriptionPackage = require('web3-core-subscription');
var PromiEventPackage = require('web3-core-promiEvent');
var ProvidersPackage = require('web3-core-providers');
var Iban = require('web3-eth-iban').create();
var formatters = require('web3-core-helpers').formatters;
var Utils = require('web3-utils');
var MethodPackage = require('web3-core-method');

module.exports = {
    version: version,

    /**
     * Creates the Eth object
     *
     * @method create
     *
     * @param {any} provider
     *
     * @returns {Eth}
     */
    create: function (provider) {
        return new Eth(
            NetPackage.create(provider),
            ContractPackage.create(provider),
            AccountsPackage.create(provider),
            PersonalPackage.create(provider),
            Iban,
            AbiPackage.create(utils),
            ENSPackage.create(provider),
            Utils,
            formatters,
            MethodPackage,
            new SubscriptionsResolver(provider, formatters, SubscriptionPackage, PromiEventPackage, ProvidersPackage)
        );
    }
};
