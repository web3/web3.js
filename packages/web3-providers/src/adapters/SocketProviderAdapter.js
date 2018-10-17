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

import AbstractProviderAdapter from '../../lib/adapters/AbstractProviderAdapter';

export default class SocketProviderAdapter extends AbstractProviderAdapter {

    /**
     * @param {Object} provider
     *
     * @constructor
     */
    constructor(provider) {
        super(provider);
        this.host = provider.path;
        this.subscriptions = [];
        this.registerSubscriptionListener();
    }

    /**
     * Subscribes to a given subscriptionType
     *
     * @method subscribe
     *
     * @param {String} subscriptionMethod
     * @param {String} subscriptionType
     * @param {Array} parameters
     *
     * @returns {Promise<String|Error>}
     */
    subscribe(subscriptionType, subscriptionMethod, parameters) {
        return this.send(subscriptionType, parameters.unshift(subscriptionMethod)).then((error, subscriptionId) => {
            if (!error) {
                this.subscriptions.push(subscriptionId);

                return subscriptionId;
            }

            throw new Error(`Provider error: ${error}`);
        });
    }

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
    unsubscribe(subscriptionId, subscriptionType) {
        return this.send(subscriptionType, [subscriptionId]).then(function (result) {
            if (result) {
                this.subscriptions = this.subscriptions.filter(subscription => {
                    return subscription !== subscriptionId;
                });

                return true;
            }

            return false;
        });
    }

    /**
     * Emits an event with the subscription id
     *
     * @method registerSubscriptionListener
     */
    registerSubscriptionListener() {
        this.provider.on('data', (response, deprecatedResponse) => {
            // this is for possible old providers, which may had the error first handler
            response = response || deprecatedResponse;

            // check for result.method, to prevent old providers errors to pass as result
            if (response.method && this.hasSubscription(response.params.subscription)) {
                this.emit(response.params.subscription, response.params.result);
            }
        });
    }

    /**
     * Checks if the given subscription id exists
     *
     * @method hasSubscription
     *
     * @param {String} subscriptionId
     *
     * @returns {Boolean}
     */
    hasSubscription(subscriptionId) {
        return this.subscriptions.indexOf(subscriptionId) > -1;
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     */
    clearSubscriptions() {
        const unsubscribePromises = [];

        this.subscriptions.forEach(subscriptionId => {
            unsubscribePromises.push(this.unsubscribe(subscriptionId));
        });

        Promise.all(unsubscribePromises).then(() => {
            this.provider.reset();
            this.subscriptions = [];
        });
    }

    /**
     * Removes subscription from subscriptions list and unsubscribes it.
     *
     * @method removeSubscription
     *
     * @param {String} subscriptionId
     * @param {String} subscriptionType
     *
     * @returns {Promise<Boolean>}
     */
    removeSubscription(subscriptionId, subscriptionType) {
        return this.unsubscribe(subscriptionId, subscriptionType).then((result) => {
            if (result) {
                delete this.subscriptions[this.subscriptions.indexOf(subscriptionId)];

                return true;
            }

            return false;
        });
    }
}
