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
 * @file AllEventsLogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {LogSubscription} from 'web3-core-subscriptions';

export default class AllEventsLogSubscription extends LogSubscription {
    /**
     * @param {EthereumConfiguration} config
     * @param {Object} options
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {EventLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     *
     * @constructor
     */
    constructor(config, options, getPastLogsMethod, allEventsLogDecoder, abiModel) {
        super(config, options, getPastLogsMethod);

        this.allEventsLogDecoder = allEventsLogDecoder;
        this.abiModel = abiModel;
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {*} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        let log = this.formatters.outputLogFormatter(subscriptionItem);

        if (log.removed) {
            log = this.allEventsLogDecoder.decode(this.abiModel, log);

            this.emit('changed', log);

            return log;
        }

        return this.allEventsLogDecoder.decode(this.abiModel, log);
    }
}
