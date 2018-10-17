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

import SendMethodCommand from './SendMethodCommand';

export default class SignAndSendMethodCommand extends SendMethodCommand {

    /**
     * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
     * @param {TransactionSigner} transactionSigner
     *
     * @constructor
     */
    constructor(transactionConfirmationWorkflow, transactionSigner) {
        super(transactionConfirmationWorkflow);
        this.transactionSigner = transactionSigner;
    }

    /**
     * Sends the JSON-RPC request and returns an PromiEvent object
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethodModel} methodModel
     * @param {PromiEvent} promiEvent
     * @param {Accounts} accounts
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute(moduleInstance, methodModel, promiEvent, accounts) {
        methodModel.beforeExecution(moduleInstance);
        methodModel.rpcMethod = 'eth_sendRawTransaction';

        this.transactionSigner.sign(methodModel.parameters[0], accounts).then(response => {
            methodModel.parameters = [response.rawTransaction];
            this.send(methodModel, promiEvent, moduleInstance);
        }).catch(error => {
            promiEvent.reject(error);
            promiEvent.emit('error', error);
            promiEvent.removeAllListeners();

            if (methodModel.callback) {
                methodModel.callback(error, null);
            }
        });

        return promiEvent;
    }
}
