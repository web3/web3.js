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

export default class Eth extends AbstractWeb3Module {
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProviderDetector} providerDetector
     * @param {ProviderAdapterResolver} providerAdapterResolver
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {Network} net
     * @param {Contract} Contract
     * @param {Accounts} accounts
     * @param {Personal} personal
     * @param {Iban} Iban
     * @param {AbiCoder} abiCoder
     * @param {Ens} ens
     * @param {Object} utils
     * @param {Object} formatters
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {MethodModelFactory} methodModelFactory
     * @param {MethodController} methodController
     *
     * @constructor
     */
    constructor(
        provider,
        providerDetector,
        providerAdapterResolver,
        providersModuleFactory,
        providers,
        methodController,
        methodModelFactory,
        net,
        Contract,
        accounts,
        personal,
        Iban,
        abiCoder,
        ens,
        utils,
        formatters,
        subscriptionsFactory
    ) {
        super(
            provider,
            providerDetector,
            providerAdapterResolver,
            providersModuleFactory,
            providers,
            methodController,
            methodModelFactory
        );

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
        this._defaultAccount = null;
        this._defaultBlock = 'latest';

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
            const contractObject = new Contract(this.currentProvider, this.accounts, abi, address, options);
            this.initiatedContracts.push(contractObject);

            return contractObject;
        };
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    get defaultAccount() {
        return this._defaultAccount;
    }

    /**
     * Setter for the defaultAccount property
     *
     * @property defaultAccount
     */
    set defaultAccount(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultAccount = value;
        });

        this.personal.defaultAccount = value;
        this._defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(value));
    }

    /**
     * Getter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String}
     */
    get defaultBlock() {
        return this._defaultBlock;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param value
     */
    set defaultBlock(value) {
        this._defaultBlock = value;

        this.initiatedContracts.forEach((contract) => {
            contract.defaultBlock = value;
        });

        this.personal.defaultBlock = this._defaultBlock;
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
     * @returns {eventifiedPromise | Subscription}
     */
    subscribe(type, options, callback) {
        switch (type) {
            case 'logs':
                return this.subscriptionsFactory
                    .createLogSubscription(
                        this,
                        options,
                        this.methodModelFactory.createMethodModel('getPastLogs'),
                        this.methodController
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
