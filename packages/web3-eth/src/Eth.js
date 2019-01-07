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
import {AbstractContract} from 'web3-eth-contract';

export default class Eth extends AbstractWeb3Module {
    /**
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
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
        super(provider, providersModuleFactory, methodModuleFactory, methodFactory, options);

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
     * Sets the defaultGasPrice property on all contracts and on all sub-modules
     *
     * @property defaultGasPrice
     *
     * @param {String|Number} value
     */
    set defaultGasPrice(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.defaultGasPrice = value;
            });
        }

        if (this.net && this.personal) {
            this.net.defaultGasPrice = value;
            this.personal.defaultGasPrice = value;
        }

        super.defaultGasPrice = value;
    }

    /**
     * Gets the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {String|Number} value
     */
    get defaultGasPrice() {
        return super.defaultGasPrice;
    }

    /**
     * Sets the defaultGas property on all contracts and on all sub-modules
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.defaultGas = value;
            });
        }

        if (this.net && this.personal) {
            this.net.defaultGas = value;
            this.personal.defaultGas = value;
        }

        super.defaultGas = value;
    }

    /**
     * Gets the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {String|Number} value
     */
    get defaultGas() {
        return super.defaultGas;
    }

    /**
     * Sets the transactionBlockTimeout property on all contracts and on all sub-modules
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.transactionBlockTimeout = value;
            });
        }

        if (this.net && this.personal) {
            this.net.transactionBlockTimeout = value;
            this.personal.transactionBlockTimeout = value;
        }

        super.transactionBlockTimeout = value;
    }

    /**
     * Gets the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number} value
     */
    get transactionBlockTimeout() {
        return super.transactionBlockTimeout;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on all sub-modules
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.transactionConfirmationBlocks = value;
            });
        }

        if (this.net && this.personal) {
            this.net.transactionConfirmationBlocks = value;
            this.personal.transactionConfirmationBlocks = value;
        }

        super.transactionConfirmationBlocks = value;
    }

    /**
     * Gets the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number} value
     */
    get transactionConfirmationBlocks() {
        return super.transactionConfirmationBlocks;
    }

    /**
     * Sets the transactionPollingTimeout property on all contracts and on all sub-modules
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.transactionPollingTimeout = value;
            });
        }

        if (this.net && this.personal) {
            this.net.transactionPollingTimeout = value;
            this.personal.transactionPollingTimeout = value;
        }

        super.transactionPollingTimeout = value;
    }

    /**
     * Gets the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number} value
     */
    get transactionPollingTimeout() {
        return super.transactionPollingTimeout;
    }

    /**
     * Sets the defaultAccount property on all contracts and on the personal module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.defaultAccount = this.utils.toChecksumAddress(value);
            });
        }

        if (this.net && this.personal) {
            this.net.defaultAccount = value;
            this.personal.defaultAccount = value;
        }

        super.defaultAccount = value;
    }

    /**
     * Gets the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {String} value
     */
    get defaultAccount() {
        return super.defaultAccount;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param {String|Number}value
     */
    set defaultBlock(value) {
        if (this.initiatedContracts) {
            this.initiatedContracts.forEach(contract => {
                contract.defaultBlock = value;
            });
        }

        if (this.net && this.personal) {
            this.net.defaultBlock = value;
            this.personal.defaultBlock = value;
        }

        super.defaultBlock = value;
    }

    /**
     * Gets the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number} value
     */
    get defaultBlock() {
        return super.defaultBlock;
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
                return this.subscriptionsFactory.createSyncingSubscription(this).subscribe(callback);

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
        const setContractProviders = this.initiatedContracts.every(contract => {
            return contract.setProvider(provider, net);
        });

        return (
            this.net.setProvider(provider, net) &&
            this.personal.setProvider(provider, net) &&
            this.accounts.setProvider(provider, net) &&
            super.setProvider(provider, net) &&
            setContractProviders
        );
    }
}
