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
 * @file HttpProvider.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import http from 'http';
import https from 'https';
import JsonRpcMapper from '../mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

export default class HttpProvider {
    /**
     * @param {String} host
     * @param {Object} options
     * @param {ProvidersModuleFactory} providersModuleFactory
     *
     * @constructor
     */
    constructor(host = 'http://localhost:8545', options = {}, providersModuleFactory) {
        this.host = host;
        this.timeout = options.timeout || 0;
        this.headers = options.headers;
        this.connected = true;
        this.providersModuleFactory = providersModuleFactory;
        this.agent = {};

        let keepAlive = false;
        if (options.keepAlive === true || options.keepAlive !== false) {
            keepAlive = true;
        }

        if (host.substring(0, 5) === 'https') {
            this.agent['httpsAgent'] = new https.Agent({keepAlive});
        } else {
            this.agent['httpAgent'] = new http.Agent({keepAlive});
        }
    }

    /**
     * Added this method to have a better error message if someone is trying to create a subscription with this provider.
     */
    subscribe() {
        throw new Error('Subscriptions are not supported with the HttpProvider.');
    }

    /**
     * Added this method to have a better error message if someone is trying to unsubscribe with this provider.
     */
    unsubscribe() {
        throw new Error('Subscriptions are not supported with the HttpProvider.');
    }

    /**
     * This method has to exists to have the same interface as the socket providers.
     *
     * @method disconnect
     *
     * @returns {Boolean}
     */
    disconnect() {
        return true;
    }

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    send(method, parameters) {
        return this.sendPayload(JsonRpcMapper.toPayload(method, parameters)).then((response) => {
            const validationResult = JsonRpcResponseValidator.validate(response);

            if (validationResult instanceof Error) {
                throw validationResult;
            }

            return response.result;
        });
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns Promise<Object|Error>
     */
    sendBatch(methods, moduleInstance) {
        let payload = [];

        methods.forEach((method) => {
            method.beforeExecution(moduleInstance);
            payload.push(JsonRpcMapper.toPayload(method.rpcMethod, method.parameters));
        });

        return this.sendPayload(payload);
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method sendPayload
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            const request = this.providersModuleFactory.createXMLHttpRequest(
                this.host,
                this.timeout,
                this.headers,
                this.agent
            );

            request.onreadystatechange = () => {
                if (request.readyState !== 0 && request.readyState !== 1) {
                    this.connected = true;
                }

                if (request.readyState === 4) {
                    if (request.status === 200) {
                        try {
                            return resolve(JSON.parse(request.responseText));
                        } catch (error) {
                            reject(new Error(`Invalid JSON as response: ${request.responseText}`));
                        }
                    }

                    if (request.response === null && request.status === 0) {
                        reject(new Error(`Connection refused or URL couldn't be resolved: ${this.host}`));
                    }
                }
            };

            request.ontimeout = () => {
                this.connected = false;

                reject(new Error(`Connection error: Timeout exceeded after ${this.timeout}ms`));
            };

            try {
                request.send(JSON.stringify(payload));
            } catch (error) {
                if (error.constructor.name === 'NetworkError') {
                    this.connected = false;
                }

                reject(error);
            }
        });
    }
}
