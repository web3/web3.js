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

/**
 * @param {Object} provider
 * @param {Object} coreFactory
 * @constructor
 */
function NewHeadsWatcher(provider, coreFactory)  {
    this.provider = provider;
    this.coreFactory = coreFactory;
    this.formatters = this.coreFactory.createFormatters();
    this.confirmationInterval = null;
    this.confirmationSubscription = null;
}

/**
 * Starts subscription on newHeads if supported or creates an interval to get the newHeads
 *
 * @param {String} transactionHash
 * @returns {NewHeadsWatcher}
 */
NewHeadsWatcher.prototype.watch = function (transactionHash) {
    var self = this;

    try {
        this.confirmationSubscription = this.coreFactory.createSubscription(
            this.provider,
            'newHeads',
            transactionHash,
            null,
            this.formatters.outputBlockFormatter
        ).subscribe(function () {
            self.emit('newHead');// Check the return values
        });
    } catch (error) {
        this.confirmationInterval = setInterval(this.emit('newHead'), 1000);
    }

    return this;
};

/**
 * Clears the interval and unsubscribes the subscription
 */
NewHeadsWatcher.prototype.stop = function () {
    if(this.confirmationSubscription) {
        this.confirmationSubscription.unsubscribe();
    }

    if(this.confirmationInterval) {
        clearInterval(this.confirmationInterval);
    }
};

// Inherit EventEmitter
NewHeadsWatcher.prototype = Object.create(EventEmitter.prototype);
NewHeadsWatcher.prototype.constructor = NewHeadsWatcher;
