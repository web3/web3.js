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

var SocketProviderAdapter = require('web3-providers').SocketProviderAdapter;
var EventEmitter = require('eventemitter3');

/**
 * @param {SubscriptionsFactory} subscriptionsFactory
 *
 * @constructor
 */
function NewHeadsWatcher(subscriptionsFactory) {
    this.subscriptionsFactory = subscriptionsFactory;
    this.confirmationInterval = null;
    this.confirmationSubscription = null;
    this.isPolling = false;
}

NewHeadsWatcher.prototype = Object.create(EventEmitter.prototype);
NewHeadsWatcher.prototype.constructor = NewHeadsWatcher;

/**
 * Starts subscription on newHeads if supported or creates an interval to get the newHeads
 *
 * @method watch
 *
 * @param {AbstractWeb3Object} web3Package
 *
 * @returns {this}
 */
NewHeadsWatcher.prototype.watch = function (web3Package) {
    var self = this;

    if (web3Package.currentProvider instanceof SocketProviderAdapter) {
        this.confirmationSubscription = this.subscriptionsFactory
            .createNewHeadsSubscription(web3Package)
            .subscribe(function () {
                self.emit('newHead');
            });

        return this;
    }

    this.isPolling = true;
    this.confirmationInterval = setInterval(function() {
        self.emit('newHead')
    }, 1000);

    return this;
};

/**
 * Clears the interval and unsubscribes the subscription
 *
 * @method stop
 */
NewHeadsWatcher.prototype.stop = function () {
    if (this.confirmationSubscription) {
        this.confirmationSubscription.unsubscribe();
    }

    if (this.confirmationInterval) {
        clearInterval(this.confirmationInterval);
    }

    this.removeAllListeners('newHead');
};

module.exports = NewHeadsWatcher;
