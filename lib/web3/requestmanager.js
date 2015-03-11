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
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var jsonrpc = require('./jsonrpc');
var c = require('../utils/config');

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
        /*jshint maxcomplexity: 8 */

        // FORMAT BASED ON ONE FORMATTER function
        if(typeof data.inputFormatter === 'function') {
            data.params = Array.prototype.map.call(data.params, function(item, index){
                // format everything besides the defaultblock, which is already formated
                return (!data.addDefaultblock || index+1 < data.addDefaultblock) ? data.inputFormatter(item) : item;
            });

        // FORMAT BASED ON the input FORMATTER ARRAY
        } else if(data.inputFormatter instanceof Array) {
            data.params = Array.prototype.map.call(data.inputFormatter, function(formatter, index){
                // format everything besides the defaultblock, which is already formated
                return (!data.addDefaultblock || index+1 < data.addDefaultblock) ? formatter(data.params[index]) : data.params[index];
            });
        }


        var payload = jsonrpc.toPayload(data.method, data.params);
        
        if (!provider) {
            console.error('provider is not set');
            return null;
        }

        // HTTP ASYNC (only when callback is given, and it a HttpProvidor)
        if(typeof callback === 'function' && provider.name === 'HTTP'){
            provider.send(payload, function(result, status){

                if (!jsonrpc.isValidResponse(result)) {
                    if(typeof result === 'object' && result.error && result.error.message) {
                        console.error(result.error.message);
                        callback(result.error);
                    } else {
                        callback(new Error({
                            status: status,
                            error: result,
                            message: 'Bad Request'
                        }));
                    }
                    return null;
                }

                // format the output
                callback(null, (typeof data.outputFormatter === 'function') ? data.outputFormatter(result.result) : result.result);
            });

        // SYNC
        } else {
            var result = provider.send(payload);

            if (!jsonrpc.isValidResponse(result)) {
                console.log(result);
                if(typeof result === 'object' && result.error && result.error.message)
                    console.error(result.error.message);
                return null;
            }

            // format the output
            return (typeof data.outputFormatter === 'function') ? data.outputFormatter(result.result) : result.result;
        }
        
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
            send(data.data, function(error, result){
                if (!(result instanceof Array) || result.length === 0) {
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

