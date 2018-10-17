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
 * @file TransactionConfirmationWorkflow.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

import {ContractDeployMethodModel} from 'web3-eth-contract';

export default class TransactionConfirmationWorkflow {

    /**
     * @param {TransactionConfirmationModel} transactionConfirmationModel
     * @param {TransactionReceiptValidator} transactionReceiptValidator
     * @param {NewHeadsWatcher} newHeadsWatcher
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(
        transactionConfirmationModel,
        transactionReceiptValidator,
        newHeadsWatcher,
        formatters
    ) {
        this.transactionConfirmationModel = transactionConfirmationModel;
        this.transactionReceiptValidator = transactionReceiptValidator;
        this.newHeadsWatcher = newHeadsWatcher;
        this.formatters = formatters;
    }

    /**
     * Executes the transaction confirmation workflow
     *
     * @method execute
     *
     * @param {AbstractMethodModel} methodModel
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} transactionHash
     * @param {Object} promiEvent
     *
     * @callback callback callback(error, result)
     */
    execute(methodModel, moduleInstance, transactionHash, promiEvent) {
        const self = this;

        this.getTransactionReceipt(moduleInstance, transactionHash).then(receipt => {
            if (receipt && receipt.blockHash) {
                const validationResult = self.transactionReceiptValidator.validate(receipt);
                if (validationResult === true) {
                    self.handleSuccessState(receipt, methodModel, promiEvent);

                    return;
                }

                self.handleErrorState(validationResult, methodModel, promiEvent);

                return;
            }

            self.newHeadsWatcher.watch(moduleInstance).on('newHead', () => {
                self.transactionConfirmationModel.timeoutCounter++;
                if (!self.transactionConfirmationModel.isTimeoutTimeExceeded()) {
                    self.getTransactionReceipt(transactionHash).then(receipt => {
                        const validationResult = self.transactionReceiptValidator.validate(receipt, methodModel.parameters);

                        if (validationResult === true) {
                            self.transactionConfirmationModel.addConfirmation(receipt);
                            promiEvent.emit(
                                'confirmation',
                                self.transactionConfirmationModel.confirmationsCount,
                                receipt
                            );

                            if (self.transactionConfirmationModel.isConfirmed()) {
                                self.handleSuccessState(receipt, methodModel, promiEvent);
                            }

                            return;
                        }

                        promiEvent.reject(validationResult);
                        promiEvent.emit('error', validationResult, receipt);
                        promiEvent.removeAllListeners();

                        if (methodModel.callback) {
                            methodModel.callback(validationResult, null);
                        }
                    });

                    return;
                }

                let error = new Error(`Transaction was not mined within ${self.transactionConfirmationModel.TIMEOUTBLOCK} blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!`);

                if (self.newHeadsWatcher.isPolling) {
                    error = new Error(`Transaction was not mined within${self.transactionConfirmationModel.POLLINGTIMEOUT} seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!`)
                }

                self.handleErrorState(error, methodModel, promiEvent);
            });
        });
    }

    /**
     * Get receipt by transaction hash
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} transactionHash
     *
     * @returns {Promise<Object>}
     */
    getTransactionReceipt(moduleInstance, transactionHash) {
        const self = this;

        return moduleInstance.currentProvider.send('eth_getTransactionReceipt', [transactionHash]).then(receipt => {
            return self.formatters.outputTransactionReceiptFormatter(receipt);
        });
    }

    /**
     * Resolves promise, emits receipt event, calls callback and removes all the listeners.
     *
     * @method handleSuccessState
     *
     * @param {Object} receipt
     * @param {AbstractMethodModel} methodModel
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     */
    handleSuccessState(receipt, methodModel, promiEvent) {
        this.newHeadsWatcher.stop();

        if (methodModel instanceof ContractDeployMethodModel) {
            promiEvent.resolve(methodModel.afterExecution(receipt));
            promiEvent.emit('receipt', receipt);
            promiEvent.removeAllListeners();

            if (methodModel.callback) {
                methodModel.callback(false, receipt);
            }

            return;
        }

        const mappedReceipt = methodModel.afterExecution(receipt);

        promiEvent.resolve(mappedReceipt);
        promiEvent.emit('receipt', mappedReceipt);
        promiEvent.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(false, mappedReceipt);
        }
    }

    /**
     * Rejects promise, emits error event, calls callback and removes all the listeners.
     *
     * @method handleErrorState
     *
     * @param {Error} error
     * @param {AbstractMethodModel} methodModel
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     */
    handleErrorState(error, methodModel, promiEvent) {
        this.newHeadsWatcher.stop();

        promiEvent.reject(error);
        promiEvent.emit('error', error);
        promiEvent.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(error, null);
        }
    }
}
