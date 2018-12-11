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
 * @file AbstractSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isArray from 'underscore-es/isArray';
import isFunction from 'underscore-es/isFunction';
import EventEmitter from 'eventemitter3';

/*
 * TODO: Implement it with https://github.com/tc39/proposal-observable/blob/master/src/Observable.js
 */
export default class AbstractSubscription extends EventEmitter {
    /**
     * @param {String} type
     * @param {String} method
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(type, method, options, utils, formatters, moduleInstance) {
        super();
        this.type = type;
        this.method = method;
        this.options = options;
        this.utils = utils;
        this.formatters = formatters;
        this.moduleInstance = moduleInstance;
        this.id = null;
    }

    /**
     * This method will be executed before the subscription starts.
     *
     * @method beforeSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     */
    beforeSubscription(moduleInstance) {}

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {any} subscriptionItem
     *
     * @returns {any}
     */
    onNewSubscriptionItem(subscriptionItem) {
        return subscriptionItem;
    }

    /**
     * Sends the JSON-RPC request, emits the required events and executes the callback method.
     *
     * @method subscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription} Subscription
     */
    subscribe(callback) {
        this.beforeSubscription(this.moduleInstance);

        this.moduleInstance.currentProvider
            .subscribe(this.type, this.method, [this.options])
            .then(subscriptionId => {
                this.id = subscriptionId;

                this.moduleInstance.currentProvider.on(
                    this.id,
                    (error, response) => {
                        if (!error) {
                            this.handleSubscriptionResponse(response, callback);

                            return;
                        }

                        if (isFunction(callback)) {
                            callback(error, null);
                        }

                        this.emit('error', error);

                        if (this.moduleInstance.currentProvider.once) {
                            this.reconnect(callback);
                        }
                    }
                );
            });

        return this;
    }

    /**
     * Iterates over each item in the response, formats the output, emits required events and
     * executes the callback method.
     *
     * @method handleSubscriptionResponse
     *
     * @param {*} response
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    handleSubscriptionResponse(response, callback) {
        if (!isArray(response)) {
            response = [response];
        }

        response.forEach((item) => {
            const formattedOutput = this.onNewSubscriptionItem(item);

            this.emit('data', formattedOutput);

            if (isFunction(callback)) {
                callback(false, formattedOutput);
            }
        });
    }

    /**
     * TODO: The reconnecting handling should only be in the provider the subscription should not care about it.
     * Reconnects provider and restarts subscription
     *
     * @method reconnect
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    reconnect(callback) {
        const interval = setInterval(() => {
            if (this.moduleInstance.currentProvider.reconnect) {
                this.moduleInstance.currentProvider.reconnect();
            }
        }, 1000);

        this.moduleInstance.currentProvider.once('connect', () => {
            clearInterval(interval);
            this.unsubscribe(callback)
                .then(() => {
                    this.subscribe(callback);
                })
                .catch((error) => {
                    this.emit('error', error);
                });
        });
    }

    /**
     * Unsubscribes subscription
     *
     * @method unsubscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Boolean|Error>}
     */
    unsubscribe(callback) {
        return this.moduleInstance.currentProvider
            .unsubscribe(this.id, this.type)
            .then(response => {
                this.removeAllListeners('data');
                this.removeAllListeners('error');

                if (!response) {
                    this.id = null;

                    const error = new Error('Error on unsubscribe!');
                    if (isFunction(callback)) {
                        callback(error, null);
                    }

                    throw error;
                }

                if (isFunction(callback)) {
                    callback(false, true);
                }

                return true;
            });
    }
}
