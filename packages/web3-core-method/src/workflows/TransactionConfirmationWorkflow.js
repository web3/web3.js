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

/**
 * @param {Object} provider
 * @param {Object} transactionConfirmationModel
 * @param {Object} transactionReceiptValidator
 * @param {Object} newHeadsWatcher
 * @constructor
 */
function TransactionConfirmationWorkflow(
    provider,
    transactionConfirmationModel,
    transactionReceiptValidator,
    newHeadsWatcher
) {
    this.transactionConfirmationModel = transactionConfirmationModel;
    this.transactionReceiptValidator = transactionReceiptValidator;
    this.newHeadsWatcher = newHeadsWatcher;
    this.provider = provider;
}

/**
 * Executes the transaction confirmation workflow
 *
 * @param {string} transactionHash
 * @param {Object} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
TransactionConfirmationWorkflow.prototype.execute = function (
    transactionHash,
    promiEvent,
    callback
) {
    var self = this;

    this.getTransactionReceipt(transactionHash).then(function (receipt) {
        if (receipt && receipt.blockHash) {
            var validationResult = this.transactionReceiptValidator.validate(receipt);
            if (validationResult === true) {
                this.handleSuccessState(receipt, promiEvent, callback);

                return;
            }

            self.handleErrorState(validationResult, promiEvent, callback);

            return;
        }

        self.newHeadsWatcher.watch().on('newHead', function () {
            self.transactionConfirmationModel.timeoutCounter++;
            if (!self.transactionConfirmationModel.isTimeoutTimeExceeded()) {
                self.getTransactionReceipt(transactionHash).then(function (receipt) {
                    var validationResult = self.transactionReceiptValidator.validate(receipt);
                    if (validationResult === true) {
                        self.transactionConfirmationModel.addConfirmation(receipt);
                        self.promiEvent.eventEmitter.emit(
                            'confirmation',
                            self.transactionConfirmationModel.confirmationsCount,
                            receipt
                        );

                        if (self.transactionConfirmationModel.isConfirmed()) {
                            self.handleSuccessState(receipt, promiEvent, callback);
                        }

                        return;
                    }

                    promiEvent.reject(validationResult);
                    promiEvent.eventEmitter.emit('error', validationResult, receipt);
                    promiEvent.eventEmitter.removeAllListeners();
                    callback(validationResult, null);
                });

                return;
            }

            var error =  new Error('Transaction was not mined within '+ self.transactionConfirmationModel.TIMEOUTBLOCK +' blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!');

            if (self.newHeadsWatcher.isPolling) {
                error = new Error('Transaction was not mined within' + self.transactionConfirmationModel.POLLINGTIMEOUT + ' seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!')
            }

            self.handleErrorState(
                error,
                promiEvent,
                callback
            );
        });
    });
};

/**
 * Get receipt by transaction hash
 *
 * @param {string} transactionHash
 */
TransactionConfirmationWorkflow.prototype.getTransactionReceipt = function (transactionHash) {
    this.provider.send('eth_getTransactionReceipt', transactionHash).then(function (receipt) {
        return this.formatters.outputTransactionReceiptFormatter(receipt);
    })
};

/**
 * Resolves promise, emits receipt event, calls callback and removes all the listeners.
 *
 * @param {Object} receipt
 * @param {Object} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
TransactionConfirmationWorkflow.prototype.handleSuccessState = function (receipt, promiEvent, callback) {
    this.newHeadsWatcher.stop();
    promiEvent.resolve(receipt);
    promiEvent.eventEmitter.emit('receipt', receipt);
    promiEvent.eventEmitter.removeAllListeners();
    callback(false, receipt);
};

/**
 * Rejects promise, emits error event, calls callback and removes all the listeners.
 *
 * @param {Object} error
 * @param {Object} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
TransactionConfirmationWorkflow.prototype.handleErrorState = function (error, promiEvent, callback) {
    this.newHeadsWatcher.stop();
    promiEvent.reject(error).apply(error);
    promiEvent.eventEmitter.emit('error', error);
    promiEvent.eventEmitter.removeAllListeners();
    callback(error, null);
};

module.exports = TransactionConfirmationWorkflow;
