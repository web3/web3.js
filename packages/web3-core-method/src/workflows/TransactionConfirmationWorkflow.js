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

export default class TransactionConfirmationWorkflow {
    /**
     * @param {TransactionReceiptValidator} transactionReceiptValidator
     * @param {NewHeadsWatcher} newHeadsWatcher
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(transactionReceiptValidator, newHeadsWatcher, formatters) {
        this.transactionReceiptValidator = transactionReceiptValidator;
        this.newHeadsWatcher = newHeadsWatcher;
        this.formatters = formatters;
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
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
        this.getTransactionReceipt(moduleInstance, transactionHash).then((receipt) => {
            if (receipt && receipt.blockHash) {
                const validationResult = this.transactionReceiptValidator.validate(receipt);
                if (validationResult === true) {
                    this.handleSuccessState(receipt, methodModel, promiEvent);

                    return;
                }

                this.handleErrorState(validationResult, methodModel, promiEvent);

                return;
            }

            this.newHeadsWatcher.watch(moduleInstance).on('newHead', () => {
                this.timeoutCounter++;
                if (!this.isTimeoutTimeExceeded(moduleInstance, this.newHeadsWatcher.isPolling)) {
                    this.getTransactionReceipt(moduleInstance, transactionHash).then((receipt) => {
                        const validationResult = this.transactionReceiptValidator.validate(
                            receipt,
                            methodModel.parameters
                        );

                        if (validationResult === true) {
                            this.confirmationsCounter++;
                            promiEvent.emit('confirmation', this.confirmationsCounter, receipt);

                            if (this.isConfirmed(moduleInstance)) {
                                this.handleSuccessState(receipt, methodModel, promiEvent);
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

                let error = new Error(
                    `Transaction was not mined within ${
                        moduleInstance.transactionBlockTimeout
                    } blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!`
                );

                if (this.newHeadsWatcher.isPolling) {
                    error = new Error(
                        `Transaction was not mined within${
                            moduleInstance.transactionPollingTimeout
                        } seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!`
                    );
                }

                this.handleErrorState(error, methodModel, promiEvent);
            });
        });
    }

    /**
     * Checks if the transaction has enough confirmations
     *
     * @method isConfirmed
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    isConfirmed(moduleInstance) {
        return this.confirmationsCounter === moduleInstance.transactionConfirmationBlocks + 1;
    }

    /**
     * Checks if the timeout time is reached
     *
     * @method isTimeoutTimeExceeded
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Boolean} watcherIsPolling
     *
     * @returns {Boolean}
     */
    isTimeoutTimeExceeded(moduleInstance, watcherIsPolling) {
        let timeout = moduleInstance.transactionBlockTimeout;
        if (watcherIsPolling) {
            timeout = moduleInstance.transactionPollingTimeout;
        }

        return this.timeoutCounter - 1 >= timeout;
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
        return moduleInstance.currentProvider.send('eth_getTransactionReceipt', [transactionHash]).then((receipt) => {
            return this.formatters.outputTransactionReceiptFormatter(receipt);
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
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
        this.newHeadsWatcher.stop();

        if (methodModel.constructor.name === 'ContractDeployMethodModel') {
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
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
        this.newHeadsWatcher.stop();

        promiEvent.reject(error);
        promiEvent.emit('error', error);
        promiEvent.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(error, null);
        }
    }
}
