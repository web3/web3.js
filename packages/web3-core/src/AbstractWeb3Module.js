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
import {
    HttpProvider,
    WebsocketProvider,
    IpcProvider,
    BatchRequest,
    ProviderDetector,
    ProviderResolver
} from 'web3-providers';
import {MethodProxy} from 'web3-core-method';
import {toChecksumAddress} from 'web3-utils';

export default class AbstractWeb3Module {
    /**
     * @param {AbstractSocketProvider|HttpProvider|String|EthereumProvider} provider
     * @param {Object} options
     * @param {MethodFactory} methodFactory
     * @param {Net.Socket} nodeNet
     *
     * @constructor
     */
    constructor(provider, options = {}, methodFactory = null, nodeNet = null) {
        // ProviderDetector and ProviderResolver are created in the constructor for providing a simpler Web3 Module API.
        this.providerResolver = new ProviderResolver();
        this.givenProvider = ProviderDetector.detect();

        this._currentProvider = this.providerResolver.resolve(provider, nodeNet);
        this._defaultAccount = options.defaultAccount ? toChecksumAddress(options.defaultAccount) : undefined;
        this._defaultBlock = options.defaultBlock || 'latest';
        this._transactionBlockTimeout = options.transactionBlockTimeout || 50;
        this._transactionConfirmationBlocks = options.transactionConfirmationBlocks || 24;
        this._transactionPollingTimeout = options.transactionPollingTimeout || 750;
        this._transactionAutomine = options.automine || false;
        this._defaultGasPrice = options.defaultGasPrice;
        this._defaultGas = options.defaultGas;

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
        return this._defaultBlock;
    }

    /**
     * Setter for the defaultAccount property
     *
     * @property defaultBlock
     *
     * @param {String|Number} value
     */
    set defaultBlock(value) {
        this._defaultBlock = value;
    }

    /**
     * Getter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number}
     */
    get transactionBlockTimeout() {
        return this._transactionBlockTimeout;
    }

    /**
     * Setter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        this._transactionBlockTimeout = value;
    }

    /**
     * Getter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number}
     */
    get transactionConfirmationBlocks() {
        return this._transactionConfirmationBlocks;
    }

    /**
     * Setter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        this._transactionConfirmationBlocks = value;
    }

    /**
     * Getter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number}
     */
    get transactionPollingTimeout() {
        return this._transactionPollingTimeout;
    }

    /**
     * Setter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        this._transactionPollingTimeout = value;
    }

    /**
     * Getter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {Number|String}
     */
    get defaultGasPrice() {
        return this._defaultGasPrice;
    }

    /**
     * Setter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @param {Number|String} value
     */
    set defaultGasPrice(value) {
        this._defaultGasPrice = value;
    }

    /**
     * Getter for the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {Number|String}
     */
    get defaultGas() {
        return this._defaultGas;
    }

    /**
     * Setter for the defaultGas property
     *
     * @property defaultGas
     *
     * @param {Number|String} value
     */
    set defaultGas(value) {
        this._defaultGas = value;
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
        this._defaultAccount = toChecksumAddress(value);
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
        if (
            typeof this.currentProvider.clearSubscriptions !== 'undefined' &&
            this.currentProvider.subscriptions.length > 0
        ) {
            return this.currentProvider.clearSubscriptions(unsubscribeMethod);
        }

        return Promise.resolve(true);
    }
}
