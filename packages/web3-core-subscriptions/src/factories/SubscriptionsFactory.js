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
 * @file SubscriptionsFactory.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Subscription from '../Subscription';
import LogSubscriptionModel from '../models/subscriptions/eth/LogSubscriptionModel';
import NewHeadsSubscriptionModel from '../models/subscriptions/eth/NewHeadsSubscriptionModel';
import NewPendingTransactionsSubscriptionModel from '../models/subscriptions/eth/NewPendingTransactionsSubscriptionModel';
import SyncingSubscriptionModel from '../models/subscriptions/eth/SyncingSubscriptionModel';
import MessagesSubscriptionModel from '../models/subscriptions/shh/MessagesSubscriptionModel';

export default class SubscriptionsFactory {

    /**
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Returns an eth log subscription
     *
     * @method createLogSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Object} options
     * @param {GetPastLogsMethodModel} getPastLogsMethodModel
     * @param {MethodController} methodController
     *
     * @returns {Subscription}
     */
    createLogSubscription(moduleInstance, options, getPastLogsMethodModel, methodController) {
        return new Subscription(
            new LogSubscriptionModel(
                options,
                this.utils,
                this.formatters,
                getPastLogsMethodModel,
                methodController
            ),
            moduleInstance
        );
    }

    /**
     * Returns an eth newHeads subscription
     *
     * @method createNewHeadsSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Subscription}
     */
    createNewHeadsSubscription(moduleInstance) {
        return new Subscription(
            new NewHeadsSubscriptionModel(this.utils, this.formatters),
            moduleInstance
        );
    }

    /**
     * Returns an eth newPendingTransactions subscription
     *
     * @method createNewPendingTransactionsSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Subscription}
     */
    createNewPendingTransactionsSubscription(moduleInstance) {
        return new Subscription(
            new NewPendingTransactionsSubscriptionModel(this.utils, this.formatters),
            moduleInstance
        );
    }

    /**
     * Returns an eth syncing subscription
     *
     * @method createSyncingSubscriptionModel
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Subscription}
     */
    createSyncingSubscriptionModel(moduleInstance) {
        return new Subscription(
            new SyncingSubscriptionModel(this.utils, this.formatters),
            moduleInstance
        );
    }

    /**
     * Returns an shh messages subscription
     *
     * @method createShhMessagesSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Object} options
     *
     * @returns {Subscription}
     */
    createShhMessagesSubscription(moduleInstance, options) {
        return new Subscription(
            new MessagesSubscriptionModel(options, this.utils, this.formatters),
            moduleInstance
        );
    }
}
