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
 * @file LogSubscriptionModel.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSubscriptionModel = require('../../../../lib/models/AbstractSubscriptionModel');

/**
 * @param {Array} parameters
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {GetPastLogsMethodModel} getPastLogsMethodModel
 * @param {MethodController} methodController
 *
 * @constructor
 */
function LogSubscriptionModel(parameters, utils, formatters, getPastLogsMethodModel, methodController) {
    AbstractSubscriptionModel.call(this, 'eth_subscribe', 'logs', parameters, utils, formatters);
    this.getPastLogsMethodModel = getPastLogsMethodModel;
    this.methodController = methodController;
}

/**
 * This method will be executed before the subscription starts.
 *
 * @method beforeSubscription
 *
 * @param {Subscription} subscription
 * @param {AbstractWeb3Object} web3Package
 * @param {Function} callback
 */
LogSubscriptionModel.prototype.beforeSubscription = function (subscription, web3Package, callback) {
    this.parameters[0] = this.formatters.inputLogFormatter(this.parameters[0]);
    this.getPastLogsMethodModel.parameters = this.parameters;

    this.methodController.execute(
        this.getPastLogsMethodModel,
        web3Package.currentProvider,
        null,
        web3Package
    ).then(function (logs) {
        logs.forEach(function (log) {
            callback(false, log);
            subscription.emit('data', log);
        });

        delete this.parameters[0].fromBlock;
    }).catch(function (error) {
        subscription.emit('error', error);
        callback(error, null);
    });
};

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
LogSubscriptionModel.prototype.onNewSubscriptionItem = function (subscription, subscriptionItem) {
    return this.formatters.outputLogFormatter(subscriptionItem);
};

LogSubscriptionModel.prototype = Object.create(AbstractSubscriptionModel);
LogSubscriptionModel.prototype.constructor = LogSubscriptionModel;

