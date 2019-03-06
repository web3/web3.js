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
 * @file SendObservedTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ObservedTransactionMethod from '../../../web3-core-method/src/methods/transaction/ObservedTransactionMethod';

export default class SendObservedTransactionMethod extends ObservedTransactionMethod {
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
        moduleInstance
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
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute(moduleInstance) {
        if (!this.parameters[0].gas && moduleInstance.defaultGas) {
            this.parameters[0]['gas'] = moduleInstance.defaultGas;
        }

        if (!this.parameters[0].gasPrice) {
            if (!moduleInstance.defaultGasPrice) {
                moduleInstance.currentProvider.send('eth_gasPrice', []).then((gasPrice) => {
                    this.parameters[0].gasPrice = gasPrice;

                    this.execute(moduleInstance);
                });

                return this.promiEvent;
            }

            this.parameters[0]['gasPrice'] = moduleInstance.defaultGasPrice;
        }

        if (this.hasAccounts(moduleInstance) && this.isDefaultSigner(moduleInstance)) {
            if (moduleInstance.accounts.wallet[this.parameters[0].from]) {
                this.sendRawTransaction(
                    moduleInstance.accounts.wallet[this.parameters[0].from].privateKey,
                    moduleInstance
                ).catch((error) => {
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

        if (this.hasCustomSigner(moduleInstance)) {
            this.sendRawTransaction(null, moduleInstance).catch((error) => {
                if (this.callback) {
                    this.callback(error, null);
                }

                this.promiEvent.reject(error);
                this.promiEvent.emit('error', error);
                this.promiEvent.removeAllListeners();
            });

            return this.promiEvent;
        }

        return super.execute(moduleInstance);
    }

    /**
     * Signs the transaction and executes the SendRawTransaction method.
     *
     * @method sendRawTransaction
     *
     * @param {String} privateKey
     * @param {Eth} moduleInstance
     */
    async sendRawTransaction(privateKey, moduleInstance) {
        if (!this.parameters[0].chainId) {
            this.parameters[0].chainId = await this.chainIdMethod.execute(moduleInstance);
        }

        if (!this.parameters[0].nonce && this.parameters[0].nonce !== 0) {
            this.getTransactionCountMethod.parameters = [this.parameters[0].from];

            this.parameters[0].nonce = await this.getTransactionCountMethod.execute(moduleInstance);
        }

        const response = await moduleInstance.transactionSigner.sign(this.parameters[0], privateKey);

        this.sendSignedTransactionMethod.parameters = [response.rawTransaction];
        this.sendSignedTransactionMethod.callback = this.callback;
        this.sendSignedTransactionMethod.promiEvent = this.promiEvent;

        this.sendSignedTransactionMethod.execute(moduleInstance);
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
        return moduleInstance.accounts && moduleInstance.accounts.accountsIndex > 0;
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
