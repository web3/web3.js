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
 * @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2015
 */

import {errors} from 'web3-core-helpers';
import {XMLHttpRequest as XHR2} from 'xhr2-cookies'; // jshint ignore: line
import http from 'http';
import https from 'https';

export default class HttpProvider {
    /**
     * @param {String} host
     * @param {Object} options
     *
     * @constructor
     */
    constructor(host, options = {}) {
        this.host = host || 'http://localhost:8545';

        if (this.host.substring(0, 5) === 'https') {
            this.httpsAgent = new https.Agent({keepAlive: true});
        } else {
            this.httpAgent = new http.Agent({keepAlive: true});
        }

        this.timeout = options.timeout || 0;
        this.headers = options.headers;
        this.connected = false;
    }

    /**
     * Prepares the HTTP request
     *
     * @private
     * @method _prepareRequest
     *
     * @returns {FakeXHR2}
     */
    _prepareRequest() {
        const request = new XHR2();
        request.nodejsSet({
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent
        });

        request.open('POST', this.host, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.timeout = this.timeout && this.timeout !== 1 ? this.timeout : 0;
        request.withCredentials = true;

        if (this.headers) {
            this.headers.forEach((header) => {
                request.setRequestHeader(header.name, header.value);
            });
        }

        return request;
    }

    /**
     * Should be used to make async request
     *
     * @method send
     *
     * @param {Object} payload
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    send(payload, callback) {
        const request = this._prepareRequest();

        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.timeout !== 1) {
                let result = request.responseText;
                let error = null;

                try {
                    result = JSON.parse(result);
                } catch (e) {
                    error = errors.InvalidResponse(request.responseText);
                }

                this.connected = true;
                callback(error, result);
            }
        };

        request.ontimeout = function() {
            this.connected = false;
            callback(errors.ConnectionTimeout(this.timeout));
        };

        try {
            request.send(JSON.stringify(payload));
        } catch (error) {
            this.connected = false;
            callback(errors.InvalidConnection(this.host));
        }
    }

    /**
     * If this method does not exist it will throw en error.
     */
    disconnect() {}
}
