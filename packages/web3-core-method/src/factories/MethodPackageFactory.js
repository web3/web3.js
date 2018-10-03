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
var MethodController = require('../controllers/MethodController');
var CallMethodCommand = require('../commands/CallMethodCommand');
var SendMethodCommand = require('../commands/SendMethodCommand');
var SignAndSendMethodCommand = require('../commands/SignAndSendMethodCommand');
var SignMessageCommand = require('../commands/SignMessageCommand');

/**
 * @constructor
 */
function MethodPackageFactory() { }

/**
 * Returns the MethodController object
 *
 * @method createMethodController
 *
 * @param {PromiEventPackage} promiEventPackage
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {Object} formatters
 *
 * @returns {MethodController}
 */
MethodPackageFactory.prototype.createMethodController = function (
    promiEventPackage,
    subscriptionsFactory,
    formatters
) {
    return new MethodController(
        this.createCallMethodCommand(),
        this.createSendMethodCommand(subscriptionsFactory, formatters),
        this.createSignAndSendMethodCommand(subscriptionsFactory, formatters),
        this.createSignMessageCommand(),
        promiEventPackage
    );
};

/**
 * Returns the CallMethodCommand object
 *
 * @method createCallMethodCommand
 *
 * @returns {CallMethodCommand}
 */
MethodPackageFactory.prototype.createCallMethodCommand = function () {
    return new CallMethodCommand();
};

/**
 * Returns the SendMethodCommand object
 *
 * @method createSendMethodCommand
 *
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {Object} formatters
 *
 * @returns {SendMethodCommand}
 */
MethodPackageFactory.prototype.createSendMethodCommand = function (subscriptionsFactory, formatters) {
    return new SendMethodCommand(
        this.createTransactionConfirmationWorkflow(subscriptionsFactory, formatters)
    );
};

/**
 * Returns the SignAndSendCommand object
 *
 * @method createSingAndSendMethodCommand
 *
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {Object} formatters
 *
 * @returns {SignAndSendMethodCommand}
 */
MethodPackageFactory.prototype.createSignAndSendMethodCommand = function (subscriptionsFactory, formatters) {
    return new SignAndSendMethodCommand(
        this.createTransactionConfirmationWorkflow(subscriptionsFactory, formatters),
        this.createTransactionSigner()
    );
};

/**
 * Returns the SignMessageCommand object
 *
 * @method createSignMessageCommand
 *
 * @returns {SignMessageCommand}
 */
MethodPackageFactory.prototype.createSignMessageCommand = function () {
    return new SignMessageCommand(
        this.createMessageSigner()
    );
};

/**
 * Returns the TransactionConfirmationWorkflow object
 *
 * @method createTransactionConfirmationWorkflow
 *
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {Object} formatters
 *
 * @returns {TransactionConfirmationWorkflow}
 */
MethodPackageFactory.prototype.createTransactionConfirmationWorkflow = function (subscriptionsFactory, formatters) {
    new TransactionConfirmationWorkflow(
        this.createTransactionConfirmationModel(),
        this.createTransactionReceiptValidator(),
        this.createNewHeadsWatcher(subscriptionsFactory),
        formatters
    );
};

/**
 * Returns the TransactionSigner object
 *
 * @method createTransactionSigner
 *
 * @returns {TransactionSigner}
 */
MethodPackageFactory.prototype.createTransactionSigner = function () {
    return new TransactionSigner();
};

/**
 * Returns the MessageSigner object
 *
 * @method createMessageSigner
 *
 * @returns {MessageSigner}
 */
MethodPackageFactory.prototype.createMessageSigner = function () {
    return new MessageSigner();
};

/**
 * Returns the TransactionConfirmationModel object
 *
 * @method createTransactionConfirmationModel
 *
 * @returns {TransactionConfirmationModel}
 */
MethodPackageFactory.prototype.createTransactionConfirmationModel = function () {
    return new TransactionConfirmationModel()
};

/**
 * Returns the TransactionReceiptValidator object
 *
 * @method createTransactionReceiptValidator
 *
 * @returns {TransactionReceiptValidator}
 */
MethodPackageFactory.prototype.createTransactionReceiptValidator = function () {
    return new TransactionReceiptValidator();
};

/**
 * Returns the NewHeadsWatcher object
 *
 * @method createNewHeadsWatcher
 *
 * @param {SubscriptionsFactory} subscriptionsFactory
 *
 * @returns {NewHeadsWatcher}
 */
MethodPackageFactory.prototype.createNewHeadsWatcher = function (subscriptionsFactory) {
    return new NewHeadsWatcher(subscriptionsFactory);
};
