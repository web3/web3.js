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
/** @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   AyanamiTech <ayanami0330@protonmail.com>
 * @date 2015
 */

var errors = require('web3-core-helpers').errors;
var fetch = require('cross-fetch');
var http = require('http');
var https = require('https');

// Apply missing polyfill for IE
require('es6-promise').polyfill();
require('abortcontroller-polyfill/dist/polyfill-patch-fetch');

/**
 * HttpProvider should be used to send rpc calls over http
 */
var HttpProvider = function HttpProvider(host, options) {
    options = options || {};

    this.withCredentials = options.withCredentials;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;

    // keepAlive is true unless explicitly set to false
    var keepAlive = options.keepAlive !== false;
    this.host = host || 'http://localhost:8545';
    if (!this.agent) {
        if (this.host.substring(0,5) === "https") {
            this.httpsAgent = new https.Agent({ keepAlive });
        } else {
            this.httpAgent = new http.Agent({ keepAlive });
        }
    }
};

HttpProvider.prototype._prepareRequest = function(payload = {}){
    var options = {
      method: 'POST',
      body: JSON.stringify(payload)
    };
    var headers = {};
    var controller;

    if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
    } else if (typeof AbortController === 'undefined' && typeof window !== 'undefined' && typeof window.AbortController !== 'undefined') {
        // Some chrome version doesn't recognize new AbortController(); so we are using it from window instead
        // https://stackoverflow.com/questions/55718778/why-abortcontroller-is-not-defined
        controller = new window.AbortController();
    } else {
        // Disable user defined timeout
        this.timeout = 0;
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

    if(this.headers) {
        this.headers.forEach(function(header) {
            headers[header.name] = header.value;
        });
    }

    // Default headers
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included
    if (['include', 'same-origin', 'omit'].indexOf(this.withCredentials) !== -1) {
      options.credentials = this.withCredentials;
    }

    options.headers = headers;

    if (this.timeout > 0) {
        this.timeoutId = setTimeout(function() {
            controller.abort();
        }, this.timeout);
    }

    return fetch(this.host, options);
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function (payload, callback) {
    var request = this._prepareRequest.bind(this);

    var success = function(response) {
        if (this.timeoutId !== undefined) {
            clearTimeout(this.timeoutId);
        }
        var result = response;
        var isOk = result.ok;
        var error = null;

        try {
            // Response is a stream data so should be awaited for json response
            result.json().then(function(data) {
                result = data;
                if (!isOk) {
                    error = errors.InvalidResponse(data);
                }
                this.connected = true;
                callback(error, result);
            });
        } catch (e) {
            this.connected = true;
            callback(errors.InvalidResponse(result));
        }
    };

    var failed = function(error) {
        if (this.timeoutId !== undefined) {
            clearTimeout(this.timeoutId);
        }

        if (error.name === 'AbortError') {
            this.connected = false;
            callback(errors.ConnectionTimeout(this.timeout));
        }

        this.connected = true;
        callback(errors.InvalidConnection(this.host));
    }

    try {
        request(payload)
            .then(success.bind(this))
            .catch(failed.bind(this));
    } catch(error) {
        this.connected = false;
        callback(errors.InvalidConnection(this.host));
    }
};

HttpProvider.prototype.disconnect = function () {
    //NO OP
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 * @returns {boolean}
 */
HttpProvider.prototype.supportsSubscriptions = function () {
    return false;
};

module.exports = HttpProvider;
