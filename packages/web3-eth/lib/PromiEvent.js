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
 * @file PromiEvent.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import EventEmitter from 'eventemitter3';

// TODO: add handleSuccess() and handleError() method instead of having them in the send method class
export default class PromiEvent {
    /**
     * @constructor
     */
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
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
     * @param {String|Symbol} name
     *
     * @returns {Function}
     */
    proxyHandler(target, name) {
        if (name === 'resolve' || name === 'reject') {
            return target[name];
        }

        if (name === 'then') {
            return target.promise.then.bind(target.promise);
        }

        if (name === 'catch') {
            return target.promise.catch.bind(target.promise);
        }

        if (target.eventEmitter[name]) {
            return target.eventEmitter[name];
        }
    }
}
