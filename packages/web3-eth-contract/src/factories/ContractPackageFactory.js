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
 * @file ContractPackageFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var ABIModel = require('../models/abi/ABIModel');
var ABIItemModel = require('../models/abi/ABIItemModel');
var MethodEncoder = require('../encoders/MethodEncoder');
var EventFilterEncoder = require('../encoders/EventFilterEncoder');
var AllEventsFilterEncoder = require('../encoders/AllEventsFilterEncoder');
var MethodResponseDecoder = require('../decoders/MethodResponseDecoder');
var EventLogDecoder = require('../decoders/EventLogDecoder');
var AllEventsLogDecoder = require('../decoders/AllEventsLogDecoder');
var ABIMapper = require('../mappers/ABIMapper');
var RpcMethodOptionsMapper = require('../mappers/RpcMethodOptionsMapper');
var EventOptionsMapper = require('../mappers/EventOptionsMapper');
var AllEventsOptionsMapper = require('../mappers/AllEventsOptionsMapper');
var MethodsProxy = require('../proxies/MethodsProxy');
var EventSubscriptionsProxy = require('../proxies/EventSubscriptionsProxy');
var RpcMethodOptionsValidator = require('../validators/RpcMethodOptionsValidator');
var RpcMethodFactory = require('../factories/RpcMethodFactory');
var EventSubscriptionFactory = require('../factories/EventSubscriptionFactory');

/**
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {ABICoder} abiCoder
 * @param {Accounts} accounts
 *
 * @constructor
 */
function ContractPackageFactory(utils, formatters, abiCoder, accounts) {
    this.utils = utils;
    this.formatters = formatters;
    this.abiCoder = abiCoder;
    this.accounts = accounts;
}

/**
 * Returns an object of ABIModel
 *
 * @method createABIModel
 *
 * @param {Object} mappedAbi
 *
 * @returns {ABIModel}
 */
ContractPackageFactory.prototype.createABIModel = function (mappedAbi) {
    return new ABIModel(mappedAbi);
};

/**
 * Returns an object of ABIItemModel
 *
 * @method createABIItemModel
 *
 * @param {Object} abiItem
 *
 * @returns {ABIItemModel}
 */
ContractPackageFactory.prototype.createABIItemModel = function (abiItem) {
    return new ABIItemModel(abiItem);
};

/**
 * Returns an object of MethodEncoder
 *
 * @method createMethodEncoder
 *
 * @returns {MethodEncoder}
 */
ContractPackageFactory.prototype.createMethodEncoder = function () {
    return new MethodEncoder(this.abiCoder);
};

/**
 * Returns an object of EventFilterEncoder
 *
 * @method createEventFilterEncoder
 *
 * @returns {EventFilterEncoder}
 */
ContractPackageFactory.prototype.createEventFilterEncoder = function () {
    return new EventFilterEncoder(this.abiCoder)
};

/**
 * Returns an object of AllEventsFilterEncoder
 *
 * @method createAllEventsFilterEncoder
 *
 * @returns {AllEventsFilterEncoder}
 */
ContractPackageFactory.prototype.createAllEventsFilterEncoder = function () {
    return new AllEventsFilterEncoder(this.abiCoder)
};

/**
 * Returns an object of ABIMapper
 *
 * @method createABIMapper
 *
 * @returns {ABIMapper}
 */
ContractPackageFactory.prototype.createABIMapper = function () {
    return new ABIMapper(this, this.abiCoder, this.utils);
};

/**
 * Returns an object of MethodResponseDecoder
 *
 * @method createMethodResponseDecoder
 *
 * @returns {MethodResponseDecoder}
 */
ContractPackageFactory.prototype.createMethodResponseDecoder = function () {
    return new MethodResponseDecoder(this.abiCoder);
};

/**
 * Returns an object of EventLogDecoder
 *
 * @method createEventLogDecoder
 *
 * @returns {EventLogDecoder}
 */
ContractPackageFactory.prototype.createEventLogDecoder = function () {
    return new EventLogDecoder(this.abiCoder, this.formatters);
};


