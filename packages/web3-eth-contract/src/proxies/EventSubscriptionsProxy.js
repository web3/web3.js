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
 *
 * @constructor
 */
function EventSubscriptionsProxy(contract, abiModel, eventSubscriptionFactory, eventOptionsMapper) {
    this.contract = contract;
    this.eventSubscriptionFactory = eventSubscriptionFactory;
    this.abiModel = abiModel;
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
    if (this.abiModel.hasEvent(name)) {
        return function (options, callback) {
            return target.subscribe(target.abiModel.getEvent(name), target, options, callback);
        }
    }

    if (name === 'allEvents') {
        return function (options, callback) {
            return target.subscribeAll(options, target, callback);
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

    return this.eventSubscriptionFactory.createEventLogSubscription(
        abiItemModel,
        target.contract,
        target.eventOptionsMapper.map(abiItemModel, target.contract, options)
    ).subscribe(callback);
};

/**
 * Creates an promiEvent and rejects it with an error
 *
 * @method handleValidationError
 *
 * @param {Error} error
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {EventEmitter}
 */
EventSubscriptionsProxy.prototype.handleValidationError = function (error, callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();
    promiEvent.eventEmitter.emit('error', error);

    if (_.isFunction(callback)) {
        callback(error, null);
    }

    return promiEvent.eventEmitter;
};

module.exports = EventSubscriptionsProxy;
