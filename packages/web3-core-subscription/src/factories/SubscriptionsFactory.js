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
 * @file SubscriptionModelsFactory.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";
var Subscription = require('../Subscription');
var LogSubscriptionModel = require('../models/subscriptions/eth/LogSubscriptionModel');

function SubscriptionsFactory() { }

/**
 * Returns an subscription how is initiated with LogSubscriptionModel
 *
 * @method createLogSubscription
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {Array} parameters
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {GetPastLogsMethodModel} getPastLogsMethodModel
 * @param {MethodController} methodController
 *
 * @returns {Subscription}
 */
SubscriptionsFactory.prototype.createLogSubscription = function (
    web3Package,
    parameters,
    utils,
    formatters,
    getPastLogsMethodModel,
    methodController
) {
    return new Subscription(web3Package,
        new LogSubscriptionModel(
            parameters,
            utils,
            formatters,
            getPastLogsMethodModel,
            methodController
        )
    );
};

module.exports = SubscriptionsFactory;
