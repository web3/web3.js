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

import cloneDeep from 'lodash/cloneDeep';
import LogSubscription from '../subscriptions/eth/LogSubscription';
import NewHeadsSubscription from '../subscriptions/eth/NewHeadsSubscription';
import NewPendingTransactionsSubscription from '../subscriptions/eth/NewPendingTransactionsSubscription';
import SyncingSubscription from '../subscriptions/eth/SyncingSubscription';
import MessagesSubscription from '../subscriptions/shh/MessagesSubscription';

export default class SubscriptionsFactory {
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
     * Returns an eth log subscription
     *
     * @method createLogSubscription
     *
     * @param {Object} options
     * @param {AbstractWeb3Module} moduleInstance
     * @param {GetPastLogsMethod} getPastLogsMethod
     *
     * @returns {LogSubscription}
     */
    createLogSubscription(options, moduleInstance, getPastLogsMethod) {
        return new LogSubscription(cloneDeep(options), this.utils, this.formatters, moduleInstance, getPastLogsMethod);
    }

    /**
     * Returns an eth newHeads subscription
     *
     * @method createNewHeadsSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {NewHeadsSubscription}
     */
    createNewHeadsSubscription(moduleInstance) {
        return new NewHeadsSubscription(this.utils, this.formatters, moduleInstance);
    }

    /**
     * Returns an eth newPendingTransactions subscription
     *
     * @method createNewPendingTransactionsSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {NewPendingTransactionsSubscription}
     */
    createNewPendingTransactionsSubscription(moduleInstance) {
        return new NewPendingTransactionsSubscription(this.utils, this.formatters, moduleInstance);
    }

    /**
     * Returns an eth syncing subscription
     *
     * @method createSyncingSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {SyncingSubscription}
     */
    createSyncingSubscription(moduleInstance) {
        return new SyncingSubscription(this.utils, this.formatters, moduleInstance);
    }

    /**
     * Returns an shh messages subscription
     *
     * @method createShhMessagesSubscription
     *
     * @param {Object} options
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {MessagesSubscription}
     */
    createShhMessagesSubscription(options, moduleInstance) {
        return new MessagesSubscription(options, this.utils, this.formatters, moduleInstance);
    }
}
