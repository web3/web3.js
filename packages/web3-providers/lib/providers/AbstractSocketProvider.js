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
 * @file AbstractSocketProvider
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2018
 */

import EventEmitter from 'eventemitter3';
import JsonRpcMapper from '../../src/mappers/JsonRpcMapper';

export default class AbstractSocketProvider extends EventEmitter {
    /**
     * @param {WsReconnector|EthereumProvider} connection
     * @param {Number} timeout
     *
     * @constructor
     */
    constructor(connection, timeout) {
        super();
        this.connection = connection;
        this.timeout = timeout;
        this.subscriptions = [];
        this.registerEventListeners();
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() { }

    /**
     * Will close the socket connection with a error code and reason.
     * Please have a look at https://developer.mozilla.org/de/docs/Web/API/WebSocket/close
     * for further information.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    disconnect(code, reason) { }

    /**
     * Returns true if the socket connection state is OPEN
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() { }

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
    send(method, parameters) { }

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
    sendBatch(methods, moduleInstance) { }

    /**
     * Emits the open event with the event the provider got of the current socket connection.
     *
     * @method onOpen
     *
     * @param {Event} event
     */
    onOpen(event) {
        this.emit('open', event);
    }

    /**
     * Emits the error event and removes all listeners.
     *
     * @method onError
     *
     * @param {Event} error
     */
    onError(error) {
        this.emit('error', error);
        this.removeAllListeners();
    }

    /**
     * Emits the close event and removes all listeners.
     *
     * @method onClose
     */
    onClose() {
        this.emit('close');
        this.removeAllListeners();
    }

    /**
     * Emits the connect event.
     *
     * @method onConnect
     */
    onConnect() {
        this.emit('connect');
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {String} response
     */
    onMessage(response) {
        this.parseResponse(response).forEach(result => {
            let id = null;
            if (isArray(result)) {
                id = result[0].id;
            } else if (result.method && result.method.indexOf('_subscription') !== -1) {
                id = result.params.subscription;
                result = result.params.result;
            } else {
                id = result.id;
            }

            this.emit(id, result);
        });
    }

    /**
     * Will parse the response and make an array out of it.
     *
     * @method parseResponse
     *
     * @param {String} data
     */
    parseResponse(data) {
        let result = null,
            lastChunk;

        const returnValues = [],
            dechunkedData = data
                .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
                .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
                .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
                .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
                .split('|--|');

        dechunkedData.forEach(data => {
            // prepend the last chunk
            if (lastChunk) {
                data = lastChunk + data;
            }

            try {
                result = JSON.parse(data);
            } catch (e) {
                lastChunk = data;

                let lastChunkTimeout = setTimeout(() => {
                    _this._timeout();
                    throw errors.InvalidResponse(data);
                }, 1000 * 15);

                return;
            }

            // cancel timeout and set chunk to null
            clearTimeout(lastChunkTimeout);
            lastChunk = null;

            if (result) {
                returnValues.push(result);
            }

        });

        return returnValues;
    }

    /**
     * Resets the providers, clears all callbacks
     *
     * @method reset
     */
    reset() {
        this.removeAllListeners();
        this.registerEventListeners();
    }

    /**
     * Subscribes to a given subscriptionType
     *
     * @method subscribe
     *
     * @param {String} subscribeMethod
     * @param {String} subscriptionMethod
     * @param {Array} parameters
     *
     * @returns {Promise<String|Error>}
     */
    subscribe(subscribeMethod = 'eth_subscribe', subscriptionMethod, parameters) {
        parameters.unshift(subscriptionMethod);

        return this.send(subscribeMethod, parameters)
            .then(subscriptionId => {
                this.subscriptions.push(subscriptionId);

                return subscriptionId;
            }).catch(error => {
                throw new Error(`Provider error: ${error}`);
            });
    }

    /**
     * Unsubscribes the subscription by his id
     *
     * @method unsubscribe
     *
     * @param {String} subscriptionId
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    unsubscribe(subscriptionId, unsubscribeMethod = 'eth_unsubscribe') {
        return this.send(unsubscribeMethod, [subscriptionId])
            .then(response => {
                if (response) {
                    this.removeAllListeners(subscriptionId);
                    delete this.subscriptions[this.subscriptions.indexOf(subscriptionId)];
                }

                return response;
            });
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions(unsubscribeMethod = 'eth_unsubscribe') {
        let unsubscribePromises = [];

        this.subscriptions.forEach(subscriptionId => {
            unsubscribePromises.push(this.unsubscribe(subscriptionId, unsubscribeMethod));
        });

        return Promise.all(unsubscribePromises).then(results => {
            if (results.includes(false)) {
                throw Error(`Could not unsubscribe all subscriptions: ${JSON.stringify(results)}`);
            }

            this.subscriptions = [];

            return true;
        });
    }

    /**
     * Checks if the given subscription id exists
     *
     * @method hasSubscription
     *
     * @param {String} subscriptionId
     *
     * @returns {Boolean}
     */
    hasSubscription(subscriptionId) {
        return this.subscriptions.indexOf(subscriptionId) > -1;
    }
}
