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
 *   Samuel Furter <samuel@ethereum.org>
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2015
 */

import {errors} from 'web3-core-helpers';
import {XMLHttpRequest} from 'xhr2-cookies';
import http from 'http';
import https from 'https';
import JsonRpcMapper from '../mappers/JsonRpcMapper';

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
     * @method prepareRequest
     *
     * @returns {XMLHttpRequest}
     */
    prepareRequest() {
        const request = new XMLHttpRequest();
        request.nodejsSet({
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent
        });

        request.open('POST', this.host, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.timeout = this.timeout || 0;
        request.withCredentials = true;

        if (this.headers) {
            this.headers.forEach((header) => {
                request.setRequestHeader(header.name, header.value);
            });
        }

        return request;
    }

    /**
     * Sends the JSON-RPC request
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    send(method, parameters) {
        return new Promise((resolve, reject) => {
            const request = this.prepareRequest();

            request.onreadystatechange = () => {
                if (request.readyState !== 0 && request.readyState !== 1) {
                    this.connected = true;
                }

                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    try {
                        resolve(JSON.parse(request.responseText));
                    } catch (error) {
                        reject(new Error(`Invalid JSON as response: ${request.responseText}`));
                    }
                }
            };

            request.ontimeout = () => {
                this.connected = false;
                reject(new Error(`CONNECTION: Timeout exceeded after ${this.timeout}ms`));
            };

            try {
                const payload = JsonRpcMapper.toPayload(method, parameters);
                request.send(JSON.stringify(payload));
            } catch (error) {
                if (error.constructor.name === 'NetworkError') {
                    this.connected = false;
                }

                reject(error);
            }
        });
    }

    /**
     * Added this method to have a better error message if someone is trying to create a subscription with this provider.
     */
    subscribe() {
        throw Error('Subscriptions are not supported with the HttpProvider.');
    }

    /**
     * Added this method to have a better error message if someone is trying to unsubscribe with this provider.
     */
    unsubscribe() {
        throw Error('Subscriptions are not supported with the HttpProvider.');
    }

    /**
     * This method has to exists to have the same interface as the socket providers.
     */
    disconnect() {
        return true;
    }
}
