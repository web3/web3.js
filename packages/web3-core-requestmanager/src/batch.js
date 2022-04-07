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
 * @file batch.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

"use strict";

var Jsonrpc = require('./jsonrpc');
var errors = require('web3-core-helpers').errors;

var Batch = function (requestManager) {
    this.requestManager = requestManager;
    this.requests = [];
};

/**
 * Should be called to add create new request to batch request
 *
 * @method add
 * @param {Object} jsonrpc requet object
 */
Batch.prototype.add = function (request) {
    this.requests.push(request);
};

/**
 * Should be called to execute batch request
 *
 * @method execute
 */
Batch.prototype.execute = function () {
    var requests = this.requests;
    var sortResponses = this._sortResponses.bind(this);

    this.requestManager.sendBatch(requests, function (err, results) {
        results = sortResponses(results);
        requests.map(function (request, index) {
            return results[index] || {};
        }).forEach(function (result, index) {
            if (requests[index].callback) {
                if (result && result.error) {
                    return requests[index].callback(errors.ErrorResponse(result));
                }

                if (!Jsonrpc.isValidResponse(result)) {
                    return requests[index].callback(errors.InvalidResponse(result));
                }

                try {
                    requests[index].callback(null, requests[index].format ? requests[index].format(result.result) : result.result);
                } catch (err) {
                    requests[index].callback(err);
                }
            }
        });
    });
};

// Sort responses
Batch.prototype._sortResponses = function (responses) {    
    return (responses || []).sort((a, b) => a.id - b.id);
}

module.exports = Batch;

