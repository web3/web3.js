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
 * @file SubscriptionsFactory.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var Subscription = require('../Subscription');
var LogSubscriptionModel = require('../models/subscriptions/eth/LogSubscriptionModel');
var NewHeadsSubscriptionModel = require('../models/subscriptions/eth/NewHeadsSubscriptionModel');
var NewPendingTransactionsSubscriptionModel = require('../models/subscriptions/eth/NewPendingTransactionsSubscriptionModel');
var SyncingSubscriptionModel = require('../models/subscriptions/eth/SyncingSubscriptionModel');
var MessagesSubscriptionModel = require('../models/subscriptions/shh/MessagesSubscriptionModel');

/**
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function SubscriptionsFactory(utils, formatters) {
    this.utils = utils;
    this.formatters = formatters;
}

/**
 * Returns an eth log subscription
 *
 * @method createLogSubscription
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {Object} options
 * @param {GetPastLogsMethodModel} getPastLogsMethodModel
 * @param {MethodController} methodController
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createLogSubscription = function (
    web3Package,
    options,
    getPastLogsMethodModel,
    methodController
) {
    return new Subscription(web3Package,
        new LogSubscriptionModel(
            options,
            this.utils,
            this.formatters,
            getPastLogsMethodModel,
            methodController
        )
    );
};

/**
 * Returns an eth newHeads subscription
 *
 * @method createNewHeadsSubscription
 *
 * @param {AbstractWeb3Object} web3Package
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createNewHeadsSubscription = function (web3Package) {
    return new Subscription(
        web3Package,
        new NewHeadsSubscriptionModel(this.utils, this.formatters)
    );
};

/**
 * Returns an eth newPendingTransactions subscription
 *
 * @method createNewPendingTransactionsSubscription
 *
 * @param {AbstractWeb3Object} web3Package
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createNewPendingTransactionsSubscription = function (web3Package) {
    return new Subscription(
        web3Package,
        new NewPendingTransactionsSubscriptionModel(this.utils, this.formatters)
    );
};

/**
 * Returns an eth syncing subscription
 *
 * @method createSyncingSubscriptionModel
 *
 * @param {AbstractWeb3Object} web3Package
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createSyncingSubscriptionModel = function (web3Package) {
    return new Subscription(
        web3Package,
        new SyncingSubscriptionModel(this.utils, this.formatters)
    );
};

/**
 * Returns an shh messages subscription
 *
 * @method createShhMessagesSubscription
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {Object} options
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createShhMessagesSubscription = function (web3Package, options) {
    return new Subscription(
        web3Package,
        new MessagesSubscriptionModel(options, this.utils, this.formatters)
    );
};

module.exports = SubscriptionsFactory;
