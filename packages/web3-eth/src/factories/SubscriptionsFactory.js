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

export default class SubscriptionsFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {MethodFactory} methodFactory
     *
     * @constructor
     */
    constructor(utils, formatters, methodFactory) {
        this.utils = utils;
        this.formatters = formatters;
        this.methodFactory = methodFactory;
    }

    /**
     * Gets and executes subscription for an given type
     *
     * @method getSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} type
     * @param {Object} options
     * @param {Function} callback
     *
     * @returns {Subscription}
     */
    getSubscription(moduleInstance, type, options) {
        switch (type) {
            case 'logs':
                return new LogSubscription(
                    options,
                    utils,
                    formatters,
                    moduleInstance,
                    this.methodFactory.createMethod('getPastLogs')
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
