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

import {LogSubscription} from 'conflux-web-core-subscriptions';

export default class AllEventsLogSubscription extends LogSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractContract} contract
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {EventLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     *
     * @constructor
     */
    constructor(options, utils, formatters, contract, getPastLogsMethod, allEventsLogDecoder, abiModel) {
        super(options, utils, formatters, contract, getPastLogsMethod);

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
        return this.allEventsLogDecoder.decode(this.abiModel, this.formatters.outputLogFormatter(subscriptionItem));
    }
}
