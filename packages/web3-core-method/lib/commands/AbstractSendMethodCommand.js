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
 * Checks the gasPrice and sends the JSON-RPC request
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
    if (this.isGasPriceDefined(methodModel.parameters)) {
        this.sendMethod(methodModel, promiEvent, web3Package);

        return promiEvent;
    }

    this.getGasPrice(web3Package.currentProvider).then(function(gasPrice) {
        if (_.isObject(methodModel.parameters[0])) {
            methodModel.parameters[0].gasPrice = gasPrice;
        }

        self.sendMethod(methodModel, promiEvent, web3Package);
    });

    return promiEvent;
};

/**
 * Sends the JSON-RPC request
 *
 * @method send
 *
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractWeb3Object} web3Package
 * @param {PromiEvent} promiEvent
 */
AbstractSendMethodCommand.prototype.sendMethod = function (methodModel, promiEvent, web3Package) {
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
        promiEvent.on('error', error);
        promiEvent.eventEmitter.removeAllListeners();

        if (methodModel.callback) {
            methodModel.callback(error, null);
        }
    });
};


/**
 * Determines if gasPrice is defined in the method options
 *
 * @method isGasPriceDefined
 *
 * @param {Array} parameters
 *
 * @returns {Boolean}
 */
AbstractSendMethodCommand.prototype.isGasPriceDefined = function (parameters) {
    return _.isObject(parameters[0]) && typeof parameters[0].gasPrice !== 'undefined';
};

/**
 * Returns the current gasPrice of the connected node
 *
 * @param {AbstractProviderAdapter | EthereumProvider} provider
 *
 * @returns {Promise<String>}
 */
AbstractSendMethodCommand.prototype.getGasPrice = function (provider) {
    return provider.send('eth_gasPrice', []);
};

module.exports = AbstractSendMethodCommand;
