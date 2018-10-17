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

var AbstractWeb3Module = require('web3-core').AbstractWeb3Module;

/**
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 * @param {Network} net
 * @param {ContractPackage} contractPackage
 * @param {Accounts} accounts
 * @param {Personal} personal
 * @param {Iban} iban
 * @param {Abi} abi
 * @param {ENS} ens
 * @param {Object} utils
 * @param {Object} formatters
 * @param {ProvidersPackage} providersPackage
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {MethodModelFactory} methodModelFactory
 * @param {MethodController} methodController
 *
 * @constructor
 */
var Eth = function Eth(
    provider,
    net,
    contractPackage,
    accounts,
    personal,
    iban,
    abi,
    ens,
    utils,
    formatters,
    providersPackage,
    subscriptionsFactory,
    methodController,
    methodModelFactory
) {
    AbstractWeb3Module.call(
        this,
        provider,
        providersPackage,
        methodController,
        methodModelFactory
    );

    var self = this;

    this.net = net;
    this.accounts = accounts;
    this.personal = personal;
    this.Iban = Iban;
    this.abi = abi;
    this.ens = ens;
    this.utils = utils;
    this.formatters = formatters;
    this.subscriptionsFactory = subscriptionsFactory;
    this.initiatedContracts = [];

    /**
     * This wrapper function is required for the "new web3.eth.Contract(...)" call.
     *
     * @param {Object} abi
     * @param {String} address
     * @param {Object} options
     *
     * @returns {Contract}
     *
     * @constructor
     */
    this.Contract = function (abi, address, options) {
        var contract = new contractPackage.Contract(self.currentProvider, self.accounts, abi, address, options);
        self.initiatedContracts.push(contract);

        return contract;
    };

    var defaultAccount = null,
        defaultBlock = 'latest';

    /**
     * Defines accessors for defaultAccount
     */
    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if (val) {
                self.initiatedContracts.forEach(function (contract) {
                    contract.defaultAccount = val;
                });

                self.personal.defaultAccount = val;
                defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
            }

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
            self.initiatedContracts.forEach(function (contract) {
                contract.defaultAccount = val;
            });

            self.personal.defaultBlock = defaultBlock;
        },
        enumerable: true
    });
};

Eth.prototype = Object.create(AbstractWeb3Module.prototype);
Eth.prototype.constructor = Eth;

/**
 * Gets and executes subscription for an given type
 *
 * @method subscribe
 *
 * @param {String} type
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise | Subscription}
 */
Eth.prototype.subscribe = function (type, options, callback) {
    switch (type) {
        case 'logs':
            return this.subscriptionsFactory.createLogSubscription(
                this,
                options,
                this.methodModelFactory.createMethodModel('getPastLogs'),
                this.methodController
            ).subscribe(callback);

        case 'newBlockHeaders':
            return this.subscriptionsFactory.createNewHeadsSubscription(
                this
            ).subscribe(callback);

        case 'pendingTransactions':
            return this.subscriptionsFactory.createNewPendingTransactionsSubscription(
                this
            ).subscribe(callback);

        case 'syncing':
            return this.subscriptionsFactory.createSyncingSubscriptionModel(
                this
            ).subscribe(callback);

        default:
            throw Error('Unknown subscription: ' + type);
    }
};

/**
 * Extends setProvider method from AbstractWeb3Module.
 * This is required for updating the provider also in the sub packages and objects related to Eth.
 *
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @returns {Boolean}
 */
Eth.prototype.setProvider = function (provider, net) {
    var setContractProviders = this.initiatedContracts.every(function (contract) {
        return !!contract.setProvider(provider, net);
    });

    return !!(
        AbstractWeb3Module.setProvider.call(this, provider, net) &&
        this.net.setProvider(provider, net) &&
        this.personal.setProvider(provider, net) &&
        this.accounts.setProvider(provider, net) &&
        setContractProviders
    );
};

module.exports = Eth;
