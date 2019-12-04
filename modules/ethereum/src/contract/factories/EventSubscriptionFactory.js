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
 * @file SubscriptionFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {GetPastLogsMethod} from 'web3-core-method';
import EventLogSubscription from '../subscriptions/EventLogSubscription';
import AllEventsLogSubscription from '../subscriptions/AllEventsLogSubscription';

// TODO: Remove all factories. The factory pattern isn't the right thing here for us and with JS.
export default class EventSubscriptionFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Returns an event log subscription
     *
     * @param {EventLogDecoder} eventLogDecoder
     * @param {AbstractContract} contract
     * @param {Object} options
     * @param {AbiItemModel} abiItemModel
     *
     * @returns {EventLogSubscription}
     */
    createEventLogSubscription(eventLogDecoder, contract, options, abiItemModel) {
        return new EventLogSubscription(
            options,
            this.utils,
            this.formatters,
            contract,
            new GetPastLogsMethod(this.utils, this.formatters, contract),
            eventLogDecoder,
            abiItemModel
        );
    }

    /**
     * Returns an log subscription for all events
     *
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {AllEventsLogSubscription}
     */
    createAllEventsLogSubscription(allEventsLogDecoder, contract, options) {
        return new AllEventsLogSubscription(
            options,
            this.utils,
            this.formatters,
            contract,
            new GetPastLogsMethod(this.utils, this.formatters, contract),
            allEventsLogDecoder,
            contract.abiModel
        );
    }
}
