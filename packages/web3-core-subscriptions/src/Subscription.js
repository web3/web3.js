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
 * @file Subscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import _ from 'underscore';
import EventEmitter from 'eventemitter3';

export default class Subscription extends EventEmitter {

    /**
     * @param {AbstractSubscriptionModel} subscriptionModel
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(subscriptionModel, moduleInstance) {
        super();
        this.subscriptionModel = subscriptionModel;
        this.moduleInstance = moduleInstance;
        this.subscriptionId = null;
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
        this.subscriptionModel.beforeSubscription(this, this.moduleInstance, callback);

        this.moduleInstance.currentProvider.subscribe(
            this.subscriptionModel.subscriptionType,
            this.subscriptionModel.subscriptionMethod,
            [this.subscriptionModel.options]
        ).then(subscriptionId => {
            this.subscriptionId = subscriptionId;

            this.moduleInstance.currentProvider.on(this.subscriptionId, (error, response) => {
                if (!error) {
                    this.handleSubscriptionResponse(response, callback);

                    return;
                }

                if (self.moduleInstance.currentProvider.once) {
                    this.reconnect(callback);
                }

                if (_.isFunction(callback)) {
                    callback(error, null);
                }

                this.emit('error', error);
            });
        });

        return this;
    }

    /**
     * Iterates over each item in the response, formats the output, emits required events and executes the callback method.
     *
     * @method handleSubscriptionResponse
     *
     * @param {*} response
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    handleSubscriptionResponse(response, callback) {
        if (!_.isArray(response)) {
            response = [response];
        }

        response.forEach(function (item) {
            const formattedOutput = this.subscriptionModel.onNewSubscriptionItem(this, item);

            this.emit('data', formattedOutput);

            if (_.isFunction(callback)) {
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
        }, 500);

        this.moduleInstance.currentProvider.once('connect', () => {
            clearInterval(interval);
            this.unsubscribe().then(() => {
                this.subscribe(callback);
            }).catch(error => {
                this.emit('error', error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
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
     * @returns {Promise<boolean>}
     */
    unsubscribe(callback) {
        return this.moduleInstance.currentProvider.unsubscribe(
            this.subscriptionId,
            this.subscriptionModel.subscriptionType
        ).then(response => {
            this.removeAllListeners('data');
            this.removeAllListeners('error');

            if (!response) {
                this.subscriptionId = null;

                if (_.isFunction(callback)) {
                    callback(true, false);
                }

                return true;
            }

            if (_.isFunction(callback)) {
                callback(false, true);
            }

            return false;
        });
    }
}
