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
var MethodModelFactory = require('./factories/MethodModelFactory');
var Eth = require('./Eth');
var MethodController = require('web3-core-method').MethodController;
var formatters = require('web3-core-helpers').formatters;
var Network = require('web3-net').Network;
var ProvidersPackage = require('web3-providers');
var Utils = require('web3-utils');
var Accounts = require('web3-eth-accounts').Accounts;
var Personal = require('web3-eth-personal').Personal;
var ENS = require('web3-eth-ens').ENS;
var SubscriptionsFactory = require('web3-core-subscriptions').SubscriptionsFactory;
var AbiCoder = require('web3-eth-abi').AbiCoder;
var Iban = require('web3-eth-iban').Iban;
var ContractPackage = require('web3-eth-contract');

module.exports = {
    version: version,

    /**
     * Creates the Eth object
     *
     * @method Eth
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     *
     * @returns {Eth}
     */
    Eth: function (provider) {
        var accounts = new Accounts(provider);

        return new Eth(
            provider,
            new Network(provider),
            ContractPackage,
            accounts,
            new Personal(provider),
            Iban,
            new AbiCoder(utils),
            new ENS(provider),
            Utils,
            formatters,
            ProvidersPackage,
            new SubscriptionsFactory(),
            new MethodController(),
            new MethodModelFactory(Utils, formatters, accounts)
        );
    }
};
