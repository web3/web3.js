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
var utils = require('../utils/utils');

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

        if(!utils.isArray(data))
            data = [data];

        var payload = [];


        data.forEach(function(item){
            // FORMAT BASED ON ONE FORMATTER function
            if(typeof item.inputFormatter === 'function') {
                item.params = Array.prototype.map.call(item.params, function(param, index){
                    // format everything besides the defaultblock, which is already formated
                    return (!item.addDefaultblock || index+1 < item.addDefaultblock) ? item.inputFormatter(param) : param;
                });

            // FORMAT BASED ON the input FORMATTER ARRAY
            } else if(item.inputFormatter instanceof Array) {
                item.params = Array.prototype.map.call(item.inputFormatter, function(formatter, index){
                    // format everything besides the defaultblock, which is already formated
                    return (!item.addDefaultblock || index+1 < item.addDefaultblock) ? formatter(item.params[index]) : item.params[index];
                });
            }

            payload.push(jsonrpc.toPayload(item.method, item.params));
        });

        
        if (!provider) {
            console.error('provider is not set');
            return null;
        }

        // HTTP ASYNC (only when callback is given, and it a HttpProvidor)
        if(typeof callback === 'function' && provider.name === 'RPC over HTTP'){
            provider.send(payload, function(result, status){

                if(!utils.isArray(data)) {
                    callback(new Error({
                        status: status,
                        error: result,
                        message: provider.name +' didn\'t repsond with an array of method responses'
                    }));
                    return;
                }

                result.forEach(function(item, index){

                    if (!jsonrpc.isValidResponse(item)) {
                        if(typeof item === 'object' && item.error && item.error.message) {
                            console.error(item.error.message);
                            callback(item.error);
                        } else {
                            callback(new Error({
                                status: status,
                                error: item,
                                message: provider.name +' Bad Request'
                            }));
                        }
                        return null;
                    }

                    // format the output
                    callback(null, (typeof data[index].outputFormatter === 'function') ? data[index].outputFormatter(item.result) : item.result, index);
                });
            });

        // SYNC
        } else {
            var result = provider.send(payload);

            if(!utils.isArray(data)) {
                callback(new Error({
                    status: status,
                    error: result,
                    message: provider.name +' didn\'t repsond with an array of method responses'
                }));
                return;
            }

            result = result.map(function(item, index){

                if (!jsonrpc.isValidResponse(item)) {
                    if(typeof item === 'object' && item.error && item.error.message)
                        console.error(item.error.message);
                    return null;
                }

                // format the output
                return (typeof data[index].outputFormatter === 'function') ? data[index].outputFormatter(item.result) : item.result;
            });

            return (result.length === 1) ? result[0] : result;
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
        if(polls.length > 0) {
            var data = [];
            polls.forEach(function (item) {
                data.push(item.data);
            });

            // send async
            send(data, function(error, result, index){
                if (!(result instanceof Array) || result.length === 0) {
                    return;
                }
                polls[index].callback(result);
            });
        }
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

