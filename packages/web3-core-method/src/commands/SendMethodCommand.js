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
 * @file SendMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSendMethodCommand = require('../../lib/commands/AbstractSendMethodCommand');

/**
 * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
 *
 * @constructor
 */
function SendMethodCommand(transactionConfirmationWorkflow) {
    AbstractSendMethodCommand.call(this, transactionConfirmationWorkflow);
}

/**
 * Determines if gasPrice is set, sends the request and returns a PromiEvent Object
 *
 * @method execute
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractProviderAdapter | EthereumProvider} provider
 * @param {PromiEvent} promiEvent
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
SendMethodCommand.prototype.execute = function (web3Package, methodModel, provider, promiEvent) {
    var self = this;

    methodModel.beforeExecution(web3Package);

    if (this.isGasPriceDefined(methodModel.parameters)) {
        return this.send(methodModel, provider, promiEvent);
    }

    this.getGasPrice(provider).then(function(gasPrice) {
        if (_.isObject(methodModel.parameters[0])) {
            methodModel.parameters[0].gasPrice = gasPrice;
        }

        self.send(methodModel, provider, promiEvent);
    });

    return promiEvent;
};

SendMethodCommand.prototype = Object.create(AbstractSendMethodCommand.prototype);

module.exports = SendMethodCommand;
