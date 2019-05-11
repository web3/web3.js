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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import EventEmitter from 'eventemitter3';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import JsonRpcMapper from '../../src/mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../../src/validators/JsonRpcResponseValidator';

export default class AbstractSocketProvider extends EventEmitter {
    /**
     * @param {WebSocket|Socket|Web3EthereumProvider} connection
     * @param {Number} timeout
     *
     * @constructor
     */
    constructor(connection, timeout) {
        super();
        this.connection = connection;
        this.timeout = timeout;
        this.subscriptions = {};
        this.registerEventListeners();

        this.READY = 'ready';
        this.CONNECT = 'connect';
        this.ERROR = 'error';
        this.CLOSE = 'close';

        this.SOCKET_MESSAGE = 'socket_message';
        this.SOCKET_READY = 'socket_ready';
        this.SOCKET_CLOSE = 'socket_close';
        this.SOCKET_ERROR = 'socket_error';
        this.SOCKET_CONNECT = 'socket_connect';
        this.SOCKET_NETWORK_CHANGED = 'socket_networkChanged';
        this.SOCKET_ACCOUNTS_CHANGED = 'socket_accountsChanged';
    }

    /**
     * Method for checking subscriptions support of a internal provider
     *
     * @method supportsSubscriptions
     *
     * @returns {Boolean}
     */
    supportsSubscriptions() {
        return true;
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {}

    /**
     * Removes all socket listeners
     *
     * @method removeAllSocketListeners
     */
    removeAllSocketListeners() {
        this.removeAllListeners(this.SOCKET_MESSAGE);
        this.removeAllListeners(this.SOCKET_READY);
        this.removeAllListeners(this.SOCKET_CLOSE);
        this.removeAllListeners(this.SOCKET_ERROR);
        this.removeAllListeners(this.SOCKET_CONNECT);
    }

    /**
     * Closes the socket connection.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    disconnect(code, reason) {}

    /**
     * Returns true if the socket is connected
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() {}

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<Object>}
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
     * Emits the ready event when the connection is established
     *
     * @method onReady
     *
     * @param {Event} event
     */
    onReady(event) {
        this.emit(this.READY, event);
        this.emit(this.SOCKET_READY, event);
    }

    /**
     * Emits the error event and removes all listeners.
     *
     * @method onError
     *
     * @param {Event} error
     */
    onError(error) {
        this.emit(this.ERROR, error);
        this.emit(this.SOCKET_ERROR, error);
        this.removeAllSocketListeners();
        // this.removeAllListeners();
    }

    /**
     * Emits the close event and removes all listeners.
     *
     * @method onClose
     *
     * @param {Event|Error} error
     */
    onClose(error = null) {
        this.emit(this.CLOSE, error);
        this.emit(this.SOCKET_CLOSE, error);
        this.removeAllSocketListeners();
        this.removeAllListeners();
    }

    /**
     * Emits the connect event and checks if there are subscriptions defined that should be resubscribed.
     *
     * @method onConnect
     */
    async onConnect() {
        const subscriptionKeys = Object.keys(this.subscriptions);

        if (subscriptionKeys.length > 0) {
            let subscriptionId;

            for (let key of subscriptionKeys) {
                subscriptionId = await this.subscribe(
                    this.subscriptions[key].subscribeMethod,
                    this.subscriptions[key].parameters[0],
                    this.subscriptions[key].parameters.slice(1)
                );

                if (key !== subscriptionId) {
                    delete this.subscriptions[subscriptionId];
                }

                this.subscriptions[key].id = subscriptionId;
            }
        }

        this.emit(this.SOCKET_CONNECT);
        this.emit(this.CONNECT);
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {String} response
     */
    onMessage(response) {
        let event;

        if (!isObject(response)) {
            response = JSON.parse(response);
        }

        if (isArray(response)) {
            event = response[0].id;
        } else if (typeof response.id === 'undefined') {
            event = this.getSubscriptionEvent(response.params.subscription);
            response = response.params;
        } else {
            event = response.id;
        }

        this.emit(this.SOCKET_MESSAGE, response);
        this.emit(event, response);
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
            .then((subscriptionId) => {
                this.subscriptions[subscriptionId] = {
                    id: subscriptionId,
                    subscribeMethod: subscribeMethod,
                    parameters: parameters
                };

                return subscriptionId;
            })
            .catch((error) => {
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
        if (this.hasSubscription(subscriptionId)) {
            return this.send(unsubscribeMethod, [subscriptionId]).then((response) => {
                if (response) {
                    this.removeAllListeners(this.getSubscriptionEvent(subscriptionId));

                    delete this.subscriptions[subscriptionId];
                }

                return response;
            });
        }

        return Promise.reject(new Error(`Provider error: Subscription with ID ${subscriptionId} does not exist.`));
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

        Object.keys(this.subscriptions).forEach((key) => {
            this.removeAllListeners(key);
            unsubscribePromises.push(this.unsubscribe(this.subscriptions[key].id, unsubscribeMethod));
        });

        return Promise.all(unsubscribePromises).then((results) => {
            if (results.includes(false)) {
                throw new Error(`Could not unsubscribe all subscriptions: ${JSON.stringify(results)}`);
            }

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
        return typeof this.getSubscriptionEvent(subscriptionId) !== 'undefined';
    }

    /**
     * Returns the event the subscription is listening for.
     *
     * @method getSubscriptionEvent
     *
     * @param {String} subscriptionId
     *
     * @returns {String}
     */
    getSubscriptionEvent(subscriptionId) {
        if (this.subscriptions[subscriptionId]) {
            return subscriptionId;
        }

        let event;
        Object.keys(this.subscriptions).forEach((key) => {
            if (this.subscriptions[key].id === subscriptionId) {
                event = key;
            }
        });

        return event;
    }
}
