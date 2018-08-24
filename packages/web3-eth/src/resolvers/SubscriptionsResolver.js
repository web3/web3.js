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
 * @file SubscriptionsResolver.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Subscription = require('web3-core-subscription');
var formatters = require('web3-core-helpers').formatters;

/**
 * @param {Object} provider
 * @constructor
 */
function SubscriptionsResolver(provider) {
    this.provider = provider;
}

/**
 * Resolves the requested subscription
 *
 * @param {string} type
 * @param {any} parameters
 * @param {Function} callback
 * @returns {Object}
 */
SubscriptionsResolver.prototype.resolve = function (type, parameters, callback) {
    switch (type) {
        case 'newBlockHeaders':
            return this.getSubscription('newHeads', null, null, formatters.outputBlockFormatter, callback);
            break;
        case 'pendingTransactions':
            return this.getSubscription('newPendingTransactions', null, null, null, callback);
            break;
        case 'logs':
            // TODO: need clarifaction if we really
            break;
        case 'syncing':
            return this.getSyncingSubscription(callback);
            break;
        default:
            throw Error('Unknown subscription: ' + type);
    }
};

/**
 * Create Subscription object
 *
 * @param {string} type
 * @param {any} parameters
 * @param {Function} inputFormatter
 * @param {Function} outputFormatter
 * @param {Function} callback
 * @returns {Subscription}
 */
SubscriptionsResolver.prototype.getSubscription = function (type, parameters, inputFormatter, outputFormatter, callback) {
    if (!parameters) {
        parameters = [];
    }

    return new Subscription(
        this.provider,
        type,
        parameters,
        inputFormatter,
        outputFormatter
    ).subscribe(callback);
};

/**
 * @param parameters
 */
SubscriptionsResolver.prototype.getLogsSubscription = function (parameters) {
    // implementation on hold
};

/**
 * @param {Function} callback
 */
SubscriptionsResolver.prototype.getSyncingSubscription = function (callback) {
    var subscription = new Subscription(
        this.provider,
        'syncing',
        null,
        formatters.outputSyncingFormatter
    );

    subscription.subscribe().on('data', function (output) {
        var self = this;

        // fire TRUE at start
        if (this.isSyncing !== true) {
            this.isSyncing = true;
            subscription.emit('changed', this.isSyncing);

            if (_.isFunction(callback)) {
                callback(null, this.isSyncing, this);
            }

            setTimeout(function () {
                subscription.emit('data', output);

                if (_.isFunction(self.callback)) {
                    callback(null, output, self);
                }
            }, 0);

            // fire sync status
        } else {
            subscription.emit('data', output);
            if (_.isFunction(callback)) {
                callback(null, output, this);
            }

            // wait for some time before fireing the FALSE
            clearTimeout(this.isSyncingTimeout);
            this.isSyncingTimeout = setTimeout(function () {
                if (output.currentBlock > output.highestBlock - 200) {
                    self.isSyncing = false;
                    subscription.emit('changed', self.isSyncing);

                    if (_.isFunction(callback)) {
                        callback(null, self.isSyncing, self);
                    }
                }
            }, 500);
        }
    });

    return subscription;
};

/**
 * Sets the provider
 *
 * @param {Object} provider
 */
SubscriptionsResolver.prototype.setProvider = function (provider) {
    this.provider = provider;
};

module.exports = SubscriptionsResolver;
