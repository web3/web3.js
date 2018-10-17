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
 * @file AbstractSendMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');

/**
 * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
 *
 * @constructor
 */
function AbstractSendMethodCommand(transactionConfirmationWorkflow) {
    this.transactionConfirmationWorkflow = transactionConfirmationWorkflow;
}


/**
 * Sends the JSON-RPC request and executes the TransactionConfirmationWorkflow
 *
 * @method send
 *
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractWeb3Object} web3Package
 * @param {PromiEvent} promiEvent
 *
 * @returns {PromiEvent}
 */
AbstractSendMethodCommand.prototype.send = function (methodModel, promiEvent, web3Package) {
    var self = this;

    web3Package.currentProvider.send(
        methodModel.rpcMethod,
        methodModel.parameters
    ).then(function (response) {
        self.transactionConfirmationWorkflow.execute(
            methodModel,
            web3Package,
            response,
            promiEvent
        );

        promiEvent.eventEmitter.emit('transactionHash', response);

        if (methodModel.callback) {
            methodModel.callback(false, response);
        }
    }).catch(function (error) {
        promiEvent.reject(error);
        promiEvent.eventEmitter.emit('error', error);
        promiEvent.eventEmitter.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(error, null);
        }
    });

    return promiEvent;
};

module.exports = AbstractSendMethodCommand;
