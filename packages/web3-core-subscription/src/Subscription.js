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
 * @param {Object} provider
 * @param {String} method
 * @param {Array} parameters
 * @param {Array} inputFormatters
 * @param {Function} outputFormatter
 * @param {String} subscriptionType
 *
 * @constructor
 */
function Subscription(provider, method, parameters, inputFormatters, outputFormatter, subscriptionType) {
    this.provider = provider;
    this.method = method;
    this.parameters = parameters;
    this.inputFormatters = inputFormatters;
    this.outputFormatter = outputFormatter;
    this.subscriptionId = null;
    this.subscriptionType = subscriptionType || 'eth';
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

    this.provider.subscribe(
        this.subscriptionType,
        this.method, this.getFormattedInput()
    ).then(function (subscriptionId) {
        self.subscriptionId = subscriptionId;

        self.provider.on(self.subscriptionId, function (error, response) {
            if (!error) {
                self.handleSubscriptionResponse(response, callback);

                return;
            }

            if (self.provider.once) {
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
        var formattedOutput = this.formatOutput(item);
        this.emit('data', formattedOutput);
        if (_.isFunction(callback)) {
            callback(false, formattedOutput);
        }
    });
};

/**
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
        if (self.provider.reconnect) {
            self.provider.reconnect();
        }
    }, 500);

    self.provider.once('connect', function () {
        clearInterval(interval);
        self.unsubscribe(function (error, result) {
            if (result) {
                self.subscribe(callback);
            }

            if (_.isFunction(callback)) {
                callback(error, null);
            }
        });
    });
};

/**
 * Executes outputFormatter if defined
 *
 * @method formatOutput
 *
 * @param {any} output
 *
 * @returns {any}
 * @callback callback callback(error, result)
 */
Subscription.prototype.formatOutput = function (output) {
    if (_.isFunction(this.outputFormatter) && output) {
        return this.outputFormatter(output);
    }

    return output;
};

/**
 * Executes inputFormatters if defined
 *
 * @method formatInput
 *
 * @returns {any[]}
 */
Subscription.prototype.getFormattedInput = function () {
    var self = this;

    if (_.isArray(this.inputFormatters)) {
        return this.inputFormatters.map(function (formatter, index) {
            if (_.isFunction(formatter)) {
                return formatter(self.parameters[index]);
            }

            return self.parameters[index];
        });
    }

    return parameters;
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
    return this.provider.unsubscribe(this.subscriptionId, this.subscriptionType).then(function (response) {
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
