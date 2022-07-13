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
/** @file batchprovider.js
 * @author: AyanamiTech <ayanami0330@protonmail.com>
 * @date 2022
 */

var errors = require('web3-core-helpers').errors;
var http = require('http');
var https = require('https');

// Apply missing polyfill for IE
require('cross-fetch/polyfill');
require('es6-promise').polyfill();
require('abortcontroller-polyfill/dist/polyfill-patch-fetch');

/**
 * BatchProvider should be used to aggregate and send rpc calls over http
 */
var BatchProvider = function BatchProvider(host, options) {
    options = options || {};

    this.withCredentials = options.withCredentials;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;
    this._pendingBatchAggregator = null;
    this._pendingBatch = null;

    // keepAlive is true unless explicitly set to false
    const keepAlive = options.keepAlive !== false;
    this.host = host || 'http://localhost:8545';
    if (!this.agent) {
        if (this.host.substring(0,5) === "https") {
            this.httpsAgent = new https.Agent({ keepAlive });
        } else {
            this.httpAgent = new http.Agent({ keepAlive });
        }
    }
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
BatchProvider.prototype.send = function (payload, callback) {
    var options = {
        method: 'POST'
    };
    var headers = {};
    var controller;

    if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
    } else if (typeof window !== 'undefined' && typeof window.AbortController !== 'undefined') {
        // Some chrome version doesn't recognize new AbortController(); so we are using it from window instead
        // https://stackoverflow.com/questions/55718778/why-abortcontroller-is-not-defined
        controller = new window.AbortController();
    }

    if (typeof controller !== 'undefined') {
        options.signal = controller.signal;
    }

    // the current runtime is node
    if (typeof XMLHttpRequest === 'undefined') {
        // https://github.com/node-fetch/node-fetch#custom-agent
        var agents = {httpsAgent: this.httpsAgent, httpAgent: this.httpAgent};

        if (this.agent) {
            agents.httpsAgent = this.agent.https;
            agents.httpAgent = this.agent.http;
        }

        if (this.host.substring(0,5) === "https") {
            options.agent = agents.httpsAgent;
        } else {
            options.agent = agents.httpAgent;
        }
    }

    if (this.headers) {
        this.headers.forEach(function (header) {
            headers[header.name] = header.value;
        });
    }

    // Default headers
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // As the Fetch API supports the credentials as following options 'include', 'omit', 'same-origin'
    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials
    // To avoid breaking change in 1.x we override this value based on boolean option.
    if (this.withCredentials) {
        options.credentials = 'include';
    } else {
        options.credentials = 'omit';
    }

    options.headers = headers;

    if (this.timeout > 0 && typeof controller !== 'undefined') {
        this.timeoutId = setTimeout(function () {
            controller.abort();
        }, this.timeout);
    }

    // BatchProvider related codes
    if (this._pendingBatch == null) {
        this._pendingBatch = [];
    }

    var inflightRequest = { request: payload, resolve: null, reject: null };

    var promise = new Promise((resolve, reject) => {
        inflightRequest.resolve = resolve;
        inflightRequest.reject = reject;
    });

    this._pendingBatch.push(inflightRequest);

    if (!this._pendingBatchAggregator) {
        // Schedule batch for next event loop + short duration
        this._pendingBatchAggregator = setTimeout(function () {
            // Get teh current batch and clear it, so new requests
            // go into the next batch
            var array = [];
            var batch = Object.assign(array, this._pendingBatch);
            this._pendingBatch = null;
            this._pendingBatchAggregator = null;

            // Get the request as an array of requests
            var request = batch.map(function (inflight) {return inflight.request});

            var success = function (response) {
                if (this.timeoutId !== undefined) {
                    clearTimeout(this.timeoutId);
                }

                response.json().then(function (data) {
                    if (!Array.isArray(data) || data.length === 1) {
                        var payload = data;
                        if (Array.isArray(data)) {
                            payload = data[0];
                        }

                        batch.forEach(function (inflightRequest) {
                            inflightRequest.resolve(payload);
                        });
                    } else {
                        // For each data, feed it to the correct Promise, depending
                        // on whether it was a success or error
                        batch.forEach(function (inflightRequest, index) {
                            var payload = data[index];
                            inflightRequest.resolve(payload);
                        });
                    }
                }).catch(function (error) {
                    inflightRequest.reject(errors.InvalidResponse(error));
                });
            };

            var failed = function (error) {
                if (this.timeoutId !== undefined) {
                    clearTimeout(this.timeoutId);
                }

                if (error.name === 'AbortError') {
                    inflightRequest.reject(errors.ConnectionTimeout(this.timeout));
                }

                inflightRequest.reject(errors.InvalidConnection(this.host));
            };

            return fetch(this.host, {...options, body: JSON.stringify(request)})
                .then(success.bind(this))
                .catch(failed.bind(this));
        }.bind(this));
    }

    promise.then(function (result) {
        callback(null, result);
    }).catch(function (error) {
        callback(error);
    });
};

BatchProvider.prototype.disconnect = function () {
    //NO OP
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 * @returns {boolean}
 */
BatchProvider.prototype.supportsSubscriptions = function () {
    return false;
};

module.exports = BatchProvider;
