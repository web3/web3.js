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
 * @file AccountsChangedSubscription
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractSubscription from './AbstractSubscription';

export default class AbstractProviderSubscription extends AbstractSubscription {
    /**
     * @param {String} method
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(method, utils, formatters, moduleInstance) {
        super('', method, null, utils, formatters, moduleInstance);

        this.callback = null;
    }

    /**
     * Listens to the accountsChanged event of the provider
     *
     * @method subscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {AccountsChangedSubscription}
     */
    subscribe(callback) {
        this.callback = callback;

        this.moduleInstance.currentProvider.on(this.method, this.onNewSubscriptionItem);
        this.moduleInstance.currentProvider.on('error', this.onError);

        return this;
    }

    /**
     * Removes the event listeners from the current provider.
     *
     * @method unsubscribe
     *
     * @return {Boolean}
     */
    async unsubscribe() {
        this.moduleInstance.currentProvider.removeListener(this.method, this.onNewSubscriptionItem);
        this.moduleInstance.currentProvider.removeListener('error', this.onError);

        return true;
    }

    /**
     * Calls the given callback method the correct way
     *
     * @method onError
     *
     * @param {Error} error
     */
    onError(error) {
        this.callback(false, error);
    }

    /**
     * Calls the given callback method the correct way
     *
     * @param {Error|Array} value
     */
    onNewSubscriptionItem(value) {
        this.callback(value, null);
    }
}
