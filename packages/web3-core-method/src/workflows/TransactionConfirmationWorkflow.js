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
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     *
     * @constructor
     */
    constructor(transactionReceiptValidator, newHeadsWatcher, getTransactionReceiptMethod) {
        this.transactionReceiptValidator = transactionReceiptValidator;
        this.newHeadsWatcher = newHeadsWatcher;
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;
    }

    /**
     * TODO: Remove callback method here and do it with a promise.
     *
     * Executes the transaction confirmation workflow
     *
     * @method execute
     *
     * @param {AbstractMethod} method
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} transactionHash
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     */
    execute(method, moduleInstance, transactionHash, promiEvent) {
        this.getTransactionReceiptMethod.parameters = [transactionHash];

        this.getTransactionReceiptMethod.execute(moduleInstance).then((receipt) => {
            if (receipt && receipt.blockHash) {
                const validationResult = this.transactionReceiptValidator.validate(receipt, method);
                if (validationResult === true) {
                    this.handleSuccessState(receipt, method, promiEvent);

                    return;
                }

                this.handleErrorState(validationResult, method, promiEvent);

                return;
            }

            this.newHeadsWatcher.watch(moduleInstance).on('newHead', () => {
                this.timeoutCounter++;
                if (!this.isTimeoutTimeExceeded(moduleInstance, this.newHeadsWatcher.isPolling)) {
                    this.getTransactionReceiptMethod.execute(moduleInstance).then((receipt) => {
                        if (receipt && receipt.blockHash) {
                            const validationResult = this.transactionReceiptValidator.validate(receipt, method);

                            if (validationResult === true) {
                                this.confirmationsCounter++;
                                promiEvent.emit('confirmation', this.confirmationsCounter, receipt);

                                if (this.isConfirmed(moduleInstance)) {
                                    this.handleSuccessState(receipt, method, promiEvent);
                                }

                                return;
                            }

                            this.handleErrorState(validationResult, method, promiEvent);
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
                        `Transaction was not mined within ${
                            moduleInstance.transactionPollingTimeout
                        } seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!`
                    );
                }

                this.handleErrorState(error, method, promiEvent);
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
        return this.confirmationsCounter === moduleInstance.transactionConfirmationBlocks;
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

        return this.timeoutCounter > timeout;
    }

    /**
     * Resolves promise, emits receipt event, calls callback and removes all the listeners.
     *
     * @method handleSuccessState
     *
     * @param {Object} receipt
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     */
    handleSuccessState(receipt, method, promiEvent) {
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
        this.newHeadsWatcher.stop();

        if (method.constructor.name === 'ContractDeployMethod') {
            if (method.callback) {
                method.callback(false, receipt);
            }

            promiEvent.resolve(method.afterExecution(receipt));
            promiEvent.emit('receipt', receipt);
            promiEvent.removeAllListeners();

            return;
        }

        const mappedReceipt = method.afterExecution(receipt);

        if (method.callback) {
            method.callback(false, mappedReceipt);
        }

        promiEvent.resolve(mappedReceipt);
        promiEvent.emit('receipt', mappedReceipt);
        promiEvent.removeAllListeners();
    }

    /**
     * Rejects promise, emits error event, calls callback and removes all the listeners.
     *
     * @method handleErrorState
     *
     * @param {Error} error
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     */
    handleErrorState(error, method, promiEvent) {
        this.timeoutCounter = 0;
        this.confirmationsCounter = 0;
        this.newHeadsWatcher.stop();

        if (method.callback) {
            method.callback(error, null);
        }

        promiEvent.reject(error);
        promiEvent.emit('error', error);
        promiEvent.removeAllListeners();
    }
}
