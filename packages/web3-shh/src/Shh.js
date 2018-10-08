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

"use strict";

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {MethodModelFactory} methodModelFactory
 * @param {SubscriptionsFactory} subscriptionsFactory
 * @param {Network} net
 *
 * @constructor
 */
function Shh(provider, providersPackage, methodController, methodModelFactory, subscriptionsFactory, net) {
    AbstractWeb3Object.call(
        this,
        provider,
        providersPackage,
        methodController,
        methodModelFactory
    );
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
Shh.prototype.subscribe = function (method, options, callback) {
    if (method === 'messages') {
        return this.subscriptionsFactory.createShhMessagesSubscription(this, options).subscribe(callback);
    }

    throw Error('Unknown subscription: ' + method);
};

/**
 * Extends setProvider method from AbstractWeb3Object.
 * This is required for updating the provider also in the sub package Net.
 *
 * @param {Object|String} provider
 * @param {Net} net
 */
Shh.prototype.setProvider = function (provider, net) {
    AbstractWeb3Object.setProvider.call(provider, net);
    this.net.setProvider(provider, net);
};

Shh.prototype = Object.create(AbstractWeb3Object.prototype);
Shh.prototype.constructor = Shh;

module.exports = Shh;
