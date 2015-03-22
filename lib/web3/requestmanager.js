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
/** @file requestmanager.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var Jsonrpc = require('./jsonrpc');
var utils = require('../utils/utils');
var c = require('../utils/config');

var InvalidProvider = new Error('provider is not set or invalid');
var InvalidResponse = new Error('jsonrpc response is not valid');

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 */
var RequestManager = function(provider) {
    this.jsonrpc = new Jsonrpc();
    this.provider = provider;
    this.polls = [];
    this.timeout = null;
    this.poll();
};

/**
 * Should be used to synchronously send request
 *
 * @method send
 * @param {Object|Array} data
 * @return {Object}
 */
RequestManager.prototype.send = function (data) {
    if (!this.provider) {
        console.error(InvalidProvider);
        return null;
    }

    var payload = this.jsonrpc.toPayload(data.method, data.params);
    var result = this.provider.send(payload);

    if (!this.jsonrpc.isValidResponse(result)) {
        throw InvalidResponse;
    }

    return result.result;
};

/**
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object|Array} data
 * @param {Function} callback
 */
RequestManager.prototype.sendAsync = function (data, callback) {
    if (!this.provider) {
        return callback(InvalidProvider);
    }

    var payload = this.jsonrpc.toPayload(data.method, data.params);
    var self = this;
    this.provider.sendAsync(payload, function (err, result) {
        if (err) {
            return callback(err);
        }
        
        if (!self.jsonrpc.isValidResponse(result)) {
            return callback(InvalidResponse);
        }

        callback(null, result.result);
    });
};

/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 * @param {Object}
 */
RequestManager.prototype.setProvider = function (p) {
    this.provider = p;
};

/*jshint maxparams:4 */

/**
 * Should be used to start polling
 *
 * @method startPolling
 * @param data
 * @param pollId
 * @param callback
 * @param uninstall
 *
 * @todo cleanup number of params
 */
RequestManager.prototype.startPolling = function (data, pollId, callback, uninstall) {
    this.polls.push({data: data, id: pollId, callback: callback, uninstall: uninstall});
};
/*jshint maxparams:3 */

/**
 * Should be used to stop polling for filter with given id
 *
 * @method stopPolling
 * @param pollId
 */
RequestManager.prototype.stopPolling = function (pollId) {
    for (var i = this.polls.length; i--;) {
        var poll = this.polls[i];
        if (poll.id === pollId) {
            this.polls.splice(i, 1);
        }
    }
};

/**
 * Should be called to reset polling mechanism of request manager
 *
 * @method reset
 */
RequestManager.prototype.reset = function () {
    this.polls.forEach(function (poll) {
        poll.uninstall(poll.id); 
    });
    this.polls = [];

    if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    this.poll();
};

/**
 * Should be called to poll for changes on filter with given id
 *
 * @method poll
 */
RequestManager.prototype.poll = function () {
    this.timeout = setTimeout(this.poll.bind(this), c.ETH_POLLING_TIMEOUT);

    if (!this.provider) {
        console.error(InvalidProvider);
        return;
    }

    var payload = this.jsonrpc.toBatchPayload(this.polls.map(function (data) {
        return data.data;
    }));

    var self = this;
    this.provider.sendAsync(payload, function (error, results) {
        // TODO: console log?
        if (error) {
            return;
        }
            
        if (!utils.isArray(results)) {
            return console.error(InvalidResponse);
        }

        results.map(function (result, index) {
            result.callback = self.polls[index].callback;
            return result;
        }).filter(function (result) {
            var valid = self.jsonrpc.isValidResponse(result);
            if (!valid) {
                result.callback(InvalidResponse);
            }
            return valid;
        }).filter(function (result) {
            return utils.isArray(result.result) && result.result.length > 0;
        }).forEach(function (result) {
            result.callback(null, result);
        });
    });
};

module.exports = RequestManager;

