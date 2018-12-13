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
 * @file AbstractProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import JsonRpcMapper from '../../src/mappers/JsonRpcMapper.js';
import JsonRpcResponseValidator from '../../src/validators/JsonRpcResponseValidator.js';
import EventEmitter from 'eventemitter3';

export default class AbstractProviderAdapter extends EventEmitter {
    /**
     * @param {Object} provider
     *
     * @constructor
     */
    constructor(provider) {
        super();
        this.provider = provider;
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
        const payload = JsonRpcMapper.toPayload(method, parameters);

        return new Promise((resolve, reject) => {
            this.provider.send(payload, (error, response) => {
                this.handleResponse(reject, resolve, error, response, payload);
            });
        });
    }

    /**
     * Sends batch payload
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns Promise<Object|Error>
     */
    sendBatch(methods, moduleInstance) {
        return new Promise((resolve, reject) => {
            let payload = [];

            methods.forEach(method => {
                method.beforeExecution(moduleInstance);

                payload.push(JsonRpcMapper.toPayload(method.rpcMethod, method.parameters));
            });

            this.provider.send(payload, (error, response) => {
                if (error) {
                    reject(error);
                }

                resolve(response);
            });
        });
    }

    /**
     * Returns Promise with an error if the method is not overwritten
     *
     * @method subscribe
     *
     * @returns {Promise<Error>}
     */
    subscribe() {
        return new Promise((resolve, reject) => {
            reject(new Error(`The current provider does not support subscriptions: ${this.provider.constructor.name}`));
        });
    }

    /**
     * Returns Promise with an error if the method is not overwritten
     *
     * @method unsubscribe
     *
     * @returns {Promise<Error>}
     */
    unsubscribe() {
        return new Promise((resolve, reject) => {
            reject(new Error(`The current provider does not support subscriptions: ${this.provider.constructor.name}`));
        });
    }

    /**
     * Handles the JSON-RPC response
     *
     * @method handleResponse
     *
     * @param {Function} reject
     * @param {Function} resolve
     * @param {Object} error
     * @param {Object} response
     * @param {Object} payload
     */
    handleResponse(reject, resolve, error, response, payload) {
        if (response) {
            if (response.id && payload.id !== response.id) {
                reject(
                    new Error(
                        `Wrong response id "${response.id}" (expected: "${payload.id}") in ${JSON.stringify(payload)}`
                    )
                );

                return;
            }

            if (response.error) {
                let errorMessage = `Returned error: ${JSON.stringify(response)}`;

                if (response.error.message) {
                    errorMessage = `Returned error: ${response.error.message}`;
                }

                reject(new Error(errorMessage));

                return;
            }

            if (!JsonRpcResponseValidator.validate(response)) {
                reject(new Error(`Invalid JSON RPC response: ${JSON.stringify(response)}`));

                return;
            }

            resolve(response.result);

            return;
        }

        if (error) {
            reject(error);
        }
    }

    /**
     * Checks if the provider is connected
     *
     * @method isConnected
     *
     * @returns {Boolean}
     */
    isConnected() {
        return this.provider.connected;
    }
}
