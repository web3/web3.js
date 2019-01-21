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
 * @file EventLogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {LogSubscription} from 'web3-core-subscriptions';

export default class EventLogSubscription extends LogSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractContract} contract
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {EventLogDecoder} eventLogDecoder
     * @param {AbiItemModel} abiItemModel
     *
     * @constructor
     */
    constructor(options, utils, formatters, contract, getPastLogsMethod, eventLogDecoder, abiItemModel) {
        super(options, utils, formatters, contract, getPastLogsMethod);

        this.eventLogDecoder = eventLogDecoder;
        this.abiItemModel = abiItemModel;
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
        return this.eventLogDecoder.decode(this.abiItemModel, this.formatters.outputLogFormatter(subscriptionItem));
    }
}
