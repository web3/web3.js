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
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');

/// Should be called to check if filter implementation is valid
/// @returns true if it is, otherwise false
var implementationIsValid = function (i) {
    return !!i &&
        typeof i.newFilter       === 'function' &&
        typeof i.getLogs         === 'function' &&
        typeof i.uninstallFilter === 'function' &&
        typeof i.startPolling    === 'function' &&
        typeof i.stopPolling     === 'function';
};

/// This method should be called on options object, to verify deprecated properties && lazy load dynamic ones
/// @param should be string or object
/// @returns options string or object
var getOptions = function (options) {
    /*jshint maxcomplexity:9 */

    if (typeof options === 'string') {
        return options;
    }

    options = options || {};

    if (options.topic) {
        console.warn('"topic" is deprecated, is "topics" instead');
        options.topics = options.topic;
    }

    if (options.earliest) {
        console.warn('"earliest" is deprecated, is "fromBlock" instead');
        options.fromBlock = options.earliest;
    }

    if (options.latest) {
        console.warn('"latest" is deprecated, is "toBlock" instead');
        options.toBlock = options.latest;
    }

    if (options.skip) {
        console.warn('"skip" is deprecated, is "offset" instead');
        options.offset = options.skip;
    }

    if (options.max) {
        console.warn('"max" is deprecated, is "limit" instead');
        options.limit = options.max;
    }

    // make sure topics, get converted to hex
    if (options.topics instanceof Array) {
        options.topics = options.topics.map(function (topic) {
            return utils.toHex(topic);
        });
    }


    // evaluate lazy properties
    return {
        fromBlock: utils.toHex(options.fromBlock),
        toBlock: utils.toHex(options.toBlock),
        limit: utils.toHex(options.limit),
        offset: utils.toHex(options.offset),
        to: options.to,
        address: options.address,
        topics: options.topics
    };
};

/// Should be used when we want to watch something
/// it's using inner polling mechanism and is notified about changes
/// @param options are filter options
/// @param implementation, an abstract polling implementation
/// @param formatter (optional), callback function which formats output before 'real' callback 
var filter = function (options, implementation, formatter) {
    if (!implementationIsValid(implementation)) {
        console.error('filter implemenation is invalid');
        return;
    }

    options = getOptions(options);
    var callbacks = [];
    var filterId = implementation.newFilter(options);

    // call the callbacks
    var onMessages = function (messages) {
        messages.forEach(function (message) {
            message = formatter ? formatter(message) : message;
            callbacks.forEach(function (callback) {
                callback(message);
            });
        });
    };

    implementation.startPolling(filterId, onMessages, implementation.uninstallFilter);

    var watch = function (callback) {
        callbacks.push(callback);
    };

    var stopWatching = function () {
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

        // DEPRECATED methods
        changed: function () {
            console.warn('watch().changed() is deprecated please use filter().watch() instead.');
            return watch.apply(this, arguments);
        },
        arrived: function () {
            console.warn('watch().arrived() is deprecated please use filter().watch() instead.');
            return watch.apply(this, arguments);
        },
        happened: function () {
            console.warn('watch().happened() is deprecated please use filter().watch() instead.');
            return watch.apply(this, arguments);
        },
        uninstall: function () {
            console.warn('watch().uninstall() is deprecated please use filter().stopWatching() instead.');
            return stopWatching.apply(this, arguments);
        },
        messages: function () {
            console.warn('watch().messages() is deprecated please use filter().get() instead.');
            return get.apply(this, arguments);
        },
        logs: function () {
            console.warn('watch().logs() is deprecated please use filter().get() instead.');
            return get.apply(this, arguments);
        }
    };
};

module.exports = filter;
