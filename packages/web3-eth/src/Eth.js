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
 * @file Eth.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import Contract from './Contract';

export default class Eth extends AbstractWeb3Module {
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {EthModuleFactory} ethModuleFactory
     * @param {Network} net
     * @param {Accounts} accounts
     * @param {Personal} personal
     * @param {Iban} Iban
     * @param {AbiCoder} abiCoder
     * @param {Ens} ens
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {MethodFactory} methodFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Object} options
     *
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        providers,
        methodModuleFactory,
        methodFactory,
        ethModuleFactory,
        net,
        accounts,
        personal,
        Iban,
        abiCoder,
        ens,
        utils,
        formatters,
        subscriptionsFactory,
        options
    ) {
        super(provider, providersModuleFactory, providers, methodModuleFactory, methodFactory, options);

        this.ethModuleFactory = ethModuleFactory;
        this.net = net;
        this.accounts = accounts;
        this.personal = personal;
        this.Iban = Iban;
        this.abi = abiCoder;
        this.ens = ens;
        this.utils = utils;
        this.formatters = formatters;
        this.subscriptionsFactory = subscriptionsFactory;
        this.initiatedContracts = [];

        /**
         * This wrapper function is required for the "new web3.eth.Contract(...)" call.
         *
         * @param {Object} abi
         * @param {String} address
         * @param {Object} options
         *
         * @returns {Contract}
         *
         * @constructor
         */
        this.Contract = (abi, address, options) => {
            if (!(this instanceof Contract)) {
                throw new TypeError('Please use the "new" keyword to instantiate a web3.eth.contract() object!');
            }

            const contract = this.ethModuleFactory.createContract(abi, address, options);

            this.initiatedContracts.push(contract);

            return contract;
        };
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions() {
        return super.clearSubscriptions('eth_unsubscribe');
    }

    /**
     * Sets the defaultGasPrice property on all contracts and on the personal module
     *
     * @property defaultGasPrice
     *
     * @param {String} value
     */
    set defaultGasPrice(value) {
        super.defaultGasPrice = value;
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGasPrice = value;
        });

        this.net.defaultGasPrice = value;
        this.personal.defaultGasPrice = value;
    }

    /**
     * Sets the defaultGas property on all contracts and on the personal module
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        super.defaultGas = value;
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGas = value;
        });

        this.net.defaultGas = value;
        this.personal.defaultGas = value;
    }

    /**
     * Sets the transactionBlockTimeout property on all contracts and on the personal module
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        super.transactionBlockTimeout = value;
        this.initiatedContracts.forEach((contract) => {
            contract.transactionBlockTimeout = value;
        });

        this.net.transactionBlockTimeout = value;
        this.personal.transactionBlockTimeout = value;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on the personal module
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        super.transactionConfirmationBlocks = value;
        this.initiatedContracts.forEach((contract) => {
            contract.transactionConfirmationBlocks = value;
        });

        this.net.transactionConfirmationBlocks = value;
        this.personal.transactionConfirmationBlocks = value;
    }

    /**
     * Sets the transactionPollingTimeout property on all contracts and on the personal module
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        super.transactionPollingTimeout = value;
        this.initiatedContracts.forEach((contract) => {
            contract.transactionPollingTimeout = value;
        });

        this.net.transactionPollingTimeout = value;
        this.personal.transactionPollingTimeout = value;
    }

    /**
     * Sets the defaultAccount property on all contracts and on the personal module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        super.defaultAccount = value;
        this.initiatedContracts.forEach((contract) => {
            contract.defaultAccount = value;
        });

        this.net.defaultAccount = value;
        this.personal.defaultAccount = value;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param {String|Number}value
     */
    set defaultBlock(value) {
        super.defaultBlock = value;
        this.initiatedContracts.forEach((contract) => {
            contract.defaultBlock = value;
        });

        this.net.defaultBlock = value;
        this.personal.defaultBlock = value;
    }

    /**
     * Gets and executes subscription for an given type
     *
     * @method subscribe
     *
     * @param {String} type
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription}
     */
    subscribe(type, options, callback) {
        switch (type) {
            case 'logs':
                return this.subscriptionsFactory
                    .createLogSubscription(
                        options,
                        this,
                        this.methodFactory.createMethod('getPastLogs')
                    )
                    .subscribe(callback);

            case 'newBlockHeaders':
                return this.subscriptionsFactory.createNewHeadsSubscription(this).subscribe(callback);

            case 'pendingTransactions':
                return this.subscriptionsFactory.createNewPendingTransactionsSubscription(this).subscribe(callback);

            case 'syncing':
                return this.subscriptionsFactory.createSyncingSubscriptionModel(this).subscribe(callback);

            default:
                throw new Error(`Unknown subscription: ${type}`);
        }
    }

    /**
     * Extends setProvider method from AbstractWeb3Module.
     * This is required for updating the provider also in the sub packages and objects related to Eth.
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        const setContractProviders = this.initiatedContracts.every((contract) => {
            return contract.setProvider(provider, net);
        });

        return !!(
            super.setProvider(provider, net) &&
            this.net.setProvider(provider, net) &&
            this.personal.setProvider(provider, net) &&
            this.accounts.setProvider(provider, net) &&
            setContractProviders
        );
    }
}
