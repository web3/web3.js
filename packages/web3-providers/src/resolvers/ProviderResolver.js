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
 * @file ProviderResolverTest.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import HttpProvider from '../providers/HttpProvider';
import WebsocketProvider from '../providers/WebsocketProvider';
import IpcProvider from '../providers/IpcProvider';

/* eslint-disable no-new-func */
let global;
try {
    global = new Function('return this')();
} catch (error) {
    global = window;
}
/* eslint-enable */

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
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {Net} net
     *
     * @returns {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|Error}
     */
    resolve(provider, net) {
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

        if (typeof global.mist !== 'undefined' && provider.constructor.name === 'EthereumProvider') {
            return this.providersModuleFactory.createMistEthereumProvider(provider);
        }

        switch (provider.constructor.name) {
            case 'EthereumProvider':
                return this.providersModuleFactory.createEthereumProvider(provider);
            case 'MetamaskInpageProvider':
                return this.providersModuleFactory.createMetamaskInpageProvider(provider);
            case 'HttpProvider':
            case 'WebsocketProvider':
            case 'IpcProvider':
                return provider;
        }

        if (
            provider instanceof HttpProvider ||
            provider instanceof WebsocketProvider ||
            provider instanceof IpcProvider
        ) {
            return provider;
        }

        throw new Error('Please provide an valid Web3 provider');
    }
}
