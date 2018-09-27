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
 * @file EventSubscriptionsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ABIModel} abiModel
 * @param {SubscriptionPackage} subscriptionPackage
 * @param {EventOptionsMapper} eventOptionsMapper
 * @param {EventLogDecoder} eventLogDecoder
 *
 * @constructor
 */
function EventSubscriptionsProxy(abiModel, subscriptionPackage, eventOptionsMapper, eventLogDecoder) {
    this.subscriptionPackage = subscriptionPackage;
    this.abiModel = abiModel;
    this.eventLogDecoder = eventLogDecoder;
    this.eventOptionsMapper = eventOptionsMapper;

    return new Proxy(this, {
        get: this.proxyHandler
    });
}

/**
 * Checks if a contract event exists by the given name and returns the subscription otherwise it throws an error
 *
 * @method proxyHandler
 *
 * @param {Object} target
 * @param {String} name
 *
 * @returns {Function|Error}
 */
EventSubscriptionsProxy.prototype.proxyHandler = function (target, name) {
    var self = this;

    if (this.abiModel.hasEvent(name)) {
        return function (options, callback) {
            return this.subscribe(self.abiModel.getEvent(name), options, callback, target);
        }
    }

    if (name === 'allEvents') {
        return function (options, callback) {
            return this.subscribeAll(options, target, callback);
        }
    }

    throw Error('Event with name "' + name + '" not found');
};

/**
 * Returns an subscription on the given event
 *
 * @param {ABIItemModel} abiItemModel
 * @param {EventSubscriptionsProxy} target
 * @param {Object} options
 * @param {Function} callback
 *
 * @returns {Subscription}
 */
EventSubscriptionsProxy.prototype.subscribe = function (abiItemModel, target, options, callback) {
    if (options.filters && options.topics) {
        this.handleValidationError(new Error('Please set only topics or filters but not both.'), callback);
    }

    options = this.eventOptionsMapper.map(abiItemModel, target, options);

    return this.subscriptionPackage.createSubscription(
        target.contract.currentProvider,
        'logs',
        [options],
        this.formatters.inputLogFormatter,
        this.eventLogDecoder.decode,
        'eth'
    ).subscribe(callback);
};

/**
 * TODO: Move this to an AbstractContractEntityProxy object and let both proxies inherit from it
 *
 * Creates an promiEvent and rejects it with an error
 *
 * @method handleValidationError
 *
 * @param {Error} error
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
EventSubscriptionsProxy.prototype.handleValidationError = function (error, callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();
    promiEvent.eventEmitter.emit('error', error);

    if (_.isFunction(callback)) {
        callback(error, null);
    }

    return promiEvent;
};

module.exports = EventSubscriptionsProxy;
