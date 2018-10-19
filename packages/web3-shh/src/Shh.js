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
 * @file Shh.js
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import {AbstractWeb3Module} from 'web3-core';

export default class Shh extends AbstractWeb3Module {

    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProviderDetector} providerDetector
     * @param {ProviderAdapterResolver} providerAdapterResolver
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {MethodModelFactory} methodModelFactory
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {Network} net
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
        methodModelFactory,
        subscriptionsFactory,
        net
    ) {
        super(
            provider,
            providerDetector,
            providerAdapterResolver,
            providersModuleFactory,
            providers,
            methodController,
            methodModelFactory
        );

        this.subscriptionsFactory = subscriptionsFactory;
        this.net = net;
    }

    /**
     * Subscribe to whisper streams
     *
     * @method subscribe
     *
     * @param {string} method
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription}
     */
    subscribe(method, options, callback) {
        if (method === 'messages') {
            return this.subscriptionsFactory.createShhMessagesSubscription(this, options).subscribe(callback);
        }

        throw Error(`Unknown subscription: ${method}`);
    }

    /**
     * Extends setProvider method from AbstractWeb3Module.
     * This is required for updating the provider also in the sub package Net.
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(
            super.setProvider(provider, net) &&
            this.net.setProvider(provider, net)
        );
    }
}
