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
 * @file ContractEventSubscriptionsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ContractEventSubscriptionsFactory} contractEventSubscriptionsFactory
 *
 * @constructor
 */
function ContractEventSubscriptionsProxy(contractEventSubscriptionsFactory) {
    this.contractEventSubscriptionsFactory = contractEventSubscriptionsFactory;

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
ContractEventSubscriptionsProxy.prototype.proxyHandler = function (target, name) {
    if (this.contractEventSubscriptionsFactory.hasEvent(name)) {
        var eventSubscriptionModel = this.contractEventSubscriptionsFactory.createEventSubscriptionModel(name);

        return function (options, callback) {
            eventSubscriptionModel.options = options;

            return eventSubscriptionModel.subscription.subscribe(callback);
        }
    }

    if (name === 'allEvents') {
        var allEventsSubscriptionModel = this.contractEventSubscriptionsFactory.getAllEventsModel();

        return function (options, callback) {
            allEventsSubscriptionModel.options = options;

            return allEventsSubscriptionModel.subscription.subscribe(callback);
        }
    }

    throw Error('Event with name "' + name + '" not found');
};
