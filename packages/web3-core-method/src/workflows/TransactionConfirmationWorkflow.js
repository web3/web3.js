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
 * @param {Object} transactionConfirmationModel
 * @param {Object} transactionReceiptValidator
 * @param {Object} newHeadsWatcher
 * @constructor
 */
function TransactionConfirmationWorkflow( // TODO: Timeout handling
    transactionConfirmationModel,
    transactionReceiptValidator,
    newHeadsWatcher
) {
    this.transactionConfirmationModel = transactionConfirmationModel;
    this.transactionReceiptValidator = transactionReceiptValidator;
    this.newHeadsWatcher = newHeadsWatcher;
}

/**
 * Executes the transaction confirmation workflow
 *
 * @param {string} transactionHash
 * @param {Function} outputFormatter
 * @param {Function} extraFormatter //TODO: check for what exactly this extraFormatters are and where they are used.
 * @param {Object} promiEvent
 * @param {Function} callback
 */
TransactionConfirmationWorkflow.prototype.execute = function (transactionHash, outputFormatter, extraFormatter, promiEvent, callback) {
    var self = this;
    this.getTransactionReceipt(transactionHash).then(function (receipt) {
        if (receipt && receipt.blockHash) {
            var validationResult = this.transactionReceiptValidator.validate(receipt);
            if (validationResult === true) {
                promiEvent.eventEmitter.emit('receipt', receipt);
                promiEvent.resolve(receipt);
                callback(false, receipt);

                return;
            }

            promiEvent.eventEmitter.emit('error', validationResult);
            promiEvent.reject(validationResult);
            callback(validationResult, null);

            return;
        }

        self.newHeadsWatcher.watch().on('newHead', function () {
            self.getTransactionReciept(transactionHash).then(function (receipt) {
                var validationResult = self.transactionReceiptValidator.validate(receipt);
                if (validationResult === true) {
                    var formattedReceipt = outputFormatter(receipt);

                    self.transactionConfirmationModel.addConfirmation(formattedReceipt);
                    var confirmationsCount = self.transactionConfirmationModel.getConfirmationsCount();

                    self.promiEvent.eventEmitter.emit(
                        'confirmation',
                        confirmationsCount,
                        outputFormatter(formattedReceipt)
                    );

                    if (confirmationsCount === CONFIRMATIONBLOCKS) {
                        promiEvent.eventEmitter.emit('receipt', outputFormatter(formattedReceipt));
                        promiEvent.resolve(outputFormatter(formattedReceipt));
                        callback(false, formattedReceipt);

                        self.newHeadsWatcher.stop();
                    }

                    return;
                }

                promiEvent.eventEmitter.emit('error', validationResult, receipt);
                promiEvent.reject(validationResult);
                callback(validationResult, null);

                // throw validationResult; have a closer look to utils.fireError and why this method exists
            });
        });
    });
};
