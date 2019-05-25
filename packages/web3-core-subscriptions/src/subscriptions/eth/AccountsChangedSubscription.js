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

export default class AccountsChangedSubscription extends AbstractSubscription {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('', 'newHeads', null, utils, formatters, moduleInstance);

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

        this.moduleInstance.currentProvider.on('accountsChanged', this.onNewSubscriptionItem);
        this.moduleInstance.currentProvider.on('error', this.onNewSubscriptionItem);

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
        this.moduleInstance.currentProvider.removeListener('accountsChanged', this.onNewSubscriptionItem);
        this.moduleInstance.currentProvider.removeListener('error', this.onNewSubscriptionItem);

        return true;
    }

    /**
     * Calls the given callback method the correct way
     *
     * @param {Error|Array} value
     */
    onNewSubscriptionItem(value) {
        if (!isArray(value)) {
            this.callback(value, null);

            return;
        }

        this.callback(false, value);
    }
}