/**
 * Returns an object of AllEventsLogDecoder
 *
 * @method createAllEventsLogDecoder
 *
 * @returns {AllEventsLogDecoder}
 */
ContractPackageFactory.prototype.createAllEventsLogDecoder = function () {
    return new AllEventsLogDecoder(this.abiCoder, this.formatters);
};

/**
 * Returns an object of RpcMethodOptionsValidator
 *
 * @method createRpcMethodOptionsValidator
 *
 * @returns {RpcMethodOptionsValidator}
 */
ContractPackageFactory.prototype.createRpcMethodOptionsValidator = function () {
    return new RpcMethodOptionsValidator(this.utils);
};

/**
 * Returns an object of RpcMethodOptionsMapper
 *
 * @method createRpcMethodOptionsMapper
 *
 * @returns {RpcMethodOptionsMapper}
 */
ContractPackageFactory.prototype.createRpcMethodOptionsMapper = function () {
    return new RpcMethodOptionsMapper(this.utils, this.formatters);
};

/**
 * Returns an object of EventOptionsMapper
 *
 * @method createEventOptionsMapper
 *
 * @returns {EventOptionsMapper}
 */
ContractPackageFactory.prototype.createEventOptionsMapper = function () {
    return new EventOptionsMapper(this.formatters, this.createEventFilterEncoder());
};

/**
 * Returns an object of AllEventsOptionsMapper
 *
 * @method createAllEventsOptionsMapper
 *
 * @returns {AllEventsOptionsMapper}
 */
ContractPackageFactory.prototype.createAllEventsOptionsMapper = function () {
    return new AllEventsOptionsMapper(this.formatters, this.createAllEventsFilterEncoder());
};

/**
 * Returns an object of RpcMethodModelFactory
 *
 * @method createRpcMethodModelFactory
 *
 * @returns {RpcMethodModelFactory}
 */
ContractPackageFactory.prototype.createRpcMethodModelFactory = function () {
    return new RpcMethodFactory(
        this.createMethodResponseDecoder(),
        this.accounts,
        this.utils,
        this.formatters
    );
};

/**
 * Returns an Object of MethodsProxy
 *
 * @method createMethodsProxy
 *
 * @param {Contract} contract
 * @param {ABIModel} abiModel
 * @param {MethodController} methodController
 * @param {PromiEventPackage} promiEventPackage
 *
 * @returns {MethodsProxy}
 */
ContractPackageFactory.prototype.createMethodsProxy = function (
    contract,
    abiModel,
    methodController,
    promiEventPackage
) {
    return new MethodsProxy(
        contract,
        abiModel,
        this.createRpcMethodModelFactory(),
        methodController,
        this.createMethodEncoder(),
        this.createRpcMethodOptionsValidator(),
        this.createRpcMethodOptionsMapper(),
        promiEventPackage
    );
};

/**
 * Returns an object of EventSubscriptionsProxy
 *
 * @method createEventSubscriptionsProxy
 *
 * @param {Contract} contract
 * @param {ABIModel} abiModel
 * @param {MethodController} methodController
 *
 * @returns {EventSubscriptionsProxy}
 */
ContractPackageFactory.prototype.createEventSubscriptionsProxy = function (
    contract,
    abiModel,
    methodController
) {
    new EventSubscriptionsProxy(
        contract,
        abiModel,
        this.createEventSubscriptionFactory(methodController),
        this.createEventOptionsMapper(),
        this.createEventLogDecoder(),
        this.createAllEventsLogDecoder(),
        this.createAllEventsOptionsMapper()
    );
};

/**
 * Returns an object of EventSubscriptionFactory
 *
 * @method createEventSubscriptionFactory
 *
 * @param {MethodController} methodController
 *
 * @returns {EventSubscriptionFactory}
 */
ContractPackageFactory.prototype.createEventSubscriptionFactory = function (methodController) {
    new EventSubscriptionFactory(
        this.utils,
        this.formatters,
        methodController
    );
};

module.exports = ContractPackageFactory;
