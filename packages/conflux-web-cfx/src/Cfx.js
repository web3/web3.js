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

import {AbstractConfluxWebModule} from 'conflux-web-core';

export default class Cfx extends AbstractConfluxWebModule {
    /**
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {MethodFactory} methodFactory
     * @param {Network} net
     * @param {Accounts} accounts
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Object} options
     * @param {Net} nodeNet
     *
     * @constructor
     */
    constructor(
        provider,
        methodFactory,
        net,
        accounts,
        abiCoder,
        utils,
        formatters,
        subscriptionsFactory,
        contractModuleFactory,
        options,
        nodeNet
    ) {
        super(provider, options, methodFactory, nodeNet);

        this.net = net;
        this.accounts = accounts;
        this.abi = abiCoder;

        this.utils = utils;
        this.formatters = formatters;
        this.subscriptionsFactory = subscriptionsFactory;
        this.contractModuleFactory = contractModuleFactory;
        this.initiatedContracts = [];
        this._transactionSigner = options.transactionSigner;

        /**
         * This wrapper function is required for the "new confluxWeb.cfx.Contract(...)" call.
         *
         * @param {Object} abi
         * @param {String} address
         * @param {Object} options
         *
         * @returns {AbstractContract}
         *
         * @constructor
         */
        this.Contract = (abi, address, options = {}) => {
            const contract = this.contractModuleFactory.createContract(
                this.currentProvider,
                this.accounts,
                abi,
                address,
                {
                    defaultAccount: options.from || options.defaultAccount || this.defaultAccount,
                    defaultEpoch: options.defaultEpoch || this.defaultEpoch,
                    defaultGas: options.gas || options.defaultGas || this.defaultGas,
                    defaultGasPrice: options.gasPrice || options.defaultGasPrice || this.defaultGasPrice,
                    transactionBlockTimeout: options.transactionBlockTimeout || this.transactionBlockTimeout,
                    transactionConfirmationBlocks:
                        options.transactionConfirmationBlocks || this.transactionConfirmationBlocks,
                    transactionPollingTimeout: options.transactionPollingTimeout || this.transactionPollingTimeout,
                    transactionSigner: this.transactionSigner,
                    data: options.data
                }
            );

            this.initiatedContracts.push(contract);

            return contract;
        };
    }

    /**
     * Getter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @returns {TransactionSigner}
     */
    get transactionSigner() {
        return this._transactionSigner;
    }

    /**
     * TODO: Remove setter
     *
     * Setter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @param {TransactionSigner} transactionSigner
     */
    set transactionSigner(transactionSigner) {
        if (transactionSigner.type && transactionSigner.type === 'TransactionSigner') {
            throw new Error('Invalid TransactionSigner given!');
        }

        this._transactionSigner = transactionSigner;
        this.accounts.transactionSigner = transactionSigner;

        this.initiatedContracts.forEach((contract) => {
            contract.transactionSigner = transactionSigner;
        });
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions() {
        return super.clearSubscriptions('cfx_unsubscribe');
    }

    /**
     * Sets the defaultGasPrice property on all contracts and on all sub-modules
     *
     * @property defaultGasPrice
     *
     * @param {String|Number} value
     */
    set defaultGasPrice(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGasPrice = value;
        });

        this.net.defaultGasPrice = value;

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
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGas = value;
        });

        this.net.defaultGas = value;

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
        this.initiatedContracts.forEach((contract) => {
            contract.transactionBlockTimeout = value;
        });

        this.net.transactionBlockTimeout = value;

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
        this.initiatedContracts.forEach((contract) => {
            contract.transactionConfirmationBlocks = value;
        });

        this.net.transactionConfirmationBlocks = value;

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
        this.initiatedContracts.forEach((contract) => {
            contract.transactionPollingTimeout = value;
        });

        this.net.transactionPollingTimeout = value;

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
     * Sets the defaultAccount property on all contracts
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultAccount = this.utils.toChecksumAddress(value);
        });

        this.net.defaultAccount = value;

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
     * Setter for the defaultEpoch property
     *
     * @property defaultEpoch
     *
     * @param {String|Number}value
     */
    set defaultEpoch(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultEpoch = value;
        });

        this.net.defaultEpoch = value;

        super.defaultEpoch = value;
    }

    /**
     * Gets the defaultEpoch property
     *
     * @property defaultEpoch
     *
     * @returns {String|Number} value
     */
    get defaultEpoch() {
        return super.defaultEpoch;
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
        return this.subscriptionsFactory.getSubscription(this, type, options).subscribe(callback);
    }

    /**
     * Extends setProvider method from AbstractConfluxWebModule.
     * This is required for updating the provider also in the sub packages and objects related to Cfx.
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

        return this.net.setProvider(provider, net) && super.setProvider(provider, net) && setContractProviders;
    }
}
