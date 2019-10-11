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
 * @date 2015
 */

var errors = require('web3-core-helpers').errors;
var XHR2 = require('xhr2-cookies').XMLHttpRequest; // jshint ignore: line
var http = require('http');
var https = require('https');


/**
 * HttpProvider should be used to send rpc calls over http
 */
var HttpProvider = function HttpProvider(host, options) {
    options = options || {};

    var keepAlive = (options.keepAlive === true || options.keepAlive !== false) ? true : false;
    this.host = host || 'http://localhost:8545';
    if (this.host.substring(0,5) === "https") {
        this.httpsAgent = new https.Agent({ keepAlive: keepAlive });
    } else {
        this.httpAgent = new http.Agent({ keepAlive: keepAlive });
    }

    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent || this.agent;
    this.connected = false;
};

HttpProvider.prototype._prepareRequest = function(){
    var request;

    // the current runtime is a browser
    if (typeof XMLHttpRequest !== 'undefined') {
        request = new XMLHttpRequest();
    } else {
        request = new XHR2();
        request.nodejsSet({
            httpsAgent:this.httpsAgent,
            httpAgent:this.httpAgent
        });
    }

    request.open('POST', this.host, true);
    request.setRequestHeader('Content-Type','application/json');
    request.timeout = this.timeout;
    request.withCredentials = this.withCredentials;

    if(this.headers) {
        this.headers.forEach(function(header) {
            request.setRequestHeader(header.name, header.value);
        });
    }

    return request;
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function (payload, callback) {
    var _this = this;
    var request = this._prepareRequest();

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.timeout !== 1) {
            var result = request.responseText;
            var error = null;

            try {
                result = JSON.parse(result);
            } catch(e) {
                error = errors.InvalidResponse(request.responseText);
            }

            _this.connected = true;
            callback(error, result);
        }
    };

    request.ontimeout = function() {
        _this.connected = false;
        callback(errors.ConnectionTimeout(this.timeout));
    };

    try {
        request.send(JSON.stringify(payload));
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
