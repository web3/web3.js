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
 * @file SubscriptionFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Subscription = require('web3-core-subscription').Subscription;
var EventLogSubscription = require('../models/subscriptions/EventLogSubscription');

/**
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {GetPastLogsMethodModel} getPastLogsMethodModel
 * @param {MethodController} methodController
 * @param {EventLogDecoder} eventLogDecoder
 *
 * @constructor
 */
function EventSubscriptionFactory(utils, formatters, getPastLogsMethodModel, methodController, eventLogDecoder) {
    this.getPastLogsMethodModel = getPastLogsMethodModel;
    this.methodController = methodController;
    this.eventLogDecoder = eventLogDecoder;
}

/**
 * Returns an event log subscription
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {Object} options
 *
 * @returns {Subscription}
 */
EventSubscriptionFactory.prototype.createEventLogSubscription = function (web3Package, options) {
    return new Subscription(web3Package,
        new EventLogSubscription(
            options,
            this.utils,
            this.formatters,
            this.getPastLogsMethodModel,
            this.methodController,
            this.eventLogDecoder
        )
    );
};

module.exports = EventSubscriptionFactory;
