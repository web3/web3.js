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
 * @file EventLogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var LogSubscriptionModel = require('web3-core-subscription').LogSubscriptionModel;

/**
 * @param {ABIItemModel} abiItemModel
 * @param {Object} options
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {GetPastLogsMethodModel} getPastLogsMethodModel
 * @param {MethodController} methodController
 * @param {EventLogDecoder} eventLogDecoder
 *
 * @constructor
 */
function EventLogSubscription(
    abiItemModel,
    options,
    utils,
    formatters,
    getPastLogsMethodModel,
    methodController,
    eventLogDecoder
) {
    LogSubscriptionModel.call(this, options, utils, formatters, getPastLogsMethodModel, methodController);
    this.eventLogDecoder = eventLogDecoder;
    this.abiItemModel = abiItemModel;
}

/**
 * This method will be executed on each new subscription item.
 *
 * @method onNewSubscriptionItem
 *
 * @param {Subscription} subscription
 * @param {*} subscriptionItem
 *
 * @returns {Object}
 */
EventLogSubscription.prototype.onNewSubscriptionItem = function (subscription, subscriptionItem) {
    return this.eventLogDecoder.decode(this.abiItemModel, this.formatters.outputLogFormatter(subscriptionItem));
};

EventLogSubscription.prototye = Object.create(LogSubscriptionModel.prototype);
EventLogSubscription.prototye.constructor = EventLogSubscription;

module.exports = EventLogSubscription;
