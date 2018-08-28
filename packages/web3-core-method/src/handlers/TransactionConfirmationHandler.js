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
 * @file TransactionConfirmationHandler.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var TIMEOUTBLOCK = 50;
var POLLINGTIMEOUT = 15 * TIMEOUTBLOCK; // ~average block time (seconds) * TIMEOUTBLOCK
var CONFIRMATIONBLOCKS = 24;

function TransactionConfirmationHandler(connectionModel, coreFactory) {
    this.connectionModel = connectionModel;
    this.coreFactory = coreFactory; // For Subscription creation
    this.formatters = this.coreFactory.createFormatters();// for rpc methods
    this.confirmationCountForApprovedState = 24;
    this.newHeadsSubscription = null;
}

TransactionConfirmationHandler.prototype.handle = function (transactionPromise, outputFormatter) {
    var confirmations = 0;
    // determine if it's a contract deployment or not and run the correct method
    // return promiEvent on.(confirmation|reciept...)
};

TransactionConfirmationHandler.prototype.handleTransaction = function () {
    // handle normal transaction and run outputFormatter on it
};

TransactionConfirmationHandler.prototype.handleContractDeployment = function () {
    // Check for contract address in reciept and check if the code is succesfully deployed on chain
    // use contractDeployFormatter on output
};

TransactionConfirmationHandler.prototype.startConfirmationListener = function () {
    // Check if subscriptions are supported and if they are start an subscription of newHeads and check if this transaction
    // is confirmed. If it's confirmed increase the confirmation counter.
};

TransactionConfirmationHandler.prototype.isTransactionApproved = function () {
    // checks if it has enough confirmations for approving this transaction
};

TransactionConfirmationHandler.prototype.clearConfirmationListeners = function () {
    // clears all listeners and unsubscribe newHeads subscription
};

TransactionConfirmationHandler.prototype.getTransactionReciept = function (transactionHash) {
    return this.connectionModel.provider.send('eth_getTransactionReciept', transactionHash).then(function (reciept) {
        // output formatter
    });
};

TransactionConfirmationHandler.prototype.getContractCode = function (address, blockNumber) {
    return this.connectionModel.provider.send('eth_getCode', addressFormatter(address), blockNumberFormatter(blockNumber));
};
