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
 * @file index.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var EventEmitter = require('eventemitter3');

/**
 * This function generates a defer promise and adds eventEmitter functionality to it
 *
 * @method eventifiedPromise
 */
function PromiEvent() {
    var self = this;

    this.promise = new Promise(function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
    });

    this.eventEmitter = new EventEmitter();

    return new Proxy(this, {
        get: this.proxyHandler
    });
}

/**
 * Proxy handler to call the promise or eventEmitter methods
 *
 * @method proxyHandler
 *
 * @param {PromiEvent} target
 * @param {String} name
 *
 * @returns {Function}
 */
PromiEvent.prototype.proxyHandler = function (target, name) {
    if (name === 'resolve' || name === 'reject') {
        return target[name];
    }

    if (this.promise[name]) {
        return target.promise[name];
    }

    if (this.eventEmitter[name]) {
        return target.eventEmitter[name];
    }

    throw Error('Method with name ' + name + ' not found');
};

module.exports = PromiEvent;
