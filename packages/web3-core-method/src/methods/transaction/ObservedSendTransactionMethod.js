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
 * @file ObservedSendTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractObservedTransactionMethod from '../../../lib/methods/transaction/AbstractObservedTransactionMethod';

// TODO: The Eth specific logic can only be moved out of the core-method module after merging of the submodules together to one eth module.
export default class ObservedSendTransactionMethod extends AbstractObservedTransactionMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     * @param {TransactionObserver} transactionObserver
     * @param {ChainIdMethod} chainIdMethod
     * @param {GetTransactionCountMethod} getTransactionCountMethod
     * @param {SendSignedTransactionMethod} sendSignedTransactionMethod
     *
     * @constructor
     */
    constructor(
        utils,
        formatters,
        moduleInstance,
        transactionObserver,
        chainIdMethod,
        getTransactionCountMethod,
        sendSignedTransactionMethod
    ) {
        super('eth_sendTransaction', 1, utils, formatters, moduleInstance, transactionObserver);

        this.chainIdMethod = chainIdMethod;
        this.getTransactionCountMethod = getTransactionCountMethod;
        this.sendSignedTransactionMethod = sendSignedTransactionMethod;
    }

    /**
     * Checks if gasPrice is set, sends the request and returns a PromiEvent Object
     *
     * @method execute
     *
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute() {
        if (!this.parameters[0].gas && this.moduleInstance.defaultGas) {
            this.parameters[0]['gas'] = this.moduleInstance.defaultGas;
        }

        if (!this.parameters[0].gasPrice) {
            if (!this.moduleInstance.defaultGasPrice) {
                this.moduleInstance.currentProvider.send('eth_gasPrice', []).then((gasPrice) => {
                    this.parameters[0].gasPrice = gasPrice;

                    this.execute();
                });

                return this.promiEvent;
            }

            this.parameters[0]['gasPrice'] = this.moduleInstance.defaultGasPrice;
        }

        if (this.hasAccounts() && this.isDefaultSigner()) {
            if (this.moduleInstance.accounts.wallet[this.parameters[0].from]) {
                this.sendRawTransaction(this.moduleInstance.accounts.wallet[this.parameters[0].from].privateKey)
                    .catch((error) => {
                        if (this.callback) {
                            this.callback(error, null);
                        }

                        this.promiEvent.reject(error);
                        this.promiEvent.emit('error', error);
                        this.promiEvent.removeAllListeners();
                    });

                return this.promiEvent;
            }
        }

        if (this.hasCustomSigner()) {
            this.sendRawTransaction().catch((error) => {
                if (this.callback) {
                    this.callback(error, null);
                }

                this.promiEvent.reject(error);
                this.promiEvent.emit('error', error);
                this.promiEvent.removeAllListeners();
            });

            return this.promiEvent;
        }

        return super.execute();
    }

    /**
     * Signs the transaction and executes the SendRawTransaction method.
     *
     * @method sendRawTransaction
     *
     * @param {String} privateKey
     */
    async sendRawTransaction(privateKey = null) {
        if (!this.parameters[0].chainId) {
            this.parameters[0].chainId = await this.chainIdMethod.execute();
        }

        if (!this.parameters[0].nonce && this.parameters[0].nonce !== 0) {
            this.getTransactionCountMethod.parameters = [this.parameters[0].from];

            this.parameters[0].nonce = await this.getTransactionCountMethod.execute();
        }

        const response = await this.moduleInstance.transactionSigner.sign(this.parameters[0], privateKey);

        this.sendSignedTransactionMethod.parameters = [response.rawTransaction];
        this.sendSignedTransactionMethod.callback = this.callback;
        this.sendSignedTransactionMethod.promiEvent = this.promiEvent;

        this.sendSignedTransactionMethod.execute();
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method isDefaultSigner
     *
     * @returns {Boolean}
     */
    isDefaultSigner() {
        return this.moduleInstance.transactionSigner.constructor.name === 'TransactionSigner';
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method hasAccounts
     *
     * @returns {Boolean}
     */
    hasAccounts() {
        return this.moduleInstance.accounts && this.moduleInstance.accounts.accountsIndex > 0;
    }

    /**
     * Checks if a custom signer is given.
     *
     * @method hasCustomerSigner
     *
     * @returns {Boolean}
     */
    hasCustomSigner() {
        return this.moduleInstance.transactionSigner.constructor.name !== 'TransactionSigner';
    }
}
