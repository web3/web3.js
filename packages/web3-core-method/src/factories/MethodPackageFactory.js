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
 * @param {CoreFactory} coreFactory
 * @param {string} rpcMethod
 * @param {array} parameters
 * @param {array} inputFormatters
 * @param {Function} outputFormatter
 * @param {PromiEvent} promiEvent
 *
 * @returns {Method}
 */
MethodPackageFactory.prototype.createMethod = function (
    provider,
    coreFactory,
    rpcMethod,
    parameters,
    inputFormatters,
    outputFormatter,
    promiEvent
) {
    return new Method(
        provider,
        coreFactory.createAccountsPackage(),
        rpcMethod,
        parameters,
        inputFormatters,
        outputFormatter,
        promiEvent,
        this.createTransactionConfirmationWorkflow(provider, coreFactory),
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
 * @param {CoreFactory} coreFactory
 *
 * @returns {TransactionConfirmationWorkflow}
 */
MethodPackageFactory.prototype.createTransactionConfirmationWorkflow = function (provider, coreFactory) {
  new TransactionConfirmationWorkflow(
      provider,
      this.createTransactionConfirmationModel(),
      this.createTransactionReceiptValidator(),
      this.createNewHeadsWatcher(provider, coreFactory)
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
  new MessageSigner();
};

/**
 * Returns TransactionConfirmationModel object
 *
 * @method createTransactionConfirmationModel
 *
 * @returns {TransactionConfirmationModel}
 */
MethodPackageFactory.prototype.createTransactionConfirmationModel = function() {
    return new TransactionConfirmationModel()
};

/**
 * Returns TransactionReceiptValidator object
 *
 * @returns {TransactionReceiptValidator}
 */
MethodPackageFactory.prototype.createTransactionReceiptValidator = function() {
    return new TransactionReceiptValidator();
};

/**
 * Returns NewHeadsWatcher object
 *
 * @param {Object} provider
 * @param {CoreFactory} coreFactory
 *
 * @returns {NewHeadsWatcher}
 */
MethodPackageFactory.prototype.createNewHeadsWatcher = function (provider, coreFactory) {
  return new NewHeadsWatcher(provider, coreFactory);
};
