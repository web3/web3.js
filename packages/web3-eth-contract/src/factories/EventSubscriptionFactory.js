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

"use strict";

import {Subscription} from 'web3-core-subscriptions';
import {GetPastLogsMethodModel} from 'web3-core-method';
import EventLogSubscription from '../models/subscriptions/EventLogSubscription';
import AllEventsLogSubscription from '../models/subscriptions/AllEventsLogSubscription';

export default class EventSubscriptionFactory {

    /**
     * @param {Object} utils
     * @param {Object} formatters
     * @param {MethodController} methodController
     *
     * @constructor
     */
    constructor(utils, formatters, methodController) {
        this.methodController = methodController;
    }

    /**
     * Returns an event log subscription
     *
     * @param {EventLogDecoder} eventLogDecoder
     * @param {ABIItemModel} abiItemModel
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Object} options
     *
     * @returns {Subscription}
     */
    createEventLogSubscription(eventLogDecoder, abiItemModel, moduleInstance, options) {
        return new Subscription(moduleInstance,
            new EventLogSubscription(
                abiItemModel,
                options,
                this.utils,
                this.formatters,
                new GetPastLogsMethodModel(this.utils, this.formatters),
                this.methodController,
                eventLogDecoder
            )
        );
    }

    /**
     * Returns an log subscription for all events
     *
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Object} options
     *
     * @returns {Subscription}
     */
    createAllEventLogSubscription(allEventsLogDecoder, moduleInstance, options) {
        return new Subscription(moduleInstance,
            new AllEventsLogSubscription(
                options,
                this.utils,
                this.formatters,
                new GetPastLogsMethodModel(this.utils, this.formatters),
                this.methodController,
                allEventsLogDecoder
            )
        );
    }
}
