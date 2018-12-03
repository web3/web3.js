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
 * @file ModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import TransactionConfirmationWorkflow from '../workflows/TransactionConfirmationWorkflow';
import TransactionSigner from '../signers/TransactionSigner';
import MessageSigner from '../signers/MessageSigner';
import TransactionReceiptValidator from '../validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../watchers/NewHeadsWatcher';
import MethodController from '../controllers/MethodController';
import CallMethodCommand from '../commands/CallMethodCommand';
import SendMethodCommand from '../commands/SendMethodCommand';
import SignAndSendMethodCommand from '../commands/SignAndSendMethodCommand';
import SignMessageCommand from '../commands/SignMessageCommand';
import MethodProxy from '../proxy/MethodProxy';

export default class ModuleFactory {
    /**
     * @param {PromiEvent} promiEventObject
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(promiEventObject, subscriptionsFactory, formatters) {
        this.promiEventObject = promiEventObject;
        this.subscriptionsFactory = subscriptionsFactory;
        this.formatters = formatters;
    }

    /**
     * Returns the MethodController object
     *
     * @method createMethodController
     *
     * @returns {MethodController}
     */
    createMethodController() {
        return new MethodController(
            this.createCallMethodCommand(),
            this.createSendMethodCommand(),
            this.createSignAndSendMethodCommand(),
            this.createSignMessageCommand(),
            this.promiEventObject
        );
    }

    /**
     * Returns the MethodProxy object
     *
     * @method createMethodProxy
     *
     * @param {AbstractWeb3Module} target
     * @param {MethodModelFactory} methodModelFactory
     */
    createMethodProxy(target, methodModelFactory) {
        new MethodProxy(target, methodModelFactory, this.createMethodController());
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
     * @returns {SendMethodCommand}
     */
    createSendMethodCommand() {
        return new SendMethodCommand(
            this.createTransactionConfirmationWorkflow()
        );
    }

    /**
     * Returns the SignAndSendCommand object
     *
     * @method createSingAndSendMethodCommand
     *
     * @returns {SignAndSendMethodCommand}
     */
    createSignAndSendMethodCommand() {
        return new SignAndSendMethodCommand(
            this.createTransactionConfirmationWorkflow(),
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
        return new SignMessageCommand(this.createMessageSigner());
    }

    /**
     * Returns the TransactionConfirmationWorkflow object
     *
     * @method createTransactionConfirmationWorkflow
     *
     * @returns {TransactionConfirmationWorkflow}
     */
    createTransactionConfirmationWorkflow() {
        return new TransactionConfirmationWorkflow(
            this.createTransactionReceiptValidator(),
            this.createNewHeadsWatcher(),
            this.formatters
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
     * @returns {NewHeadsWatcher}
     */
    createNewHeadsWatcher() {
        return new NewHeadsWatcher(this.subscriptionsFactory);
    }
}
