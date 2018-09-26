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
 * @param {SubscriptionPackage} subscriptionPackage
 * @param {BatchRequestPackage} batchRequestPackage
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {AbiCoder} abiCoder
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 * @param {AbiMapper} abiMapper
 * @param {Array} abi
 * @param {String} address
 * @param {Object} options
 *
 * @constructor
 */
function Contract(
    provider,
    providersPackage,
    methodController,
    subscriptionPackage,
    batchRequestPackage,
    contractPackageFactory,
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

    this.provider = provider;
    this.providersPackage = providersPackage;
    this.methodController = methodController;
    this.subscriptionPackage = subscriptionPackage;
    this.batchRequestPackage = batchRequestPackage;
    this.contractPackageFactory = contractPackageFactory;
    this.abiCoder = abiCoder;
    this.utils = utils;
    this.formatters = formatters;
    this.accounts = accounts;
    this.abiMapper = abiMapper;
    this.options = options;

    AbstractWeb3Object.call(
        this,
        this.provider,
        this.providersPackage,
        null,
        null,
        this.subscriptionPackage,
        this.batchRequestPackage
    );

    var self = this,
        _address = self.utils.toChecksumAddress(self.formatters.inputAddressFormatter(address)),
        abiModel = abiMapper.map(abi);

    Object.defineProperty(this.options, 'address', {
        set: function (value) {
            if (value) {
                _address = self.utils.toChecksumAddress(self.formatters.inputAddressFormatter(value));
            }
        },
        get: function () {
            return _address;
        },
        enumerable: true
    });

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

    this.methods = contractPackageFactory.createMethodsProxy(
        abiModel,
        this.methodController,
        this.abiCoder,
        this.utils,
        this.formatters,
        this.accounts
    );

    this.events = contractPackageFactory.createEventsSubscriptionsProxy();
}

Contract.prototype.once = function (event, options, callback) {
    // var args = Array.prototype.slice.call(arguments);
    //
    // // get the callback
    // callback = this._getCallback(args);
    //
    // if (!callback) {
    //     throw new Error('Once requires a callback as the second parameter.');
    // }
    //
    // // don't allow fromBlock
    // if (options)
    //     delete options.fromBlock;
    //
    // // don't return as once shouldn't provide "on"
    // this._on(event, options, function (err, res, sub) {
    //     sub.unsubscribe();
    //     if (_.isFunction(callback)) {
    //         callback(err, res, sub);
    //     }
    // });
    //
    // return undefined;
};

Contract.prototype.getPastEvents = function () {
    // var subOptions = this._generateEventOptions.apply(this, arguments);
    //
    // var getPastLogs = new Method({
    //     name: 'getPastLogs',
    //     call: 'eth_getLogs',
    //     params: 1,
    //     inputFormatter: [formatters.inputLogFormatter],
    //     outputFormatter: this._decodeEventABI.bind(subOptions.event)
    // });
    // getPastLogs.setRequestManager(this._requestManager);
    // var call = getPastLogs.buildCall();
    //
    // getPastLogs = null;
    //
    // return call(subOptions.params, subOptions.callback);
};

Contract.prototype.deploy = function () {

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
        this.provider,
        this.providersPackage,
        this.methodController,
        this.subscriptionPackage,
        this.batchRequestPackage,
        this.contractPackageFactory,
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

Contract.prototype = Object.create(AbstractWeb3Object.prototype);
Contract.prototype.constructor = Contract;

module.exports = Contract;
