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

import EventEmitter from 'eventemitter3';

/**
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
    constructor(type, method, options = null, utils, formatters, moduleInstance) {
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
     * @param {*} subscriptionItem
     *
     * @returns {*}
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
     * @returns {AbstractSubscription}
     */
    subscribe(callback = null) {
        this.callback = callback;

        this.beforeSubscription(this.moduleInstance);
        let subscriptionParameters = [];

        if (this.options !== null) {
            subscriptionParameters = [this.options];
        }

        this.moduleInstance.currentProvider
            .subscribe(this.type, this.method, subscriptionParameters)
            .then((subscriptionId) => {
                this.id = subscriptionId;

                // TODO: Improve listener handling for subscriptions
                this.moduleInstance.currentProvider.on('error', this.errorListener.bind(this));
                this.moduleInstance.currentProvider.on(this.id, this.subscriptionListener.bind(this));
            })
            .catch((error) => {
                if (this.callback) {
                    this.callback(error, null);

                    return;
                }

                this.emit('error', error);
                this.removeAllListeners();
            });

        return this;
    }

    /**
     * Listens to the provider errors
     *
     * @method errorListener
     *
     * @param {Error} error
     */
    errorListener(error) {
        if (this.callback) {
            this.callback(error, false);

            return;
        }

        this.emit('error', error);
    }

    /**
     * Listens to the subscription
     *
     * @method subscriptionListener
     *
     * @param {Object} response
     */
    subscriptionListener(response) {
        const formattedOutput = this.onNewSubscriptionItem(response.result);

        if (this.callback) {
            this.callback(false, formattedOutput);

            return;
        }

        this.emit('data', formattedOutput);
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
            .unsubscribe(this.id, this.type.slice(0, 3) + '_unsubscribe')
            .then((response) => {
                if (!response) {
                    const error = new Error('Error on unsubscribe!');
                    if (callback) {
                        callback(error, null);
                    }

                    throw error;
                }

                this.moduleInstance.currentProvider.removeListener('error', this.errorListener);
                this.moduleInstance.currentProvider.removeListener(this.id, this.subscriptionListener);

                this.id = null;
                this.removeAllListeners();

                if (callback) {
                    callback(false, true);
                }

                return true;
            });
    }
}
