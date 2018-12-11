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
 * @file ProviderAdapterResolver.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'underscore-es/isObject';
import isFunction from 'underscore-es/isFunction';

export default class ProviderAdapterResolver {
    /**
     * @param {ProvidersModuleFactory} providersPackageFactory
     *
     * @constructor
     */
    constructor(providersPackageFactory) {
        this.providersPackageFactory = providersPackageFactory;
    }

    /**
     * Resolves the correct provider with his adapter
     *
     * @method resolve
     *
     * @param {AbstractProviderAdapter|EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {Net} net
     *
     * @returns {AbstractProviderAdapter|Error}
     */
    resolve(provider, net) {
        if (typeof provider === 'string') {
            // HTTP
            if (/^http(s)?:\/\//i.test(provider)) {
                return this.providersPackageFactory.createHttpProviderAdapter(
                    this.providersPackageFactory.createHttpProvider(provider)
                );
            }
            // WS
            if (/^ws(s)?:\/\//i.test(provider)) {
                return this.providersPackageFactory.createSocketProviderAdapter(
                    this.providersPackageFactory.createWebsocketProvider(provider)
                );
            }

            // IPC
            if (provider && isObject(net) && isFunction(net.connect)) {
                return this.providersPackageFactory.createSocketProviderAdapter(
                    this.providersPackageFactory.createIpcProvider(provider, net)
                );
            }
        }

        if (isFunction(provider.sendAsync)) {
            return this.providersPackageFactory.createInpageProviderAdapter(provider);
        }

        switch (provider.constructor.name) {
            case 'HttpProvider':
                return this.providersPackageFactory.createHttpProviderAdapter(provider);
            case 'EthereumProvider':
            case 'WebsocketProvider':
            case 'IpcProvider':
                return this.providersPackageFactory.createSocketProviderAdapter(provider);
            case 'HttpProviderAdapter':
            case 'SocketProviderAdapter':
            case 'InpageProviderAdapter':
                return provider;
        }

        throw new Error('Please provide an valid Web3 provider or the EthereumProvider');
    }
}
