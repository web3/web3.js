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

"use strict";

var _ = require('underscore');
var EventEmitter = require('eventemitter3');

/**
 * @param {AbstractSubscriptionModel} subscriptionModel
 * @param {AbstractWeb3Object} web3Package
 *
 * @constructor
 */
function Subscription(subscriptionModel, web3Package) {
    this.subscriptionModel = subscriptionModel;
    this.web3Package = web3Package;
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
Subscription.prototype.subscribe = function (callback) {
    var self = this;

    this.subscriptionModel.beforeSubscription(this, this.web3Package, callback);

    this.web3Package.currentProvider.subscribe(
        this.subscriptionModel.subscriptionType,
        this.subscriptionModel.subscriptionMethod,
        this.subscriptionModel.parameters
    ).then(function (subscriptionId) {
        self.subscriptionId = subscriptionId;

        self.web3Package.currentProvider.on(self.subscriptionId, function (error, response) {
            if (!error) {
                self.handleSubscriptionResponse(response, callback);

                return;
            }

            if (self.web3Package.currentProvider.once) {
                self.reconnect(callback);
            }

            if (_.isFunction(callback)) {
                callback(error, null);
            }
            self.emit('error', error);
        });
    });

    return this;
};

/**
 * Iterates over each item in the response, formats the output, emits required events and executes the callback method.
 *
 * @method handleSubscriptionResponse
 *
 * @param {any} response
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
Subscription.prototype.handleSubscriptionResponse = function (response, callback) {
    if (!_.isArray(response)) {
        response = [response];
    }

    response.forEach(function (item) {
        var formattedOutput = this.subscriptionModel.onNewSubscriptionItem(this, item);

        this.emit('data', formattedOutput);
        if (_.isFunction(callback)) {
            callback(false, formattedOutput);
        }
    });
};

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
Subscription.prototype.reconnect = function (callback) {
    var self = this;

    var interval = setInterval(function () {
        if (self.web3Package.currentProvider.reconnect) {
            self.web3Package.currentProvider.reconnect();
        }
    }, 500);

    this.web3Package.currentProvider.once('connect', function () {
        clearInterval(interval);
        self.unsubscribe().then(function () {
            self.subscribe(callback);
        }).catch(function (error) {
            callback(error, null);
        });
    });
};

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
Subscription.prototype.unsubscribe = function (callback) {
    var self = this;
    return this.web3Package.currentProvider.unsubscribe(
        this.subscriptionId,
        this.subscriptionModel.subscriptionType
    ).then(function (response) {
        if (!response) {
            self.subscriptionId = null;
            callback(true, false);

            return true;
        }

        if (_.isFunction(callback)) {
            callback(false, true);
        }

        return false;
    });
};

// Inherit from EventEmitter
Subscription.prototype = Object.create(EventEmitter.prototype);
Subscription.prototype.constructor = Subscription;
