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
 * @file NewHeadsWatcher.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import EventEmitter from 'eventemitter3';

export default class NewHeadsWatcher extends EventEmitter {
    /**
     * @param {SubscriptionsFactory} subscriptionsFactory
     *
     * @constructor
     */
    constructor(subscriptionsFactory) {
        super();
        this.subscriptionsFactory = subscriptionsFactory;
        this.confirmationInterval = null;
        this.confirmationSubscription = null;
        this.isPolling = false;
    }

    /**
     * Starts subscription on newHeads if supported or creates an interval to get the newHeads
     *
     * @method watch
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {NewHeadsWatcher}
     */
    watch(moduleInstance) {
        const providerName = moduleInstance.currentProvider.constructor.name;

        if (providerName !== 'HttpProvider' && providerName !== 'CustomProvider') {
            this.confirmationSubscription = this.subscriptionsFactory
                .createNewHeadsSubscription(moduleInstance)
                .subscribe(() => {
                    this.emit('newHead');
                });

            return this;
        }

        this.isPolling = true;
        this.confirmationInterval = setInterval(() => {
            this.emit('newHead');
        }, 1000);

        return this;
    }

    /**
     * Clears the interval and unsubscribes the subscription
     *
     * @method stop
     */
    stop() {
        if (this.confirmationSubscription) {
            this.confirmationSubscription.unsubscribe();
        }

        if (this.confirmationInterval) {
            clearInterval(this.confirmationInterval);
        }

        this.removeAllListeners('newHead');
    }
}
