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
var Contract = require('web3-eth-contract');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var ENS = require('web3-eth-ens');
var Abi = require('web3-eth-abi');
var Subscription = require('web3-core-subscription');
var PromiEvent = require('web3-core-promiEvent');
var Iban = require('web3-eth-iban').create();
var formatters = require('web3-core-helpers').create().formatters;
var Utils = require('web3-utils').create();

module.exports = {
    version: version,

    /**
     * Creates the Eth object
     *
     * @method create
     *
     * @param {ConnectionModel} connectionModel
     *
     * @returns {Eth}
     */
    create: function (connectionModel) {
        return new Eth(
            connectionModel,
            Contract.create(connectionModel),
            Accounts.create(connectionModel),
            Personal.create(connectionModel),
            Iban,
            Abi.create(utils),
            ENS.create(connectionModel),
            Utils,
            formatters,
            new SubscriptionsResolver(connectionModel.provider, formatters, Subscription, PromiEvent)
        );
    }
};
