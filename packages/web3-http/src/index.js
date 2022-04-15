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
/** @file http.js
 * @authors:
 *   Leon Talbert <leon@ens.domains>
 * @date 2022
 */

var errors = require('web3-core-helpers').errors;
var XHR2 = require('xhr2-cookies').XMLHttpRequest; // jshint ignore: line
var https = require('https');
var http = require('http');


var Http = function(options) {
    options = options || {};
    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 100000;
    this.headers = options.headers;
    this.connected = false;

    // keepAlive is true unless explicitly set to false
    const keepAlive = options.keepAlive !== false;

    this.httpsAgent = new https.Agent({ keepAlive });
    this.httpAgent = new http.Agent({ keepAlive });
};

Http.prototype._prepareRequest = function(){
    var request;

    // the current runtime is a browser
    if (typeof XMLHttpRequest !== 'undefined') {
        request = new XMLHttpRequest();
    } else {
        request = new XHR2();
        var agents = {httpsAgent: this.httpsAgent, httpAgent: this.httpAgent};
        if (this.agent) {
            agents.httpsAgent = this.agent.https;
            agents.httpAgent = this.agent.http;
        }
        request.nodejsSet(agents);
    }

    return request;
};

Http.prototype._sendRequest = function(queryUrl, method, payload) {
    return new Promise((resolve, reject) => {
        var _this = this;
        var request = this._prepareRequest(queryUrl);
        request.open(method, queryUrl, true);

        request.timeout = this.timeout;
        request.withCredentials = this.withCredentials;

        if (this.headers) {
            this.headers.forEach(function (header) {
                request.setRequestHeader(header.name, header.value);
            });
        }

        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.timeout !== 1) {
                var responseBody;

                if(request.getResponseHeader('content-type').includes('application/json')) {
                    try {
                        responseBody = JSON.parse(request.responseText);
                        request.responseBody = responseBody;
                    } catch(e) {
                        request.customError = 'Error parsing response body';
                        reject(request);
                    }
                }

                if(request.status >= 400) {
                    reject(request);
                }

                _this.connected = true;
                resolve(request);
            }
        };

        request.ontimeout = function() {
            _this.connected = false;
            reject(errors.ConnectionTimeout(this.timeout));
        };

        try {
            if (method === 'POST') {
                request.setRequestHeader('Content-Type','application/json');
                request.send(JSON.stringify(payload));
            } else {
                request.send();
            }
        } catch(error) {
            this.connected = false;
            reject(request);
        }
    });
};

Http.prototype.get = function(queryUrl) {
    return this._sendRequest(queryUrl, 'GET', {});
};

Http.prototype.post = function(queryUrl, payload= {}) {
    return this._sendRequest(queryUrl, 'POST', payload);
};

module.exports = { Http };
