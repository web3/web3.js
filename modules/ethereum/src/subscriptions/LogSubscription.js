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

import isFunction from 'lodash/isFunction';
import LogOptions from "../../lib/types/input/LogOptions";
import Subscription from "../../../core/src/json-rpc/subscriptions/Subscription";
import Log from "../../lib/types/output/Log";

// TODO: Move the past logs logic to the eth module
export default class LogSubscription extends Subscription {
    /**
     * @param {EthereumConfiguration} config
     * @param {Object} options
     * @param {GetPastLogsMethod} getPastLogsMethod
     *
     * @constructor
     */
    constructor(config, options, getPastLogsMethod) {
        super('eth_subscribe', 'logs', config);
        this.options = options;
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
            this.getPastLogsMethod.parameters = [new LogOptions(this.options)];
            this.getPastLogsMethod
                .execute()
                .then((logs) => {
                    logs.forEach((log) => {
                        const formattedLog = this.onNewSubscriptionItem(log);

                        if (isFunction(callback)) {
                            callback(false, formattedLog);
                        }

                        this.emit('data', formattedLog);
                    });

                    delete this.options.fromBlock;
                    super.subscribe(callback);
                })
                .catch((error) => {
                    if (isFunction(callback)) {
                        callback(error, null);
                    }

                    this.emit('error', error);
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
        const log = new Log(subscriptionItem);

        if (log.removed) {
            this.emit('changed', log);
        }

        return log;
    }
}
