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

function SocketProviderAdapter(provider) {
    AbstractProviderAdapter.call(provider);
    this.subscriptions = [];
    this.registerSubscriptionListener();
}

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise<string|Error>}
 */
SocketProviderAdapter.prototype.subscribe = function (subscriptionType, parameters) {
    var self = this;

    return this.send('eth_subscribe', parameters.unshift(subscriptionType)).then(function (error, subscriptionId) {
        if (!error) {
            self.subscriptions[subscriptionId]({subscriptionType: subscriptionType, type: 'eth'});

            return subscriptionId;
        }

        throw new Error('Provider error: ' + error);
    });
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
SocketProviderAdapter.prototype.unsubscribe = function (subscriptionId) {
    return this.send('eth_unsubscribe', [subscriptionId]).then(function (result) {
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
 */
SocketProviderAdapter.prototype.registerSubscriptionListener = function () {
    var self = this;
    this.provider.on('data', function (response, deprecatedResponse) {
        response = response || deprecatedResponse; // this is for possible old providers, which may had the error first handler

        // check for result.method, to prevent old providers errors to pass as result
        if (response.method && self.subscriptions[response.params.subscription]) {
            self.emit(response.params.subscription, response.params.result);
        }
    });
};

/**
 * Clears all subscriptions and listeners
 */
SocketProviderAdapter.prototype.clearSubscriptions = function () {
    var self = this;
    var unsubscribePromises = [];

    Object.keys(this.subscriptions).forEach(function (subscriptionId) {
        unsubscribePromises.push(self.unsubscribe(subscriptionId));
    });

    Promise.all(unsubscribePromises).then(function () {
        this.provider.reset();
        self.subscriptions = [];
    });
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<boolean>}
 */
SocketProviderAdapter.prototype.removeSubscription = function (subscriptionId) {
    var self = this;
    return this.subscriptions[subscriptionId].unsubscribe().then(function(result) {
        if (result) {
            delete self.subscriptions[subscriptionId];

            return true;
        }

        return false;
    });
};

/**
 * @returns {boolean}
 */
SocketProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};

SocketProviderAdapter.prototype = Object.create(AbstractProviderAdapter.prototype);

module.exports = SocketProviderAdapter;
