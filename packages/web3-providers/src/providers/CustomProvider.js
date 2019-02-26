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
import JsonRpcMapper from '../mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

/**
 * @file CustomProvider.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class CustomProvider {

    constructor(connection) {
        this.host = 'CustomProvider';
        this.connection = connection;
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
     *
     * @param payload
     * @returns {Promise}
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

            if (this.connection.send) {
                this.connection.send(payload, (error, response) => {
                    if (!error) {
                        resolve(response);
                    }

                    reject(error);
                });

                return;
            }

            reject(new Error('Invalid provider injected!'));
        });
    }
}
