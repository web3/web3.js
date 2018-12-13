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
     * @param {String} subscribeMethod
     * @param {String} subscriptionMethod
     * @param {Array} parameters
     *
     * @returns {Promise<String|Error>}
     */
    subscribe(subscribeMethod, subscriptionMethod, parameters) {
        parameters.unshift(subscriptionMethod);

        return this.send(subscribeMethod, parameters)
            .then(subscriptionId => {
                this.subscriptions.push(subscriptionId);

                return subscriptionId;
            }).catch(error => {
                throw new Error(`Provider error: ${error}`);
            });
    }

    /**
     * Unsubscribes the subscription by his id
     *
     * @method unsubscribe
     *
     * @param {String} subscriptionId
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    async unsubscribe(subscriptionId, unsubscribeMethod = 'eth_unsubscribe') {
        const result = await this.send(unsubscribeMethod, [subscriptionId]);

        if (result) {
            this.subscriptions = this.subscriptions.filter(subscription => {
                return subscription !== subscriptionId;
            });

            return true;
        }

        return false;
    }

    /**
     * Emits an event with the subscription id
     *
     * @method registerSubscriptionListener
     */
    registerSubscriptionListener() {
        this.provider.on('data', response => {
            this.emit(response.params.subscription, response.params.result);
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
     *
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions(unsubscribeMethod) {
        const unsubscribePromises = [];
        this.subscriptions.forEach(subscriptionId => {
            unsubscribePromises.push(this.unsubscribe(subscriptionId, unsubscribeMethod));
        });

        return Promise.all(unsubscribePromises).then(results => {
            if (results.includes(false)) {
                throw Error(`Could not unsubscribe all subscriptions: ${JSON.stringify(results)}`);
            }

            if (this.provider.reset) {
                this.provider.reset();
            }

            this.subscriptions = [];

            return true;
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
     * @returns {Promise<Boolean|Error>}
     */
    removeSubscription(subscriptionId, subscriptionType) {
        return this.unsubscribe(subscriptionId, subscriptionType).then((result) => {
            if (result) {
                delete this.subscriptions[this.subscriptions.indexOf(subscriptionId)];

                return true;
            }

            throw Error('Could not unsubscribe. Don\'t forget to call this method twice if you have whisper subscriptions.');
        });
    }
}
