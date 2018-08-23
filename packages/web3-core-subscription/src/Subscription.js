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
 * @param {Function} inputFormatter
 * @param {Function} outputFormatter
 * @param {String} type
 * @param {Array} parameters
 * @param {Function} callback
 * @constructor
 */
function Subscription(provider, inputFormatter, outputFormatter, type, parameters, callback) {
    this.provider = provider;
    this.inputFormatter = inputFormatter;
    this.outputFormatter = outputFormatter;
    this.subscriptionId = null;
    this.type = type;
    this.parameters = parameters;
    this.callback = callback;
}

/**
 * Sends the JSON-RPC request, emits the required events and executes the callback method.
 *
 * @returns {Object} Subscription
 */
Subscription.prototype.subscribe = function () {
    var self = this;
    this.provider.subscribe(this.type, this.formatInput(this.parameters)).then(function (subscriptionId) {
        self.subscriptionId = subscriptionId;
        self.provider.on(self.subscriptionId, function (error, response) {
            if (!error) {
                self.handleSubscriptionResponse(response, self.callback);

                return;
            }

            if(self.provider.once) {
                self.reconnect(type, parameters, subscriptionId, self.callback);
            }

            callback(error, null);
            self.emit('error', error);
        });
    });

    return this;
};

/**
 * Iterates over each item in the response, formats the output, emits required events and executes the callback method.
 * @param {any} response
 * @param {Function} callback
 */
Subscription.prototype.handleSubscriptionResponse = function (response, callback) {
    if (!_.isArray(response)) {
        response = [response];
    }

    response.forEach(function (item) {
        var formattedOutput = this.formatOutput(item);
        this.emit('data', formattedOutput);
        callback(false, formattedOutput);
    });
};

/**
 * Reconnects provider and restarts subscription
 *
 * @param {string} type
 * @param {*} parameters
 * @param {string} subscriptionId
 * @param {Function} callback
 */
Subscription.prototype.reconnect = function (type, parameters, subscriptionId, callback) {
    var self = this;

    var interval = setInterval(function () {
        if (self.provider.reconnect) {
            self.provider.reconnect();
        }
    }, 500);

    self.provider.once('connect', function () {
        clearInterval(interval);
        self.unsubscribe(function(error, result) {
            if (result) {
                self.subscribe(type, parameters, callback);
            }

            callback(error, null);
        });
    });
};

/**
 * Executes outputFormatter if defined
 *
 * @param output
 * @returns {*}
 */
Subscription.prototype.formatOutput = function (output) {
    if (_.isFunction(this.outputFormmater) && output) {
        return this.outputFormatter(output);
    }

    return output;
};

/**
 * Executes inputFormatter if defined
 *
 * @param input
 * @returns {*}
 */
Subscription.prototype.formatInput = function (input) {
    if (_.isFunction(this.inputFormatter) && input) {
        return this.inputFormatter(input);
    }

    return input;
};

/**
 * Unsubscribes subscription
 *
 * @param {Function} callback
 * @returns {Promise<boolean>}
 */
Subscription.prototype.unsubscribe = function (callback) {
    var self = this;
    return this.provider.unsubscribe(this.subscriptionId).then(function (response) {
        if (!response) {
            self.subscriptionId = null;
            callback(true, false);

            return true;
        }

        callback(false, true);

        return false;
    });
};

// Inherit from EventEmitter
Subscription.prototype = Object.create(EventEmitter.prototype);
Subscription.prototype.constructor = Subscription;
