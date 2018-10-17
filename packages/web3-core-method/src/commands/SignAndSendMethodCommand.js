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
 * @file SignAndSendMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var SendMethodCommand = require('./SendMethodCommand');

/**
 * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
 * @param {TransactionSigner} transactionSigner
 *
 * @constructor
 */
function SignAndSendMethodCommand(transactionConfirmationWorkflow, transactionSigner) {
    SendMethodCommand.call(this, transactionConfirmationWorkflow);
    this.transactionSigner = transactionSigner;
}

SignAndSendMethodCommand.prototype = Object.create(SendMethodCommand.prototype);
SignAndSendMethodCommand.prototype.constructor = SignAndSendMethodCommand;

/**
 * Sends the JSON-RPC request and returns an PromiEvent object
 *
 * @method execute
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {AbstractMethodModel} methodModel
 * @param {Accounts} accounts
 * @param {PromiEvent} promiEvent
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
SignAndSendMethodCommand.prototype.execute = function (
    methodModel,
    web3Package,
    accounts,
    promiEvent,
) {
    var self = this;

    methodModel.beforeExecution(web3Package);
    methodModel.rpcMethod = 'eth_sendRawTransaction';

    this.transactionSigner.sign(methodModel.parameters[0], accounts).then(function(response) {
        methodModel.parameters = [response.rawTransaction];
        self.send(methodModel, promiEvent, web3Package);
    }).catch(function(error) {
        promiEvent.reject(error);
        promiEvent.eventEmitter.emit('error', error);
        promiEvent.eventEmitter.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(error, null);
        }
    });

    return promiEvent;
};

module.exports = SignAndSendMethodCommand;
