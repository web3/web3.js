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
 * @file SendTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'lodash/isObject';
import AbstractSendMethod from '../../../lib/methods/AbstractSendMethod';

// TODO: Clean up this method and move the signing and observing logic to the eth module
export default class SendTransactionMethod extends AbstractSendMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
     * @param {TransactionSigner} transactionSigner
     * @param {SendRawTransactionMethod} sendRawTransactionMethod
     *
     * @constructor
     */
    constructor(
        utils,
        formatters,
        transactionConfirmationWorkflow,
        transactionSigner,
        sendRawTransactionMethod
    ) {
        super('eth_sendTransaction', 1, utils, formatters, transactionConfirmationWorkflow);
        this.transactionSigner = transactionSigner;
        this.sendRawTransactionMethod = sendRawTransactionMethod;
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputTransactionFormatter(this.parameters[0], moduleInstance);
    }

    /**
     * Checks if gasPrice is set, sends the request and returns a PromiEvent Object
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute(moduleInstance, promiEvent) {
        if (!this.isGasLimitDefined()) {
            if (this.hasDefaultGasLimit(moduleInstance)) {
                this.parameters[0]['gas'] = moduleInstance.defaultGas;
            }
        }

        if (!this.isGasPriceDefined() && this.hasDefaultGasPrice(moduleInstance)) {
            this.parameters[0]['gasPrice'] = moduleInstance.defaultGasPrice;
        }

        if (!this.isGasPriceDefined() && !this.hasDefaultGasPrice(moduleInstance)) {
            moduleInstance.currentProvider
                .send('eth_gasPrice', [])
                .then((gasPrice) => {
                    this.parameters[0]['gasPrice'] = gasPrice;
                    this.execute(moduleInstance, promiEvent);
                });

            return promiEvent;
        }

        let wallet;

        if (moduleInstance.accounts) {
            wallet = moduleInstance.accounts.wallet;
        }

        if (wallet.length > 0) {
            moduleInstance.transactionSigner
                .sign(this.parameters[0],  moduleInstance.accounts.wallet[this.parameters[0].from], moduleInstance)
                .then((response) => {
                    this.sendRawTransactionMethod.parameters = [response.rawTransaction];
                    this.sendRawTransactionMethod.execute(moduleInstance, promiEvent);
                })
                .catch((error) => {
                    if (this.callback) {
                        this.callback(error, null);
                    }

                    promiEvent.reject(error);
                    promiEvent.emit('error', error);
                    promiEvent.removeAllListeners();
                });

            return promiEvent;
        }

        super.execute(moduleInstance, promiEvent);

        return promiEvent;
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
     * @returns {Boolean}
     */
    isGasPriceDefined() {
        return isObject(this.parameters[0]) && typeof this.parameters[0].gasPrice !== 'undefined';
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
     * @returns {Boolean}
     */
    isGasLimitDefined() {
        return isObject(this.parameters[0]) && typeof this.parameters[0].gas !== 'undefined';
    }
}
