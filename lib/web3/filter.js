/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file filter.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');

/// Should be called to check if filter implementation is valid
/// @returns true if it is, otherwise false
var implementationIsValid = function (i) {
    return !!i && 
        typeof i.newFilter === 'function' && 
        typeof i.getLogs === 'function' && 
        typeof i.uninstallFilter === 'function' &&
        typeof i.startPolling === 'function' &&
        typeof i.stopPolling === 'function';
};

/// This method should be called on options object, to verify deprecated properties && lazy load dynamic ones
/// @param should be string or object
/// @returns options string or object
var getOptions = function (options) {

    if (typeof options === 'string') {
        return options;
    } 

    options = options || {};

    // make sure topics, get converted to hex
    if (utils.isArray(options.topics)) {
        options.topics = options.topics.map(function(topic){
            return utils.toHex(topic);
        });
    }

    var asBlockNumber = function (n) {
        if (typeof n === 'undefined') {
            return undefined;
        }
        if (n === 'latest' || n === 'pending') {
           return n; 
        }
        return utils.toHex(n);
    };

    // lazy load
    return {
        topics: options.topics,
        to: options.to,
        address: options.address,
        fromBlock: asBlockNumber(options.fromBlock),
        toBlock: asBlockNumber(options.toBlock) 
    }; 
};

/// Should be used when we want to watch something
/// it's using inner polling mechanism and is notified about changes
/// @param options are filter options
/// @param implementation, an abstract polling implementation
/// @param formatter (optional), callback function which formats output before 'real' callback 
var filter = function(options, implementation, formatter) {
    if (!implementationIsValid(implementation)) {
        console.error('filter implemenation is invalid');
        return;
    }

    options = getOptions(options);
    var callbacks = [];
    var filterId = implementation.newFilter(options);

    // call the callbacks
    var onMessages = function (error, messages) {
        if (error) {
            callbacks.forEach(function (callback) {
                callback(error);
            });
        }

        messages.forEach(function (message) {
            message = formatter ? formatter(message) : message;
            callbacks.forEach(function (callback) {
                callback(null, message);
            });
        });
    };


    var watch = function(callback) {
        implementation.startPolling(filterId, onMessages, implementation.uninstallFilter);
        callbacks.push(callback);
    };

    var stopWatching = function() {
        implementation.stopPolling(filterId);
        callbacks = [];
    };

    var uninstall = function() {
        implementation.stopPolling(filterId);
        implementation.uninstallFilter(filterId);
        callbacks = [];
    };

    var get = function () {
        var results = implementation.getLogs(filterId);

        return utils.isArray(results) ? results.map(function(message){
                return formatter ? formatter(message) : message;
            }) : results;
    };
    
    return {
        watch: watch,
        stopWatching: stopWatching,
        get: get,
        uninstall: uninstall
    };
};

module.exports = filter;

