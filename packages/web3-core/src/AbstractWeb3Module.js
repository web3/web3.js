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
     * @param {AbstractProviderAdapter|EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {ModuleFactory} methodModuleFactory
     * @param {AbstractMethodFactory} methodFactory
     * @param {Object} options
     *
     * @constructor
     */
    constructor(
        provider = this._throwIfMissing('provider'),
        providersModuleFactory = this._throwIfMissing('ProvidersModuleFactory'),
        providers = this._throwIfMissing('providers'),
        methodModuleFactory = this._throwIfMissing('MethodModuleFactory'),
        methodFactory = null,
        options = {}
    ) {
        this.providersModuleFactory = providersModuleFactory;
        this.providers = providers;
        this.providerDetector = providersModuleFactory.createProviderDetector();
        this.providerAdapterResolver = providersModuleFactory.createProviderAdapterResolver();
        this.givenProvider = this.providerDetector.detect();
        this._currentProvider = this.providerAdapterResolver.resolve(provider);

        this._defaultAccount = options.defaultAccount;
        this.defaultBlock = options.defaultBlock;
        this.transactionBlockTimeout = options.transactionBlockTimeout || 50;
        this.transactionConfirmationBlocks = options.transactionConfirmationBlocks || 24;
        this.transactionPollingTimeout = options.transactionPollingTimeout || 15;
        this.defaultGasPrice = options.defaultGasPrice;
        this.defaultGas = options.defaultGas;

        this.BatchRequest = () => {
            return this.providersModuleFactory.createBatchRequest(this.currentProvider);
        };

        if (methodFactory !== null || typeof methodFactory !== 'undefined') {
            this.methodFactory = methodFactory;

            return methodModuleFactory.createMethodProxy(
                this,
                this.methodFactory
            );
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
     * @returns {AbstractProviderAdapter}
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
     * @param {AbstractProviderAdapter|EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
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
     * @param {AbstractProviderAdapter|EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
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
     * Throws an error if the parameter is missing
     *
     * @param {String} name
     */
    static _throwIfMissing(name) {
        throw new Error(`Missing parameter: ${name}`);
    }
}
