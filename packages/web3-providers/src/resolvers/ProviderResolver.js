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
 * @file ProviderResolver.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import Web3EthereumProvider from '../providers/Web3EthereumProvider';

const global =
    (function() {
        return this || (typeof self === 'object' && self);
        // eslint-disable-next-line no-new-func
    })() || new Function('return this')();

export default class ProviderResolver {
    /**
     * @param {ProvidersModuleFactory} providersModuleFactory
     *
     * @constructor
     */
    constructor(providersModuleFactory) {
        this.providersModuleFactory = providersModuleFactory;
    }

    /**
     * Resolves the correct provider with his adapter
     *
     * @method resolve
     *
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Net} net
     *
     * @returns {AbstractSocketProvider|HttpProvider|CustomProvider}
     */
    resolve(provider, net) {
        if (!provider) {
            return provider;
        }

        if (typeof provider === 'string') {
            // HTTP
            if (/^http(s)?:\/\//i.test(provider)) {
                return this.providersModuleFactory.createHttpProvider(provider);
            }
            // WS
            if (/^ws(s)?:\/\//i.test(provider)) {
                return this.providersModuleFactory.createWebsocketProvider(provider);
            }

            // IPC
            if (provider && isObject(net) && isFunction(net.connect)) {
                return this.providersModuleFactory.createIpcProvider(provider, net);
            }
        }

        if (provider.sendPayload && provider.subscribe) {
            return provider;
        }

        if (provider instanceof Web3EthereumProvider) {
            return provider;
        }

        if (typeof global.mist !== 'undefined' && provider.constructor.name === 'EthereumProvider') {
            return this.providersModuleFactory.createMistEthereumProvider(provider);
        }

        if (provider.isEIP1193) {
            return this.providersModuleFactory.createWeb3EthereumProvider(provider);
        }

        if (this.isMetamaskInpageProvider(provider)) {
            return this.providersModuleFactory.createMetamaskProvider(provider);
        }

        return this.providersModuleFactory.createCustomProvider(provider);
    }

    /**
     * Checks if the given provider is the MetamaskInpageProvider
     *
     * @method isMetamaskInpageProvider
     *
     * @param {Object} provider
     *
     * @returns {Boolean}
     */
    isMetamaskInpageProvider(provider) {
        return provider.constructor.name === 'MetamaskInpageProvider';
    }
}
