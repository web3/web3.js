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
 * @file eventifiedPromise.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2016
 */

var EventEmitter = require('eventemitter3');
var Promise = require("bluebird");

/**
 * This function generates a defer promise and adds eventEmitter funcitonality to it
 *
 * @method eventifiedPromise
 */
var eventifiedPromise = function(justPromise) {
    var resolve, reject,
        promise = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });

    if(justPromise) {
        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    }

    // get eventEmitter
    var emitter = new EventEmitter();

    // add eventEmitter to the promise
    promise.emit = emitter.emit;
    promise.on = emitter.on;
    promise.once = emitter.once;
    promise.off = emitter.off;
    promise.listeners = emitter.listeners;
    promise.addListener = emitter.addListener;
    promise.removeListener = emitter.removeListener;
    promise.removeAllListeners = emitter.removeAllListeners;

    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
};

module.exports = eventifiedPromise;
