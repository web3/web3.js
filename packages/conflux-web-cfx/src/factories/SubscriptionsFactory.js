/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import {
    LogSubscription,
    NewHeadsSubscription,
    NewPendingTransactionsSubscription,
    SyncingSubscription
} from 'conflux-web-core-subscriptions';

import {GetPastLogsMethod} from 'conflux-web-core-method';

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
     * Gets the correct subscription class by the given name.
     *
     * @method getSubscription
     *
     * @param {AbstractConfluxWebModule} moduleInstance
     * @param {String} type
     * @param {Object} options
     *
     * @returns {AbstractSubscription}
     */
    getSubscription(moduleInstance, type, options) {
        switch (type) {
            case 'logs':
                return new LogSubscription(
                    options,
                    this.utils,
                    this.formatters,
                    moduleInstance,
                    new GetPastLogsMethod(this.utils, this.formatters, moduleInstance)
                );
            case 'newBlockHeaders':
                return new NewHeadsSubscription(this.utils, this.formatters, moduleInstance);
            case 'pendingTransactions':
                return new NewPendingTransactionsSubscription(this.utils, this.formatters, moduleInstance);
            case 'syncing':
                return new SyncingSubscription(this.utils, this.formatters, moduleInstance);
            default:
                throw new Error(`Unknown subscription: ${type}`);
        }
    }
}
