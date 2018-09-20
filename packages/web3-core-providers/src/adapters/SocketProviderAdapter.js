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
 * @file SocketProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractProviderAdapter = require('../../lib/adapters/AbstractProviderAdapter');

/**
 * @param {Object} provider
 *
 * @constructor
 */
function SocketProviderAdapter(provider) {
    AbstractProviderAdapter.call(this, provider);
    this.subscriptions = [];
    this.registerSubscriptionListener();
}

/**
 * Subscribes to a given subscriptionType
 *
 * @method subscribe
 *
 * @param {String} subscriptionMethod
 * @param {Array} parameters
 * @param {String} subscriptionType
 *
 * @returns {Promise<String|Error>}
 */
SocketProviderAdapter.prototype.subscribe = function (subscriptionType, subscriptionMethod, parameters) {
    var self = this;

    return this.send(subscriptionType + '_subscribe', parameters.unshift(subscriptionMethod)).then(function (error, subscriptionId) {
        if (!error) {
            self.subscriptions.push(subscriptionId);

            return subscriptionId;
        }

        throw new Error('Provider error: ' + error);
    });
};

/**
 * Unsubscribes the subscription by his id
 *
 * @method unsubscribe
 *
 * @param {String} subscriptionId
 * @param {String} subscriptionType
 *
 * @returns {Promise<Boolean|Error>}
 */
SocketProviderAdapter.prototype.unsubscribe = function (subscriptionId, subscriptionType) {
    return this.send(subscriptionType + '_unsubscribe', [subscriptionId]).then(function (result) {
        if (result) {
            this.subscriptions = this.subscriptions.filter(function (subscription) {
                return subscription !== subscriptionId;
            });

            return true;
        }

        return false;
    });
};

/**
 * Emits an event with the subscription id
 *
 * @method registerSubscriptionListener
 */
SocketProviderAdapter.prototype.registerSubscriptionListener = function () {
    var self = this;
    this.provider.on('data', function (response, deprecatedResponse) {
        // this is for possible old providers, which may had the error first handler
        response = response || deprecatedResponse;

        // check for result.method, to prevent old providers errors to pass as result
        if (response.method && self.hasSubscription(response.params.subscription)) {
            self.emit(response.params.subscription, response.params.result);
        }
    });
};

/**
 * Checks if the given subscription id exists
 *
 * @method hasSubscription
 *
 * @param {String} subscriptionId
 *
 * @returns {Boolean}
 */
SocketProviderAdapter.prototype.hasSubscription = function (subscriptionId) {
    return this.subscriptions.indexOf(subscriptionId) > -1;
};

/**
 * Clears all subscriptions and listeners
 *
 * @method clearSubscriptions
 */
SocketProviderAdapter.prototype.clearSubscriptions = function () {
    var self = this;
    var unsubscribePromises = [];

    this.subscriptions.forEach(function (subscriptionId) {
        unsubscribePromises.push(self.unsubscribe(subscriptionId));
    });

    Promise.all(unsubscribePromises).then(function () {
        this.provider.reset();
        self.subscriptions = [];
    });
};

/**
 * Removes subscription from subscriptions list and unsubscribes it.
 *
 * @method removeSubscription
 *
 * @param {String} subscriptionId
 *
 * @returns {Promise<Boolean>}
 */
SocketProviderAdapter.prototype.removeSubscription = function (subscriptionId) {
    var self = this;
    return this.unsubscribe(subscriptionId).then(function (result) {
        if (result) {
            delete self.subscriptions[this.subscriptions.indexOf(subscriptionId)];

            return true;
        }

        return false;
    });
};

/**
 * Checks if the provider is connected
 *
 * @method isConnected
 *
 * @returns {Boolean}
 */
SocketProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};

SocketProviderAdapter.prototype = Object.create(AbstractProviderAdapter.prototype);
SocketProviderAdapter.prototype.constructor = SocketProviderAdapter;

module.exports = SocketProviderAdapter;
