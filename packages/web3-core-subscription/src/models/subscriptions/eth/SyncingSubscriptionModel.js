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
 * @file SyncingSubscriptionModel.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSubscriptionModel = require('../../../../lib/models/AbstractSubscriptionModel');

/**
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function SyncingSubscriptionModel(utils, formatters) {
    AbstractSubscriptionModel.call(this, 'eth_subscribe', 'syncing', null, utils, formatters);
    this.isSyncing = null;
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
SyncingSubscriptionModel.prototype.onNewSubscriptionItem = function (subscription, subscriptionItem) {
    var isSyncing = subscriptionItem.result.syncing;

    if (this.isSyncing === null) {
        this.isSyncing = isSyncing;
        subscription.emit('changed', this.isSyncing);
    }

    if (this.isSyncing === true && isSyncing === false) {
        this.isSyncing = isSyncing;
        subscription.emit('changed', this.isSyncing);
    }

    if (this.isSyncing === false && isSyncing === true) {
        this.isSyncing = isSyncing;
        subscription.emit('changed', this.isSyncing);
    }

    return this.formatters.outputSyncingFormatter(subscriptionItem);
};

SyncingSubscriptionModel.prototype = Object.create(AbstractSubscriptionModel);
SyncingSubscriptionModel.prototype.constructor = SyncingSubscriptionModel;

module.exports = SyncingSubscriptionModel;
