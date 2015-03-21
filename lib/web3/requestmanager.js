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

var jsonrpc = require('./jsonrpc');
var c = require('../utils/config');

var InvalidResponse = new Error('jsonrpc response is not valid');

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 */
var requestManager = function() {
    var polls = [];
    var timeout = null;
    var provider;

    var send = function (data, callback) {

        var payload = utils.isArray(data) ? jsonrpc.toBatchPayload(data) : jsonrpc.toPayload(data.method, data.params);
        var result = provider.send(payload);

        if (!jsonrpc.isValidResponse(result)) {
            throw InvalidResponse;
        }

        return result.result;
    };

    var sendAsync = function (data, callback) {
        var payload = utils.isArray(data) ? jsonrpc.toBatchPayload(data) : jsonrpc.toPayload(data.method, data.params);
        provider.sendAsync(payload, function (err, result) {
            if (err) {
                return callback(err);
            }
            
            if (!jsonrpc.isValidResponse(result)) {
                return callback(InvalidResponse);
            }

            callback(null, result.result);
        });
    };

    var setProvider = function (p) {
        provider = p;
    };

    /*jshint maxparams:4 */
    var startPolling = function (data, pollId, callback, uninstall) {
        polls.push({data: data, id: pollId, callback: callback, uninstall: uninstall});
    };
    /*jshint maxparams:3 */

    var stopPolling = function (pollId) {
        for (var i = polls.length; i--;) {
            var poll = polls[i];
            if (poll.id === pollId) {
                polls.splice(i, 1);
            }
        }
    };

    var reset = function () {
        polls.forEach(function (poll) {
            poll.uninstall(poll.id); 
        });
        polls = [];

        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        poll();
    };

    var poll = function () {
        polls.forEach(function (data) {
            // send async
            sendAsync(data.data, function(error, result){
                if (error || !(isArray(result)) || result.length === 0) {
                    return;
                }

                data.callback(result);
            });
        });
        timeout = setTimeout(poll, c.ETH_POLLING_TIMEOUT);
    };
    
    poll();

    return {
        send: send,
        setProvider: setProvider,
        startPolling: startPolling,
        stopPolling: stopPolling,
        reset: reset
    };
};

module.exports = requestManager;

