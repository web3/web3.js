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
 * @file LogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';

export default class LogSubscription extends AbstractSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(options, utils, formatters, moduleInstance, getPastLogsMethod) {
        super('eth_subscribe', 'logs', options, utils, formatters, moduleInstance);
        this.getPastLogsMethod = getPastLogsMethod;
    }

    /**
     * This method will be executed before the subscription starts.
     *
     * @method beforeSubscription
     *
     * @param {Subscription} subscription
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Function} callback
     */
    beforeSubscription(subscription, moduleInstance, callback) {
        this.options = this.formatters.inputLogFormatter(this.options);
        this.getPastLogsMethod.parameters = [this.options];

        this.getPastLogsMethod.execute(moduleInstance)
            .then((logs) => {
                logs.forEach((log) => {
                    callback(false, log);
                    subscription.emit('data', log);
                });

                delete this.options.fromBlock;
            })
            .catch((error) => {
                subscription.emit('error', error);
                callback(error, null);
            });
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
    onNewSubscriptionItem(subscription, subscriptionItem) {
        return this.formatters.outputLogFormatter(subscriptionItem);
    }
}
