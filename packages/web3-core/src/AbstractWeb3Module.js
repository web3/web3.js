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
 * @file AbstractWeb3Module.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'underscore-es/isObject';

export default class AbstractWeb3Module {
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {AbstractMethodModelFactory} methodModelFactory
     * @param {Object} options
     *
     * @constructor
     */
    constructor(
        provider = this.throwIfMissing('provider'),
        providersModuleFactory = this.throwIfMissing('providersModuleFactory'),
        providers = this.throwIfMissing('providers'),
        methodController = this.throwIfMissing('methodController'),
        methodModelFactory = null,
        options = {}
    ) {
        this.providersModuleFactory = providersModuleFactory;
        this.providers = providers;
        this.methodController = methodController;
        this.providerDetector = providersModuleFactory.createProviderDetector();
        this.providerAdapterResolver = providersModuleFactory.createProviderAdapterResolver();

        this._currentProvider = provider;
        this._defaultAccount = options.defaultAccount || null;
        this.defaultBlock = options.defaultBlock || null;
        this.transactionBlockTimeout = options.transactionBlockTimeout || 50;
        this.transactionConfirmationBlocks = options.transactionConfirmationBlocks || 24;
        this.transactionPollingTimeout = options.transactionPollingTimeout || 15;
        this.defaultGasPrice = options.defaultGasPrice || null;
        this.defaultGas = options.defaultGas || null;
        this.givenProvider = this.providerDetector.detect();

        this.BatchRequest = () => {
            return this.providersModuleFactory.createBatchRequest(this.currentProvider);
        };

        if (methodModelFactory !== null || typeof methodModelFactory !== 'undefined') {
            this.methodModelFactory = methodModelFactory;

            return new Proxy(this, {
                get: this.proxyHandler
            });
        }
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
     * TODO: Add utils and formatters as dependency or create the core-types module and pass the factory to the
     * TODO: AbstractWeb3Module (factory.createAddress())
     *
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        this._defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(value));
    }

    /**
     * Returns the currentProvider
     *
     * @property currentProvider
     *
     * @returns {AbstractProviderAdapter|EthereumProvider}
     */
    get currentProvider() {
        return this._currentProvider;
    }

    /**
     * Throws an error because currentProvider is read-only
     *
     * @property currentProvider
     */
    set currentProvider(value) {
        throw new Error('The property currentProvider is read-only!');
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
        if (!this.isSameProvider(provider)) {
            this.clearSubscriptions();
            this._currentProvider = this.providerAdapterResolver.resolve(provider, net);

            return !!this._currentProvider;
        }

        return false;
    }

    /**
     * Checks if the given provider is the same as the currentProvider
     *
     * @method isSameProvider
     *
     * @param {Object|String} provider
     *
     * @returns {Boolean}
     */
    isSameProvider(provider) {
        if (isObject(provider)) {
            if (this.currentProvider.provider.constructor.name === provider.constructor.name) {
                return this.currentProvider.host === provider.host;
            }

            return false;
        }

        return this.currentProvider.host === provider;
    }

    /**
     * Clears all subscriptions and listeners of the provider if it has any subscriptions
     *
     * @method clearSubscriptions
     */
    clearSubscriptions() {
        if (
            typeof this.currentProvider.clearSubscriptions !== 'undefined' &&
            this.currentProvider.subscriptions.length > 0
        ) {
            this.currentProvider.clearSubscriptions();
        }
    }

    /**
     * TODO: Move this as a MethodProxy object in to the core-method module
     *
     * Handles method execution
     *
     * @method proxyHandler
     *
     * @param {Object} target
     * @param {String} name
     *
     * @returns {*}
     */
    proxyHandler(target, name) {
        if (target.methodModelFactory.hasMethodModel(name)) {
            if (typeof target[name] !== 'undefined') {
                throw new TypeError(
                    `Duplicated method ${name}. This method is defined as RPC call and as Object method.`
                );
            }

            const methodModel = target.methodModelFactory.createMethodModel(name);

            const anonymousFunction = () => {
                methodModel.methodArguments = arguments;

                if (methodModel.parameters.length !== methodModel.parametersAmount) {
                    throw new Error(
                        `Invalid parameters length the expected length would be 
                        ${methodModel.parametersAmount}
                         and not 
                        ${methodModel.parameters.length}`
                    );
                }

                return target.methodController.execute(methodModel, target.accounts, target);
            };

            anonymousFunction.methodModel = methodModel;
            anonymousFunction.request = methodModel.request;

            return anonymousFunction;
        }

        return target[name];
    }

    /**
     * Throws an error if the parameter is missing
     *
     * @param {String} name
     */
    throwIfMissing(name) {
        throw new Error(`Missing parameter: ${name}`);
    }
}
