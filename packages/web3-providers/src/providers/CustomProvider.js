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
 * @file CustomProvider.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */
import JsonRpcMapper from '../mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

export default class CustomProvider {
    /**
     * @param {Object} connection
     *
     * @constructor
     */
    constructor(connection) {
        this.host = 'CustomProvider';
        this.connection = connection;
        this.checkConnectionMethods();
    }

    /**
     * Checks if the given custom provider does have the required methods
     *
     * @method checkConnectionMethods
     *
     * @returns {Boolean}
     */
    checkConnectionMethods() {
        if (this.connection.send || this.connection.sendAsync) {
            return true;
        }

        throw new Error('Invalid provider injected!');
    }

    /**
     * Added this method to have a better error message if someone is trying to create a subscription with this provider.
     */
    subscribe() {
        throw new Error('Subscriptions are not supported with the CustomProvider.');
    }

    /**
     * Added this method to have a better error message if someone is trying to unsubscribe with this provider.
     */
    unsubscribe() {
        throw new Error('Subscriptions are not supported with the CustomProvider.');
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
    async send(method, parameters) {
        const response = await this.sendPayload(JsonRpcMapper.toPayload(method, parameters));
        const validationResult = JsonRpcResponseValidator.validate(response);

        if (validationResult instanceof Error) {
            throw validationResult;
        }

        return response.result;
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns Promise<Object[]>
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
            if (this.connection.sendAsync) {
                this.connection.sendAsync(payload, (error, response) => {
                    if (!error) {
                        resolve(response);
                    }

                    reject(error);
                });

                return;
            }

            this.connection.send(payload, (error, response) => {
                if (!error) {
                    resolve(response);
                }

                reject(error);
            });
        });
    }
}
