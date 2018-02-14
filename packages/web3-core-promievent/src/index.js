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
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2016
 */

"use strict";

var EventEmitter = require('eventemitter3');
var Promise = require("bluebird");

/**
 * This function generates a defer promise and adds eventEmitter functionality to it
 *
 * @method eventifiedPromise
 */
var PromiEvent = function PromiEvent(justPromise) {
    var resolve, reject,
        eventEmitter = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });

    if(justPromise) {
        return {
            resolve: resolve,
            reject: reject,
            eventEmitter: eventEmitter
        };
    }

    // get eventEmitter
    var emitter = new EventEmitter();

    // add eventEmitter to the promise
    eventEmitter._events = emitter._events;
    eventEmitter.emit = emitter.emit;
    eventEmitter.on = emitter.on;
    eventEmitter.once = emitter.once;
    eventEmitter.off = emitter.off;
    eventEmitter.listeners = emitter.listeners;
    eventEmitter.addListener = emitter.addListener;
    eventEmitter.removeListener = emitter.removeListener;
    eventEmitter.removeAllListeners = emitter.removeAllListeners;

    return {
        resolve: resolve,
        reject: reject,
        eventEmitter: eventEmitter
    };
};

PromiEvent.resolve = function(value) {
    var promise = PromiEvent(true);
    promise.resolve(value);
    return promise.eventEmitter;
};

module.exports = PromiEvent;
