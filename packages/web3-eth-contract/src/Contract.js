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
 * @file Contract.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';

export default class Contract extends AbstractWeb3Module {
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProviderDetector} providerDetector
     * @param {ProviderAdapterResolver} providerAdapterResolver
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {PromiEvent} PromiEvent
     * @param {ABICoder} abiCoder
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Accounts} accounts
     * @param {ABIMapper} abiMapper
     * @param {Object} abi
     * @param {String} address
     * @param {Object} options
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
        contractModuleFactory,
        PromiEvent,
        abiCoder,
        utils,
        formatters,
        accounts,
        abiMapper,
        abi,
        address,
        options
    ) {
        super(
            provider,
            providerDetector,
            providerAdapterResolver,
            providersModuleFactory,
            providers,
            methodController,
            null
        );

        if (!(this instanceof Contract)) {
            throw new TypeError('Please use the "new" keyword to instantiate a web3.eth.contract() object!');
        }

        if (!abi || !Array.isArray(abi)) {
            throw new Error(
                'You must provide the json interface of the contract when instantiating a contract object.'
            );
        }

        this.contractModuleFactory = contractModuleFactory;
        this.abiCoder = abiCoder;
        this.utils = utils;
        this.formatters = formatters;
        this.accounts = accounts;
        this.abiMapper = abiMapper;
        this.options = options;
        this.PromiEvent = PromiEvent;
        this.rpcMethodModelFactory = contractModuleFactory.createRpcMethodModelFactory();
        this._defaultAccount = null;
        this._defaultBlock = 'latest';
        this.abiModel = abiMapper.map(abi);
        this.options.address = address;

        Object.defineProperty(this.options, 'jsonInterface', {
            get: () => {
                return this.abiModel;
            },
            set: (value) => {
                this.abiModel = this.abiMapper.map(value);
                this.methods.abiModel = this.abiModel;
                this.events.abiModel = this.abiModel;
            },
            enumerable: true
        });

        Object.defineProperty(this.options, 'address', {
            get: () => {
                return this._address;
            },
            set: (value) => {
                this._address = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(value));
            },
            enumerable: true
        });

        this.methods = contractModuleFactory.createMethodsProxy(
            this,
            this.abiModel,
            this.methodController,
            this.PromiEvent
        );

        this.events = contractModuleFactory.createEventSubscriptionsProxy(
            this,
            this.abiModel,
            this.methodController,
            this.PromiEvent
        );
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
    }

    /**
     * Adds event listeners and creates a subscription, and remove it once its fired.
     *
     * @method once
     *
     * @param {String} eventName
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {undefined}
     */
    once(eventName, options, callback) {
        if (!callback) {
            throw new Error('Once requires a callback function.');
        }

        if (options) {
            delete options.fromBlock;
        }

        const eventSubscription = this.events[event](options, callback);

        eventSubscription.on('data', () => {
            eventSubscription.unsubscribe();
        });
    }

    /**
     * Returns the past event logs by his name
     *
     * @method getPastEvents
     *
     * @param {String} eventName
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Array>}
     */
    getPastEvents(eventName, options, callback) {
        if (!this.options.jsonInterface.hasEvent(eventName)) {
            throw new Error(`Event with name "${eventName}does not exists.`);
        }

        const pastEventLogsMethodModel = this.rpcMethodModelFactory.createPastEventLogsMethodModel(
            this.options.jsonInterface.getEvent(eventName)
        );

        pastEventLogsMethodModel.parameters = [options];
        pastEventLogsMethodModel.callback = callback;

        return this.methodController.execute(pastEventLogsMethodModel, this.accounts, this);
    }

    /**
     * Deploy an contract and returns an new Contract instance with the correct address set
     *
     * @method deploy
     *
     * @param {Object} options
     *
     * @returns {Promise<Contract>|EventEmitter}
     */
    deploy(options) {
        return this.methods.contractConstructor(options);
    }

    /**
     * Return an new instance of the Contract object
     *
     * @method clone
     *
     * @returns {Contract}
     */
    clone() {
        const contract = new this.constructor(
            this.currentProvider,
            this.providerDetector,
            this.providerAdapterResolver,
            this.providersModuleFactory,
            this.providers,
            this.methodController,
            this.contractModuleFactory,
            this.PromiEvent,
            this.abiCoder,
            this.utils,
            this.formatters,
            this.accounts,
            this.abiMapper,
            {},
            this.options.address,
            this.options
        );

        contract.abiModel = this.abiModel;

        return contract;
    }

    /**
     * Sets the currentProvider and provider property
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(super.setProvider(provider, net) && this.accounts.setProvider(provider, net));
    }
}
