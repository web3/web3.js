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
 * @param {MethodModelFactory} methodModelFactory
 * @param {MethodController} methodController
 *
 * @constructor
 */
function SubscriptionsResolver(
    provider,
    formatters,
    subscriptionPackage,
    promiEventPackage,
    providersPackage,
    methodModelFactory,
    methodController
) {
    AbstractWeb3Object.call(this, provider, providersPackage, methodController, methodModelFactory, subscriptionPackage);
    this.formatters = formatters;
    this.promiEventPackage = promiEventPackage;
}

/**
 * Resolves the requested subscription
 *
 * @method resolve
 *
 * @param {String} type
 * @param {Object} parameter
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise | Subscription}
 */
SubscriptionsResolver.prototype.resolve = function (type, parameter, callback) {
    switch (type) {
        case 'newBlockHeaders':
            return this.getSubscription('newHeads', null, null, this.formatters.outputBlockFormatter, callback);
        case 'pendingTransactions':
            return this.getSubscription('newPendingTransactions', null, null, null, callback);
        case 'logs':
            return this.getLogsSubscription(parameter, callback);
        case 'syncing':
            return this.getSyncingSubscription(callback);
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
 * @param {Object} parameter
 * @param {Function} inputFormatter
 * @param {Function} outputFormatter
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Subscription}
 */
SubscriptionsResolver.prototype.getSubscription = function (type, parameter, inputFormatter, outputFormatter, callback) {
    return this.subscriptionPackage.createSubscription(
        this.currentProvider,
        type,
        [parameter],
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
 * @param {Object} parameter
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise}
 */
SubscriptionsResolver.prototype.getLogsSubscription = function (parameter, callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();

    if (this.hasFromBlockProperty(parameter)) {
        this.handleLogsSubscriptionWithFromBlock(parameter, promiEvent, callback);

        return promiEvent;
    }

    this.subscribeToLogs(parameter, promiEvent, callback);

    return promiEvent;
};

/**
 * Subscribes to logs and emits promiEvent events
 *
 * @method subscribeToLogs
 *
 * @param {Object} parameter
 * @param {PromiEvent} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 */
SubscriptionsResolver.prototype.subscribeToLogs = function (parameter, promiEvent, callback) {
    this.getSubscription(
        'logs',
        parameter,
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
 * @param {Object} parameter
 * @param {PromiEvent} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error,result)
 */
SubscriptionsResolver.prototype.handleLogsSubscriptionWithFromBlock = function (parameter, promiEvent, callback) {
    var self = this;
    this.getPastLogs(parameter).then(function (logs) {
        logs.forEach(function (log) {
            callback(false, log);
            promiEvent.eventEmitter.emit('data', log);
        });

        delete parameter.fromBlock;

        self.subscribeToLogs(parameter, promiEvent, callback);

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
