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
 * @file SendTransactionMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'underscore-es/isObject';
import AbstractCommand from '../../lib/commands/AbstractCommand';

export default class SendTransactionMethodCommand extends AbstractCommand {
    /**
     * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
     * @param {TransactionSigner} transactionSigner
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(transactionConfirmationWorkflow, transactionSigner, accounts) {
        super(accounts);
        this.transactionConfirmationWorkflow = transactionConfirmationWorkflow;
        this.transactionSigner = transactionSigner;
    }

    /**
     * Checks if gasPrice is set, sends the request and returns a PromiEvent Object
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute(moduleInstance, method, promiEvent) {
        method.beforeExecution(moduleInstance);
        if (method.rpcMethod === 'eth_sendTransaction') {
            if (this.hasWallets()) {
                return this.signAndSendRawTransaction(moduleInstance, method, promiEvent);
            }

            if (!this.hasWallets()) {
                return this.sendTransaction(moduleInstance, method, promiEvent);
            }
        }

        this.sendRequest(method, promiEvent, moduleInstance);

        return promiEvent;
    }

    /**
     * Sends the transaction and checks the gasPrice and gas property.
     *
     * @method sendTransaction
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     *
     * @returns {PromiEvent}
     */
    sendTransaction(moduleInstance, method, promiEvent) {
        if (!this.isGasLimitDefined(method.parameters)) {
            if (this.hasDefaultGasLimit(moduleInstance)) {
                method.parameters[0].gas = moduleInstance.defaultGas;
            }
        }

        if (this.isGasPriceDefined(method.parameters)) {
            this.sendRequest(method, promiEvent, moduleInstance);

            return promiEvent;
        }

        if (this.hasDefaultGasPrice(moduleInstance)) {
            method.parameters[0].gasPrice = moduleInstance.defaultGasPrice;
            this.sendRequest(method, promiEvent, moduleInstance);

            return promiEvent;
        }

        moduleInstance.currentProvider
            .send('eth_gasPrice', [])
            .then(gasPrice => {
                method.parameters[0].gasPrice = gasPrice;
                this.sendRequest(method, promiEvent, moduleInstance);
            });

        return promiEvent;
    }

    /**
     * Signs the transaction and sends it with eth_sendRawTransaction
     *
     * @method signAndSendRawTransaction
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     *
     * @returns {PromiEvent}
     */
    signAndSendRawTransaction(moduleInstance, method, promiEvent) {
        method.rpcMethod = 'eth_sendRawTransaction';

        this.transactionSigner
            .sign(method.parameters[0], this.accounts)
            .then((response) => {
                method.parameters = [response.rawTransaction];
                this.sendRequest(method, promiEvent, moduleInstance);
            })
            .catch((error) => {
                promiEvent.reject(error);
                promiEvent.emit('error', error);
                promiEvent.removeAllListeners();

                if (method.callback) {
                    method.callback(error, null);
                }
            });

        return promiEvent;
    }

    /**
     * Sends the JSON-RPC method
     *
     * @method send
     *
     * @param {AbstractMethod} method
     * @param {PromiEvent} promiEvent
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {PromiEvent}
     */
    sendRequest(method, promiEvent, moduleInstance) {
        moduleInstance.currentProvider
            .send(method.rpcMethod, method.parameters)
            .then((response) => {
                this.transactionConfirmationWorkflow.execute(method, moduleInstance, response, promiEvent);

                promiEvent.emit('transactionHash', response);

                if (method.callback) {
                    method.callback(false, response);
                }
            })
            .catch((error) => {
                promiEvent.reject(error);
                promiEvent.emit('error', error);
                promiEvent.removeAllListeners();

                if (method.callback) {
                    method.callback(error, null);
                }
            });
    }

    /**
     * Checks if the given Web3Module has an default gasPrice defined
     *
     * @method hasDefaultGasPrice
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasDefaultGasPrice(moduleInstance) {
        return moduleInstance.defaultGasPrice !== null && typeof moduleInstance.defaultGasPrice !== 'undefined';
    }

    /**
     * Checks if gasPrice is defined in the method options
     *
     * @method isGasPriceDefined
     *
     * @param {Array} parameters
     *
     * @returns {Boolean}
     */
    isGasPriceDefined(parameters) {
        return isObject(parameters[0]) && typeof parameters[0].gasPrice !== 'undefined';
    }

    /**
     * Checks if the given Web3Module has an default gas limit defined
     *
     * @method hasDefaultGasLimit
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasDefaultGasLimit(moduleInstance) {
        return moduleInstance.defaultGas !== null && typeof moduleInstance.defaultGas !== 'undefined';
    }

    /**
     * Checks if a gas limit is defined
     *
     * @method isGasLimitDefined
     *
     * @param {Array} parameters
     *
     * @returns {Boolean}
     */
    isGasLimitDefined(parameters) {
        return isObject(parameters[0]) && typeof parameters[0].gas !== 'undefined';
    }
}
