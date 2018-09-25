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
 * @file EventSubscriptionsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {AbiModel} abiModel
 *
 * @constructor
 */
function EventSubscriptionsProxy(abiModel) {
    this.abiModel = abiModel;

    return new Proxy(this, {
        get: this.proxyHandler
    });
}

/**
 * Checks if a contract event exists by the given name and returns the subscription otherwise it throws an error
 *
 * @method proxyHandler
 *
 * @param {Object} target
 * @param {String} name
 *
 * @returns {Function|Error}
 */
EventSubscriptionsProxy.prototype.proxyHandler = function (target, name) {
    var eventModel = this.abiModel.getEvent(name);

    if (eventModel) {
        return function (options, callback) {
            eventModel.options = options;

        }
    }

    if (name === 'allEvents') {
        return function (options, callback) {
            eventModel.options = options;

        }
    }

    throw Error('Event with name "' + name + '" not found');
};

module.exports = EventSubscriptionsProxy;
