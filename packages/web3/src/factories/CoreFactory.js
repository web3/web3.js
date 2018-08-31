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
 * @file CoreFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Subscription = require('web3-core-subscription');
var PromiEvent = require('web3-core-promievent');
var helpers = require('web3-core-helpers');
var MethodPackageFactory = require('web3-core-method');
var Utils = require('web3-utils');

function CoreFactory() { }

/**
 * Creates Subscription object
 *
 * @method createSubscription
 *
 * @param {Object} provider
 * @param {String} type
 * @param {Array} parameters
 * @param {Object} inputFormatter
 * @param {Object} outputFormatter
 *
 * @returns {Subscription}
 */
CoreFactory.prototype.createSubscription = function (provider, type, parameters, inputFormatter, outputFormatter) {
    return new Subscription(provider, type, parameters, inputFormatter, outputFormatter);
};

/**
 * Creates PromiEvent object
 */
CoreFactory.prototype.createPromiEvent = function () {
    return new PromiEvent();
};

/**
 * Creates Method object
 *
 * @method createMethod
 *
 * @param {Object} provider
 * @param {String} rpcMethod
 * @param {Array} parameters
 * @param {Array} inputFormatters
 * @param {Function} outputFormatter
 *
 * @returns {Method}
 */
CoreFactory.prototype.createMethod = function (provider, rpcMethod, parameters, inputFormatters, outputFormatter) {
    return new MethodPackageFactory().createMethod(
        provider,
        this,
        rpcMethod,
        parameters,
        inputFormatters,
        outputFormatter,
        this.createPromiEvent()
    );
};

/**
 * Returns the web3 utilities
 *
 * @method createUtils
 *
 * @returns {Utils}
 */
CoreFactory.prototype.createUtils = function () {
    return Utils;
};

/**
 * Creates Batch object
 *
 * @method createBatch
 *
 * @param {ConnectionModel} connectionModel
 *
 * @returns {Batch}
 */
CoreFactory.prototype.createBatch = function (connectionModel) {
    return new Batch(connectionModel);
};

/**
 * Returns the web3 formatters
 *
 * @method createFormatters
 *
 * @returns {Object}
 */
CoreFactory.prototype.createFormatters = function () {
    return helpers.formatters;
};

/**
 * Returns the default web3 errors
 *
 * @method createErrors
 *
 * @returns {Object}
 */
CoreFactory.prototype.createErrors = function () {
    return helpers.errors;
};
