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

import TransactionConfirmationWorkflow from '../workflows/TransactionConfirmationWorkflow';
import TransactionSigner from '../signers/TransactionSigner';
import MessageSigner from '../signers/MessageSigner';
import TransactionConfirmationModel from '../models/TransactionConfirmationModel';
import TransactionReceiptValidator from '../validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../watchers/NewHeadsWatcher';
import MethodController from '../controllers/MethodController';
import CallMethodCommand from '../commands/CallMethodCommand';
import SendMethodCommand from '../commands/SendMethodCommand';
import SignAndSendMethodCommand from '../commands/SignAndSendMethodCommand';
import SignMessageCommand from '../commands/SignMessageCommand';

export default class MethodPackageFactory {

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
    createMethodController(promiEventPackage, subscriptionsFactory, formatters) {
        return new MethodController(
            this.createCallMethodCommand(),
            this.createSendMethodCommand(subscriptionsFactory, formatters),
            this.createSignAndSendMethodCommand(subscriptionsFactory, formatters),
            this.createSignMessageCommand(),
            promiEventPackage
        );
    }

    /**
     * Returns the CallMethodCommand object
     *
     * @method createCallMethodCommand
     *
     * @returns {CallMethodCommand}
     */
    createCallMethodCommand() {
        return new CallMethodCommand();
    }

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
    createSendMethodCommand(subscriptionsFactory, formatters) {
        return new SendMethodCommand(
            this.createTransactionConfirmationWorkflow(subscriptionsFactory, formatters)
        );
    }

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
    createSignAndSendMethodCommand(subscriptionsFactory, formatters) {
        return new SignAndSendMethodCommand(
            this.createTransactionConfirmationWorkflow(subscriptionsFactory, formatters),
            this.createTransactionSigner()
        );
    }

    /**
     * Returns the SignMessageCommand object
     *
     * @method createSignMessageCommand
     *
     * @returns {SignMessageCommand}
     */
    createSignMessageCommand() {
        return new SignMessageCommand(
            this.createMessageSigner()
        );
    }

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
    createTransactionConfirmationWorkflow(subscriptionsFactory, formatters) {
        return new TransactionConfirmationWorkflow(
            this.createTransactionConfirmationModel(),
            this.createTransactionReceiptValidator(),
            this.createNewHeadsWatcher(subscriptionsFactory),
            formatters
        );
    }

    /**
     * Returns the TransactionSigner object
     *
     * @method createTransactionSigner
     *
     * @returns {TransactionSigner}
     */
    createTransactionSigner() {
        return new TransactionSigner();
    }

    /**
     * Returns the MessageSigner object
     *
     * @method createMessageSigner
     *
     * @returns {MessageSigner}
     */
    createMessageSigner() {
        return new MessageSigner();
    }

    /**
     * Returns the TransactionConfirmationModel object
     *
     * @method createTransactionConfirmationModel
     *
     * @returns {TransactionConfirmationModel}
     */
    createTransactionConfirmationModel() {
        return new TransactionConfirmationModel()
    }

    /**
     * Returns the TransactionReceiptValidator object
     *
     * @method createTransactionReceiptValidator
     *
     * @returns {TransactionReceiptValidator}
     */
    createTransactionReceiptValidator() {
        return new TransactionReceiptValidator();
    }

    /**
     * Returns the NewHeadsWatcher object
     *
     * @method createNewHeadsWatcher
     *
     * @param {SubscriptionsFactory} subscriptionsFactory
     *
     * @returns {NewHeadsWatcher}
     */
    createNewHeadsWatcher(subscriptionsFactory) {
        return new NewHeadsWatcher(subscriptionsFactory);
    }
}
