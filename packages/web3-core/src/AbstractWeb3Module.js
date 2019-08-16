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

import isObject from 'lodash/isObject';
import {HttpProvider, WebsocketProvider, IpcProvider, BatchRequest, ProviderDetector} from 'web3-providers';
import {MethodProxy} from 'web3-core-method';

export default class AbstractWeb3Module {
    /**
     * @param {AbstractSocketProvider|HttpProvider|String|EthereumProvider} provider
     * @param {Object} options
     * @param {MethodFactory} methodFactory
     * @param {Net.Socket} nodeNet
     * @param {ProviderResolver} providerResolver
     *
     * @constructor
     */
    constructor(provider, options = {}, methodFactory = null, nodeNet = null, providerResolver) {
        this.providerResolver = providerResolver;
        this.givenProvider = ProviderDetector.detect(); // TODO: DI
        this._currentProvider = this.providerResolver.resolve(provider, nodeNet);
        this.options = options;

        this.BatchRequest = () => {
            return new BatchRequest(this);
        };

        if (methodFactory) {
            return new MethodProxy(this, methodFactory);
        }
    }

    /**
     * Getter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number}
     */
    get defaultBlock() {
        return this.options.defaultBlock;
    }

    /**
     * Setter for the defaultAccount property
     *
     * @property defaultBlock
     *
     * @param {String|Number} value
     */
    set defaultBlock(value) {
        this.options.defaultBlock = value;
    }

    /**
     * Getter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number}
     */
    get transactionBlockTimeout() {
        return this.options.transactionBlockTimeout;
    }

    /**
     * Setter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        this.options.transactionBlockTimeout = value;
    }

    /**
     * Getter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number}
     */
    get transactionConfirmationBlocks() {
        return this.options.transactionConfirmationBlocks;
    }

    /**
     * Setter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        this.options.transactionConfirmationBlocks = value;
    }

    /**
     * Getter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number}
     */
    get transactionPollingTimeout() {
        return this.options.transactionPollingTimeout;
    }

    /**
     * Setter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        this.options.transactionPollingTimeout = value;
    }

    /**
     * Getter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {Number|String}
     */
    get defaultGasPrice() {
        return this.options.defaultGasPrice;
    }

    /**
     * Setter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @param {Number|String} value
     */
    set defaultGasPrice(value) {
        this.options.defaultGasPrice = value;
    }

    /**
     * Getter for the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {Number|String}
     */
    get defaultGas() {
        return this.options.defaultGas;
    }

    /**
     * Setter for the defaultGas property
     *
     * @property defaultGas
     *
     * @param {Number|String} value
     */
    set defaultGas(value) {
        this.options.defaultGas = value;
    }

    /**
     * Returns a object with factory methods for the Web3 providers.
     *
     * @property providers
     *
     * @returns {Object}
     */
    static get providers() {
        return {
            HttpProvider,
            WebsocketProvider,
            IpcProvider
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
        return this.options.defaultAccount;
    }

    /**
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        this.options.defaultAccount = value;
    }

    /**
     * Returns the currentProvider
     *
     * @property currentProvider
     *
     * @returns {AbstractSocketProvider|HttpProvider|CustomProvider}
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
     * TODO: setProvider has to be asynchronous because of the clearSubscriptions method.
     *
     * Sets the currentProvider and provider property
     *
     * @method setProvider
     *
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {Net} net
     *
     * @returns {Boolean|Error}
     */
    setProvider(provider, net) {
        if (!this.isSameProvider(provider)) {
            const resolvedProvider = this.providerResolver.resolve(provider, net);
            this.clearSubscriptions();
            this._currentProvider = resolvedProvider;

            return true;
        }

        return false;
    }

    /**
     * Checks if the given provider is the same as the currentProvider
     *
     * @method isSameProvider
     *
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     *
     * @returns {Boolean}
     */
    isSameProvider(provider) {
        if (isObject(provider)) {
            if (this.currentProvider && this.currentProvider.constructor.name === provider.constructor.name) {
                return this.currentProvider.host === provider.host;
            }

            return false;
        }

        return this.currentProvider.host === provider;
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions(unsubscribeMethod) {
        if (this.currentProvider.supportsSubscriptions()) {
            return this.currentProvider.clearSubscriptions(unsubscribeMethod);
        }

        return Promise.resolve(true);
    }
}
