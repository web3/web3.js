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

"use strict";

import {AbstractWeb3Module} from 'web3-core';

export default class Eth extends AbstractWeb3Module {

    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Network} net
     * @param {ContractPackage} contractPackage
     * @param {Accounts} accounts
     * @param {Personal} personal
     * @param {Iban} iban
     * @param {Abi} abi
     * @param {ENS} ens
     * @param {Object} utils
     * @param {Object} formatters
     * @param {ProvidersPackage} providersPackage
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {MethodModelFactory} methodModelFactory
     * @param {MethodController} methodController
     *
     * @constructor
     */
    constructor(
        provider,
        net,
        contractPackage,
        accounts,
        personal,
        iban,
        abi,
        ens,
        utils,
        formatters,
        providersPackage,
        subscriptionsFactory,
        methodController,
        methodModelFactory
    ) {
        super(provider, providersPackage, methodController, methodModelFactory);
        this.net = net;
        this.accounts = accounts;
        this.personal = personal;
        this.Iban = Iban;
        this.abi = abi;
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
            const contract = new contractPackage.Contract(this.currentProvider, this.accounts, abi, address, options);
            this.initiatedContracts.push(contract);

            return contract;
        };

        let defaultAccount = null, defaultBlock = 'latest';

        /**
         * Defines accessors for defaultAccount
         */
        Object.defineProperty(this, 'defaultAccount', {
            get: () => {
                return defaultAccount;
            },
            set: (val) => {
                if (val) {
                    this.initiatedContracts.forEach(contract => {
                        contract.defaultAccount = val;
                    });

                    this.personal.defaultAccount = val;
                    defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
                }

            },
            enumerable: true
        });

        /**
         * Defines accessors for defaultBlock
         */
        Object.defineProperty(this, 'defaultBlock', {
            get: () => {
                return defaultBlock;
            },
            set: (val) => {
                defaultBlock = val;
                this.initiatedContracts.forEach(contract => {
                    contract.defaultAccount = val;
                });

                this.personal.defaultBlock = defaultBlock;
            },
            enumerable: true
        });
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
                return this.subscriptionsFactory.createLogSubscription(
                    this,
                    options,
                    this.methodModelFactory.createMethodModel('getPastLogs'),
                    this.methodController
                ).subscribe(callback);

            case 'newBlockHeaders':
                return this.subscriptionsFactory.createNewHeadsSubscription(
                    this
                ).subscribe(callback);

            case 'pendingTransactions':
                return this.subscriptionsFactory.createNewPendingTransactionsSubscription(
                    this
                ).subscribe(callback);

            case 'syncing':
                return this.subscriptionsFactory.createSyncingSubscriptionModel(
                    this
                ).subscribe(callback);

            default:
                throw Error(`Unknown subscription: ${type}`);
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
            return !!contract.setProvider(provider, net);
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
