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
 * @param {Contract} contract
 * @param {ABIModel} abiModel
 * @param {EventSubscriptionFactory} eventSubscriptionFactory
 * @param {EventOptionsMapper} eventOptionsMapper
 * @param {EventLogDecoder} eventLogDecoder
 * @param {AllEventsLogDecoder} allEventsLogDecoder
 * @param {AllEventsOptionsMapper} allEventsOptionsMapper
 *
 * @constructor
 */
function EventSubscriptionsProxy(
    contract,
    abiModel,
    eventSubscriptionFactory,
    eventOptionsMapper,
    eventLogDecoder,
    allEventsLogDecoder,
    allEventsOptionsMapper,
) {
    this.contract = contract;
    this.eventSubscriptionFactory = eventSubscriptionFactory;
    this.abiModel = abiModel;
    this.eventOptionsMapper = eventOptionsMapper;
    this.eventLogDecoder = eventLogDecoder;
    this.allEventsLogDecoder = allEventsLogDecoder;
    this.allEventsOptionsMapper = allEventsOptionsMapper;

    return new Proxy(this, {
        get: this.proxyHandler
    });
}

/**
 * Checks if a contract event exists by the given name and returns the subscription otherwise it throws an error
 *
 * @method proxyHandler
 *
 * @param {EventSubscriptionsProxy} target
 * @param {String} name
 *
 * @returns {Function|Error}
 */
EventSubscriptionsProxy.prototype.proxyHandler = function (target, name) {
    if (this.abiModel.hasEvent(name)) {
        return function (options, callback) {
            return target.subscribe(target.abiModel.getEvent(name), options, callback);
        }
    }

    if (name === 'allEvents') {
        return function (options, callback) {
            return target.subscribeAll(options, callback);
        }
    }

    if (target[name]) {
        return target[name];
    }

    throw Error('Event with name "' + name + '" not found');
};

/**
 * Returns an subscription on the given event
 *
 * @param {ABIItemModel} abiItemModel
 * @param {Object} options
 * @param {Function} callback
 *
 * @returns {Subscription|EventEmitter}
 */
EventSubscriptionsProxy.prototype.subscribe = function (abiItemModel, options, callback) {
    if (typeof options.filters !== 'undefined' && typeof options.topics !== 'undefined') {
        return this.handleValidationError(
            'Invalid subscription options: Only filter or topics are allowed and not both',
            callback
        );
    }

    return this.eventSubscriptionFactory.createEventLogSubscription(
        this.eventLogDecoder,
        abiItemModel,
        this.contract,
        this.eventOptionsMapper.map(abiItemModel, this.contract, options)
    ).subscribe(callback);
};

/**
 * Returns an subscription for all contract events
 *
 * @method subscribeAll
 *
 * @param {Object} options
 * @param {Function} callback
 *
 * @returns {Subscription|EventEmitter}
 */
EventSubscriptionsProxy.prototype.subscribeAll = function (options, callback) {
    if (typeof options.topics !== 'undefined') {
        return this.handleValidationError(
            'Invalid subscription options: Topics are not allowed for the "allEvents" subscription',
            callback
        );
    }

    return this.eventSubscriptionFactory.createAllEventLogSubscription(
        this.allEventsLogDecoder,
        this.contract,
        this.allEventsOptionsMapper.map(this.abiModel, this.contract, options)
    ).subscribe(callback);
};

/**
 * Creates an promiEvent and rejects it with an error
 *
 * @method handleValidationError
 *
 * @param {String} errorMessage
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
EventSubscriptionsProxy.prototype.handleValidationError = function (errorMessage, callback) {
    var promiEvent = new this.promiEventPackage.PromiEvent();
    promiEvent.emit('error', new Error(errorMessage));

    if (_.isFunction(callback)) {
        callback(error, null);
    }

    return promiEvent;
};

module.exports = EventSubscriptionsProxy;
