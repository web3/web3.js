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
 * @file MethodPackageFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var TransactionConfirmationWorkflow = require('../workflows/TransactionConfirmationWorkflow');
var TransactionSigner = require('../signers/TransactionSigner');
var MessageSigner = require('../signers/MessageSigner');
var TransactionConfirmationModel = require('../models/TransactionConfirmationModel');
var TransactionReceiptValidator = require('../validators/TransactionReceiptValidator');
var NewHeadsWatcher = require('../watchers/NewHeadsWatcher');
var Method = require('../Method');


/**
 * @constructor
 */
function MethodPackageFactory() { }


/**
 * Return Method object
 *
 * @method createMethod
 *
 * @param {Object} provider
 * @param {Accounts} accounts
 * @param {String} rpcMethod
 * @param {Array} parameters
 * @param {Array} inputFormatters
 * @param {Function} outputFormatter
 * @param {PromiEvent} promiEvent
 * @param {SubscriptionPackage} subscriptionPackage
 *
 * @returns {Method}
 */
MethodPackageFactory.prototype.createMethod = function (
    provider,
    accounts,
    rpcMethod,
    parameters,
    inputFormatters,
    outputFormatter,
    promiEvent,
    subscriptionPackage
) {
    return new Method(
        provider,
        accounts,
        rpcMethod,
        parameters,
        inputFormatters,
        outputFormatter,
        promiEvent,
        this.createTransactionConfirmationWorkflow(provider, subscriptionPackage),
        this.createTransactionSigner(),
        this.createMessageSigner()
    );
};

/**
 * Returns TransactionConfirmationWorkflow object
 *
 * @method createTransactionConfirmationWorkflow
 *
 * @param {Object} provider
 * @param {SubscriptionPackage} subscriptionPackage
 *
 * @returns {TransactionConfirmationWorkflow}
 */
MethodPackageFactory.prototype.createTransactionConfirmationWorkflow = function (provider, subscriptionPackage) {
    new TransactionConfirmationWorkflow(
        provider,
        this.createTransactionConfirmationModel(),
        this.createTransactionReceiptValidator(),
        this.createNewHeadsWatcher(provider, subscriptionPackage)
    );
};

/**
 * Returns TransactionSigner object
 *
 * @method createTransactionSigner
 *
 * @returns {TransactionSigner}
 */
MethodPackageFactory.prototype.createTransactionSigner = function () {
    return new TransactionSigner();
};

/**
 * Returns MessageSigner object
 *
 * @method createMessageSigner
 *
 * @returns {MessageSigner}
 */
MethodPackageFactory.prototype.createMessageSigner = function () {
    return new MessageSigner();
};

/**
 * Returns TransactionConfirmationModel object
 *
 * @method createTransactionConfirmationModel
 *
 * @returns {TransactionConfirmationModel}
 */
MethodPackageFactory.prototype.createTransactionConfirmationModel = function () {
    return new TransactionConfirmationModel()
};

/**
 * Returns TransactionReceiptValidator object
 *
 * @returns {TransactionReceiptValidator}
 */
MethodPackageFactory.prototype.createTransactionReceiptValidator = function () {
    return new TransactionReceiptValidator();
};

/**
 * Returns NewHeadsWatcher object
 *
 * @param {Object} provider
 * @param {SubscriptionPackage} subscriptionPackage
 *
 * @returns {NewHeadsWatcher}
 */
MethodPackageFactory.prototype.createNewHeadsWatcher = function (provider, subscriptionPackage) {
    return new NewHeadsWatcher(provider, subscriptionPackage);
};
