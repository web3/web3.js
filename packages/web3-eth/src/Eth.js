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
 * @file Eth.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * @param {Object} provider
 * @param {Network} net
 * @param {Contract} contract
 * @param {Accounts} accounts
 * @param {Personal} personal
 * @param {Iban} iban
 * @param {Abi} abi
 * @param {ENS} ens
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {ProvidersPackage} providersPackage
 * @param {SubscriptionsResolver} subscriptionsResolver
 * @param {MethodModelFactory} methodModelFactory
 * @param {MethodController} methodController
 * @param {BatchRequestPackage} batchRequestPackage
 *
 * @constructor
 */
var Eth = function Eth(
    provider,
    net,
    contract,
    accounts,
    personal,
    iban,
    abi,
    ens,
    utils,
    formatters,
    providersPackage,
    subscriptionsResolver,
    methodController,
    methodModelFactory,
    batchRequestPackage
) {
    AbstractWeb3Object.call(
        this,
        provider,
        providersPackage,
        methodController,
        methodModelFactory,
        null,
        batchRequestPackage
    );

    this.net = net;
    this.Contract = contract;
    this.accounts = accounts;
    this.personal = personal;
    this.iban = iban;
    this.abi = abi;
    this.ens = ens;
    this.utils = utils;
    this.formatters = formatters;
    this.subscriptionsResolver = subscriptionsResolver;

    var defaultAccount = null;
    var defaultBlock = 'latest';

    /**
     * Defines accessors for defaultAccount
     */
    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if (val) {
                defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
            }

            self.Contract.defaultAccount = defaultAccount;
            self.personal.defaultAccount = defaultAccount;
        },
        enumerable: true
    });

    /**
     * Defines accessors for defaultBlock
     */
    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return defaultBlock;
        },
        set: function (val) {
            defaultBlock = val;

            self.Contract.defaultBlock = defaultBlock;
            self.personal.defaultBlock = defaultBlock;
        },
        enumerable: true
    });
};

/**
 * Gets and executes subscription for an given type
 *
 * @method subscribe
 *
 * @param {String} type
 * @param {Array} parameters
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise | Subscription}
 */
Eth.prototype.subscribe = function (type, parameters, callback) {
    return this.subscriptionsResolver.resolve(type, parameters, callback);
};

/**
 * Extends setProvider method from AbstractWeb3Object.
 * This is required for updating the provider also in the sub packages and objects related to Eth.
 *
 * @param {any} provider
 */
Eth.prototype.setProvider = function (provider) {
    AbstractWeb3Object.setProvider.call(provider);

    this.subscriptionsResolver.setProvider(provider);
    this.net.setProvider(provider);
    this.accounts.setProvider(provider);
    this.personal.setProvider(provider);
    this.ens.setProvider(provider);
};

Eth.prototype = Object.create(AbstractWeb3Object.prototype);
Eth.prototype.constructor = Eth;

module.exports = Eth;
