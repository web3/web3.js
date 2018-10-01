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
 * @file NewHeadSubscriptionModel.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSubscriptionModel = require('../../../../lib/models/AbstractSubscriptionModel');

/**
 * @param {Array} parameters
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function NewHeadSubscriptionModel(parameters, utils, formatters) {
    NewHeadSubscriptionModel.call(this, 'eth_subscribe', 'newHeads', parameters, utils, formatters);
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
NewHeadSubscriptionModel.prototype.onNewSubscriptionItem = function (subscription, subscriptionItem) {
    return this.formatters.outputBlockFormatter(subscriptionItem);
};

NewHeadSubscriptionModel.prototype = Object.create(AbstractSubscriptionModel);
NewHeadSubscriptionModel.prototype.constructor = NewHeadSubscriptionModel;

