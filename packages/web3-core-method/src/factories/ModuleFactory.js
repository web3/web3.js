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
import TransactionReceiptValidator from '../validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../watchers/NewHeadsWatcher';
import CallMethodCommand from '../commands/CallMethodCommand';
import SendMethodCommand from '../commands/SendMethodCommand';
import MethodProxy from '../proxy/MethodProxy';

export default class ModuleFactory {
    /**
     * @param {PromiEvent} promiEventObject
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(subscriptionsFactory, formatters) {
        this.subscriptionsFactory = subscriptionsFactory;
        this.formatters = formatters;
    }

    /**
     * Returns the MethodProxy object
     *
     * @method createMethodProxy
     *
     * @param {AbstractWeb3Module} target
     * @param {AbstractMethodFactory} methodFactory
     */
    createMethodProxy(target, methodFactory) {
        new MethodProxy(target, methodFactory);
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
