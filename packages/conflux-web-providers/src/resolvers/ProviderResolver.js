/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

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

        if (typeof global.mist !== 'undefined' && provider.constructor.name === 'CfxProvider') {
            return this.providersModuleFactory.createMistConfluxProvider(provider);
        }

        if (provider.isEIP1193) {
            return this.providersModuleFactory.createConfluxWebCfxProvider(provider);
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
