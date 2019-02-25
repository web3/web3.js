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

import {cloneDeep} from 'lodash/cloneDeep';
import AbstractSendMethod from '../../../lib/methods/AbstractSendMethod';

// TODO: Clean up this method and move the signing and observing logic to the eth module
export default class SendTransactionMethod extends AbstractSendMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
     * @param {SendRawTransactionMethod} sendRawTransactionMethod
     *
     * @constructor
     */
    constructor(utils, formatters, transactionConfirmationWorkflow, sendRawTransactionMethod) {
        super('eth_sendTransaction', 1, utils, formatters, transactionConfirmationWorkflow);
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
     * @param {Eth} moduleInstance
     * @param {PromiEvent} promiEvent
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute(moduleInstance, promiEvent) {
        if (!this.parameters[0].gas && moduleInstance.defaultGas) {
            this.parameters[0]['gas'] = moduleInstance.defaultGas;
        }

        if (!this.parameters[0].gasPrice) {
            if (!moduleInstance.defaultGasPrice) {
                moduleInstance.currentProvider.send('eth_gasPrice', []).then((gasPrice) => {
                    this.parameters[0].gasPrice = gasPrice;

                    this.execute(moduleInstance, promiEvent);
                });

                return promiEvent;
            }

            this.parameters[0]['gasPrice'] = moduleInstance.defaultGasPrice;
        }

        if (this.hasAccounts(moduleInstance) && this.isDefaultSigner(moduleInstance) || this.hasCustomSigner(moduleInstance)) {
            this.sendRawTransaction(
                moduleInstance.accounts.wallet[this.parameters[0].from],
                promiEvent,
                moduleInstance
            ).catch((error) => {
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
     * Signs the transaction and executes the SendRawTransaction method.
     *
     * @method sendRawTransaction
     *
     * @param {String} privateKey
     * @param {PromiEvent} promiEvent
     * @param {Eth} moduleInstance
     */
    async sendRawTransaction(privateKey, promiEvent, moduleInstance) {
        if (this.parameters[0].chainId) {
            this.parameters[0].chainId = await moduleInstance.getChainId();
        }

        if (!this.parameters[0].nonce && this.parameters[0].nonce !== 0) {
            this.parameters[0].nonce = await moduleInstance.getTransactionCount(this.parameters[0].from);
        }

        let transaction = this.formatters.txInputFormatter(cloneDeep(this.parameters[0]));
        transaction.to = transaction.to || '0x';
        transaction.data = transaction.data || '0x';
        transaction.value = transaction.value || '0x';
        transaction.chainId = this.utils.numberToHex(transaction.chainId);

        const response = await moduleInstance.transactionSigner.sign(transaction, privateKey);
        this.sendRawTransactionMethod.parameters = [response.rawTransaction];
        this.sendRawTransactionMethod.callback = this.callback;
        this.sendRawTransactionMethod.execute(moduleInstance, promiEvent);
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method isDefaultSigner
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    isDefaultSigner(moduleInstance) {
        return moduleInstance.transactionSigner.constructor.name === 'TransactionSigner';
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method hasAccounts
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasAccounts(moduleInstance) {
        return moduleInstance.accounts && Object.keys(moduleInstance.accounts.wallet).length > 0;
    }

    /**
     * Checks if a custom signer is given.
     *
     * @method hasCustomerSigner
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasCustomSigner(moduleInstance) {
        return moduleInstance.transactionSigner.constructor.name !== 'TransactionSigner';
    }
}
