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
 * @file ContractEventSubscriptionsFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Array} eventAbiItems
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {SubscriptionPackage} subscriptionPackage
 *
 * @constructor
 */
function ContractEventSubscriptionsFactory(eventAbiItems, contractPackageFactory, subscriptionPackage) {
    this.eventAbiItems = eventAbiItems;
    this.contractPackageFactory = contractPackageFactory;
    this.subscriptionPackage = subscriptionPackage;
}

/**
 * Checks if an event exists on the contract by the given name
 *
 * @method hasEvent
 *
 * @param {String} name
 *
 * @returns {Boolean}
 */
ContractEventSubscriptionsFactory.prototype.hasEvent = function (name) {
    return this.getEventFromAbi(name) !== undefined;
};

/**
 * Returns an event from the contract if it exists otherwise it returns undefined
 *
 * @method getEventFromAbi
 *
 * @param {String} name
 *
 * @returns {Object|undefined}
 */
ContractEventSubscriptionsFactory.prototype.getEventFromAbi = function (name) {
    return this.eventAbiItems.find(function (eventAbiItem) {
        // check for all three name types (funcName, name, signature)
    });
};

/**
 * TODO: SubscriptionModel is strange and maybe not needed overthink this solution
 *
 * Returns the subscription model for an event
 *
 * @method createEventSubscriptionModel
 *
 * @param {String} name
 *
 * @returns {Object}
 */
ContractEventSubscriptionsFactory.prototype.createEventSubscriptionModel = function (name) {
    return this.contractPackageFactory.createEventSubscriptionModel(
        this.eventAbiItems[name]
    );
};
