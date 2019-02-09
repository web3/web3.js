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
     * Sends the JSON-RPC request, emits the required events and executes the callback method.
     *
     * @method subscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription} Subscription
     */
    subscribe(callback) {
        if ((this.options.fromBlock && this.options.fromBlock !== 'latest') || this.options.fromBlock === 0) {
            this.getPastLogsMethod.parameters = [this.formatters.inputLogFormatter(this.options)];
            this.getPastLogsMethod
                .execute(this.moduleInstance)
                .then((logs) => {
                    logs.forEach((log) => {
                        const formattedLog = this.onNewSubscriptionItem(log);

                        callback(false, formattedLog);
                        this.emit('data', formattedLog);
                    });

                    delete this.options.fromBlock;
                    super.subscribe(callback);
                })
                .catch((error) => {
                    this.emit('error', error);
                    callback(error, null);
                });

            return this;
        }

        super.subscribe(callback);

        return this;
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {Object} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        return this.formatters.outputLogFormatter(subscriptionItem);
    }
}
