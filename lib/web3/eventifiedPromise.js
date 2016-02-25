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
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2016
 */

var EventEmitter = require('eventemitter3');
// load bluebird if no promise exists
if(global && typeof global.Promise === 'undefined')
    global.Promise = require("bluebird");
if(window && typeof window.Promise === 'undefined')
    window.Promise = require("bluebird");

/**
 * This funciton generates a defer promise and adds eventEmitter funcitonality to it
 *
 * @method eventifiedPromise
 */
var eventifiedPromise = function() {
    var resolve, reject,
        emitter = new EventEmitter(),
        promise = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });


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
