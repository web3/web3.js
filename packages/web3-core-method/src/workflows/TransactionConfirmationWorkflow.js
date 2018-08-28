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

var TIMEOUTBLOCK = 50;
var POLLINGTIMEOUT = 15 * TIMEOUTBLOCK; // ~average block time (seconds) * TIMEOUTBLOCK
var CONFIRMATIONBLOCKS = 24;

/**
 * @param {Object} connectionModel
 * @param {Object} transactionConfirmationModel
 * @param {Object} transactionReceiptValidator
 * @param {Object} newHeadsWatcher
 * @constructor
 */
function TransactionConfirmationWorkflow(// TODO: Timeout handling, remove eventEmitter listeners on "done"
    connectionModel,
    transactionConfirmationModel,
    transactionReceiptValidator,
    newHeadsWatcher
) {
    this.transactionConfirmationModel = transactionConfirmationModel;
    this.transactionReceiptValidator = transactionReceiptValidator;
    this.newHeadsWatcher = newHeadsWatcher;
    this.provider = connectionModel.provider;
    this.connectionModel = connectionModel;
}

/**
 * Executes the transaction confirmation workflow
 *
 * @param {string} transactionHash
 * @param {Function} outputFormatter
 * @param {boolean} isContractDeployment
 * @param {Object} promiEvent
 * @param {Function} callback
 */
TransactionConfirmationWorkflow.prototype.execute = function (// TODO: check extraFormatters
    transactionHash,
    outputFormatter,
    isContractDeployment,
    promiEvent,
    callback
) {
    var self = this;
    this.getTransactionReceipt(transactionHash).then(function (receipt) {
        if (receipt && receipt.blockHash) {
            var validationResult = this.transactionReceiptValidator.validate(receipt);
            if (validationResult === true) {

                if (isContractDeployment) {
                    self.handleContractDeployment(receipt, promiEvent, callback);

                    return;
                }

                this.handleSuccessState(receipt, promiEvent, callback);

                return;
            }

            self.handleErrorState(validationResult, promiEvent, callback);

            return;
        }

        self.newHeadsWatcher.watch().on('newHead', function () {
            self.getTransactionReceipt(transactionHash).then(function (receipt) {
                var validationResult = self.transactionReceiptValidator.validate(receipt);
                if (validationResult === true) {

                    if (isContractDeployment) {
                        self.handleContractDeployment(receipt, promiEvent, callback);

                        return;
                    }

                    var formattedReceipt = outputFormatter(receipt);

                    self.transactionConfirmationModel.addConfirmation(formattedReceipt);
                    var confirmationsCount = self.transactionConfirmationModel.getConfirmationsCount();

                    self.promiEvent.eventEmitter.emit(
                        'confirmation',
                        confirmationsCount,
                        formattedReceipt
                    );

                    if (confirmationsCount === (CONFIRMATIONBLOCKS + 1)) {
                        self.handleSuccessState(formattedReceipt, promiEvent, callback);
                    }

                    return;
                }

                promiEvent.reject(validationResult);
                promiEvent.eventEmitter.emit('error', validationResult, receipt);
                promiEvent.eventEmitter.removeAllListeners();
                callback(validationResult, null);
            });
        });
    });
};

/**
 * Handle contract deployment
 *
 * @param {Object} receipt
 * @param {Object} promiEvent
 * @param {Function} callback
 */
TransactionConfirmationWorkflow.prototype.handleContractDeployment = function (receipt, promiEvent, callback) {
    var self = this;

    if (!receipt.contractAddress) {
        self.handleErrorState(
            new Error('The transaction receipt didn\'t contain a contract address.'),
            promiEvent,
            callback
        );
    }

    this.getContractCode(receipt.contractAddress).then(function (contractCode) {
        if (contractCode.length > 2) {
            var result = receipt;

            if (method.extraFormatters && method.extraFormatters.contractDeployFormatter) {
                result = method.extraFormatters.contractDeployFormatter(receipt);
            }

            self.newHeadsWatcher.stop();

            promiEvent.resolve(result);
            promiEvent.eventEmitter.emit('receipt', receipt);
            promiEvent.eventEmitter.removeAllListeners();
            callback(false, result);

            return;
        }

        self.handleErrorState(
            new Error('The contract code couldn\'t be stored, please check your gas limit.'),
            promiEvent,
            callback
        );

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
 * Get code of contract by his address
 *
 * @param {string} contractAddress
 * @returns {Promise<string>}
 */
TransactionConfirmationWorkflow.prototype.getContractCode = function (contractAddress) {
    return this.provider.send(
        'eth_getCode',
        [
            this.formatters.inputAddressFormatter(contractAddress),
            this.formatters.inputDefaultBlockNumberFormatter() // have a closer look on this formatter it uses this.defaultBlock from a magic scope where ever it is defined.
        ]
    );
};

/**
 * Resolves promise, emits receipt event, calls callback and removes all the listeners.
 *
 * @param {Object} receipt
 * @param {Object} promiEvent
 * @param {Function} callback
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
 */
TransactionConfirmationWorkflow.prototype.handleErrorState = function (error, promiEvent, callback) {
    this.newHeadsWatcher.stop();
    promiEvent.reject(error).apply(error);
    promiEvent.eventEmitter.emit('error', error);
    promiEvent.eventEmitter.removeAllListeners();
    callback(error, null);
};
