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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {
    LogSubscription,
    NewHeadsSubscription,
    NewPendingTransactionsSubscription,
    SyncingSubscription
} from 'web3-core-subscriptions';

import {GetPastLogsMethod} from 'web3-core-method';

export default class SubscriptionsFactory {
    /**
     * Gets the correct subscription class by the given name.
     *
     * @method getSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} type
     * @param {Object} options
     *
     * @returns {AbstractSubscription}
     */
    getSubscription(moduleInstance, type, options) {
        switch (type) {
            case 'logs':
                return new LogSubscription(options, moduleInstance, new GetPastLogsMethod(moduleInstance));
            case 'newBlockHeaders':
                return new NewHeadsSubscription(moduleInstance);
            case 'pendingTransactions':
                return new NewPendingTransactionsSubscription(moduleInstance);
            case 'syncing':
                return new SyncingSubscription(moduleInstance);
            default:
                throw new Error(`Unknown subscription: ${type}`);
        }
    }
}
