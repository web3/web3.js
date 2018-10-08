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
 * @file Contract.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * @param {AbstractProviderAdapter} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {PromiEventPackage} promiEventPackage
 * @param {ABICoder} abiCoder
 * @param {Object} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 * @param {ABIMapper} abiMapper
 * @param {Object} abi
 * @param {String} address
 * @param {Object} options
 *
 * @constructor
 */
function Contract(
    provider,
    providersPackage,
    methodController,
    contractPackageFactory,
    promiEventPackage,
    abiCoder,
    utils,
    formatters,
    accounts,
    abiMapper,
    abi,
    address,
    options,
) {
    if (!(this instanceof Contract)) {
        throw new Error('Please use the "new" keyword to instantiate a web3.eth.contract() object!');
    }

    if (!abi || !(Array.isArray(abi))) {
        throw new Error('You must provide the json interface of the contract when instantiating a contract object.');
    }

    this.providersPackage = providersPackage;
    this.methodController = methodController;
    this.contractPackageFactory = contractPackageFactory;
    this.abiCoder = abiCoder;
    this.utils = utils;
    this.formatters = formatters;
    this.accounts = accounts;
    this.abiMapper = abiMapper;
    this.options = options;
    this.promiEventPackage = promiEventPackage;
    this.rpcMethodModelFactory = contractPackageFactory.createRpcMethodModelFactory();

    AbstractWeb3Object.call(
        this,
        provider,
        this.providersPackage,
        null,
        null,
    );

    this.defaultBlock = 'latest';
    address = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(address));

    var self = this,
        abiModel = abiMapper.map(abi),
        defaultAccount = null;

    /**
     * Defines accessors for contract address
     */
    Object.defineProperty(this.options, 'address', {
        set: function (value) {
            if (value) {
                address = self.utils.toChecksumAddress(self.formatters.inputAddressFormatter(value));
            }
        },
        get: function () {
            return address;
        },
        enumerable: true
    });

    /**
     * Defines accessors for jsonInterface
     */
    Object.defineProperty(this.options, 'jsonInterface', {
        set: function (value) {
            abiModel = self.abiMapper.map(value);
            self.methods.abiModel = abiModel;
            self.events.abiModel = abiModel;
        },
        get: function () {
            return abiModel;
        },
        enumerable: true
    });

    /**
     * Defines accessors for defaultAccount
     */
    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            if (!defaultAccount) {
                return this.options.from;
            }

            return defaultAccount;
        },
        set: function (val) {
            if (val) {
                defaultAccount = self.utils.toChecksumAddress(self.formatters.inputAddressFormatter(val));
            }

        },
        enumerable: true
    });

    this.methods = contractPackageFactory.createMethodsProxy(
        this,
        abiModel,
        this.methodController,
        this.promiEventPackage
    );

    this.events = contractPackageFactory.createEventSubscriptionsProxy(
        this,
        abiModel,
        this.methodController
    );
}

/**
 * Adds event listeners and creates a subscription, and remove it once its fired.
 *
 * @method once
 *
 * @param {String} eventName
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {undefined}
 */
Contract.prototype.once = function (eventName, options, callback) {
    if (!callback) {
        throw new Error('Once requires a callback function.');
    }

    if (options) {
        delete options.fromBlock;
    }

    var eventSubscription = this.events[event](options, callback);

    eventSubscription.on('data', function() {
        eventSubscription.unsubscribe();
    });
};

/**
 * Returns the past event logs by his name
 *
 * @method getPastEvents
 *
 * @param {String} eventName
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Array>}
 */
Contract.prototype.getPastEvents = function (eventName, options, callback) {
    if (!this.options.jsonInterface.hasEvent(eventName)) {
        throw Error('Event with name "' + eventName + 'does not exists.');
    }

    var pastEventLogsMethodModel = this.rpcMethodModelFactory.createPastEventLogsMethodModel(
        this.options.jsonInterface.getEvent(eventName)
    );
    pastEventLogsMethodModel.parameters = [options];
    pastEventLogsMethodModel.callback = callback;

    return this.methodController.execute(
        pastEventLogsMethodModel,
        this.accounts,
        this
    );
};

/**
 * Deploy an contract and returns an new Contract instance with the correct address set
 *
 * @method deploy
 *
 * @param {Object} options
 *
 * @returns {Promise<Contract>|EventEmitter}
 */
Contract.prototype.deploy = function (options) {
    return this.methods.contractConstructor(options);
};

/**
 * Return an new instance of the Contract object
 *
 * @method clone
 *
 * @returns {Contract}
 */
Contract.prototype.clone = function () {
    return new this.constructor(
        this.currentProvider,
        this.providersPackage,
        this.methodController,
        this.contractPackageFactory,
        this.promiEventPackage,
        this.abiCoder,
        this.utils,
        this.formatters,
        this.accounts,
        this.abiMapper,
        this.options.jsonInterface,
        this.options.address,
        this.options
    );
};

/**
 * Sets the currentProvider and provider property
 *
 * @method setProvider
 *
 * @param {Object|String} provider
 */
Contract.prototype.setProvider = function (provider) {
  AbstractWeb3Object.prototype.setProvider.call(this, provider);

  this.accounts.setProvider(provider);
};

Contract.prototype = Object.create(AbstractWeb3Object.prototype);
Contract.prototype.constructor = Contract;

module.exports = Contract;
