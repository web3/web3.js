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

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;

/**
 * @param {AbstractProviderAdapter | EthereumProvider} provider
 * @param {Object} formatters
 * @param {Subscription} subscriptionPackage
 * @param {PromiEvent} promiEventPackage
 * @param {ProvidersPackage} providersPackage
 *
 * @constructor
 */
function SubscriptionsResolver(provider, formatters, subscriptionPackage, promiEventPackage, providersPackage) {
    AbstractWeb3Object.call(this, provider, providersPackage, null, null, subscriptionPackage);
    this.formatters = formatters;
    this.promiEventPackage = promiEventPackage;
}

/**
 * Resolves the requested subscription
 *
 * @method resolve
 *
 * @param {String} type
 * @param {Array} parameters
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise | Subscription}
 */
SubscriptionsResolver.prototype.resolve = function (type, parameters, callback) {
    switch (type) {
        case 'newBlockHeaders':
            return this.getSubscription('newHeads', null, null, this.formatters.outputBlockFormatter, callback);
            break;
        case 'pendingTransactions':
            return this.getSubscription('newPendingTransactions', null, null, null, callback);
            break;
        case 'logs':
            return this.getLogsSubscription(parameters, callback);
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
 * @method getSubscription
 *
 * @param {String} type
 * @param {Array} parameters
 * @param {Function} inputFormatter
 * @param {Function} outputFormatter
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Subscription}
 */
SubscriptionsResolver.prototype.getSubscription = function (type, parameters, inputFormatter, outputFormatter, callback) {
    if (!parameters) {
        parameters = [];
    }

    return this.subscriptionPackage.createSubscription(
        this.currentProvider,
        type,
        parameters,
        inputFormatter,
        outputFormatter,
        'eth'
    ).subscribe(callback);
};

/**
 * Determines if fromBlock is set and returns the expected subscription.
 *
 * @method getLogsSubscription
 *
 * @param {Array} parameters
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise}
 */
SubscriptionsResolver.prototype.getLogsSubscription = function (parameters, callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();

    if (this.hasFromBlockProperty(parameters[1])) {
        this.handleLogsSubscriptionWithFromBlock(parameters, promiEvent, callback);

        return promiEvent;
    }

    this.subscribeToLogs(parameters, promiEvent, callback);

    return promiEvent;
};

/**
 * Subscribes to logs and emits promiEvent events
 *
 * @method subscribeToLogs
 *
 * @param {Array} parameters
 * @param {PromiEvent} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
SubscriptionsResolver.prototype.subscribeToLogs = function (parameters, promiEvent, callback) {
    this.getSubscription(
        'logs',
        parameters,
        null,
        this.formatters.outputLogFormatter,
        function (error, logs) {
            if (error) {
                callback(error, null);
                promiEvent.eventEmitter.emit('error', error);

                return;
            }

            logs.forEach(function (log) {
                callback(false, log);
                promiEvent.eventEmitter.emit('data', log);
            });
        }
    );
};

/**
 * Sends the JSON-RPC request eth_getLogs to get the past logs and after that it subscribes to the comming logs.
 *
 * @method handleLogsSubscriptionWithFromBlock
 *
 * @param {Array} parameters
 * @param {PromiEvent} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error,result)
 */
SubscriptionsResolver.prototype.handleLogsSubscriptionWithFromBlock = function (parameters, promiEvent, callback) {
    var self = this;
    this.currentProvider.send('eth_getLogs', parameters).then(function (logs) {
        logs.forEach(function (log) {
            var output = self.formatters.outputLogFormatter(log);
            callback(false, output);
            promiEvent.eventEmitter.emit('data', output);
        });

        delete parameters[1].fromBlock;

        self.subscribeToLogs(parameters, outputFormatter, promiEvent, callback);

    }).catch(function (error) {
        promiEvent.eventEmitter.emit('error', error);
        callback(error, null);
    });
};

/**
 * Checks if node is syncing and returns PromiEvent
 *
 * @method getSyncingSubscription
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise}
 */
SubscriptionsResolver.prototype.getSyncingSubscription = function (callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();

    this.getSubscription(
        'syncing',
        null,
        null,
        this.formatters.outputSyncingFormatter,
        function (error, output) {
            var self = this;

            if (error) {
                promiEvent.eventEmitter.emit('error', error);
                callback(error, null, this);

                return;
            }

            // fire TRUE at start
            if (this.isSyncing !== true) {
                this.isSyncing = true;
                promiEvent.eventEmitter.emit('changed', this.isSyncing);

                if (_.isFunction(callback)) {
                    callback(null, this.isSyncing, this);
                }

                setTimeout(function () {
                    promiEvent.eventEmitter.emit('data', output);

                    if (_.isFunction(self.callback)) {
                        callback(null, output, self);
                    }
                }, 0);

                return;
            }

            // fire sync status
            promiEvent.eventEmitter.emit('data', output);
            if (_.isFunction(callback)) {
                callback(null, output, this);
            }

            // wait for some time before fireing the FALSE
            clearTimeout(this.isSyncingTimeout);
            this.isSyncingTimeout = setTimeout(function () {
                if (output.currentBlock > output.highestBlock - 200) {
                    self.isSyncing = false;
                    promiEvent.eventEmitter.emit('changed', self.isSyncing);

                    if (_.isFunction(callback)) {
                        callback(null, self.isSyncing, self);
                    }
                }
            }, 500);
        }
    );

    return promiEvent;
};

/**
 * Checks if fromBlock property is set in parameter object
 *
 * @method hasFromBlockProperty
 *
 * @param {Object} parameter
 *
 * @returns {boolean}
 */
SubscriptionsResolver.prototype.hasFromBlockProperty = function (parameter) {
    return _.isObject(parameter) && parameter.hasOwnProperty('fromBlock') && _.isNumber(parameter.fromBlock);
};

SubscriptionsResolver.prototype = Object.create(AbstractWeb3Object);
SubscriptionsResolver.prototype.constructor = SubscriptionsResolver;

module.exports = SubscriptionsResolver;
