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

export default class AbstractSocketProvider extends EventEmitter {
    /**
     * @param {WebSocket|Socket|EthereumProvider} connection
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
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() { }

    /**
     * Removes all listeners on the EventEmitter and the socket object.
     *
     * @method removeAllListeners
     *
     * @param {String} event
     */
    removeAllListeners(event) {
        if (!event) {
            this.connection.removeAllListeners();
        }

        super.removeAllListeners(event);
    }

    /**
     * Closes the socket connection.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    disconnect(code, reason) { }

    /**
     * Returns true if the socket is connected
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() { }

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
    send(method, parameters) { }

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
    sendBatch(methods, moduleInstance) { }

    /**
     * Emits the ready event when the connection is established
     *
     * @method onReady
     *
     * @param {Event} event
     */
    onReady(event) {
        this.emit('ready', event);
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
     *
     * @param {Event|Error} error
     */
    onClose(error = null) {
        this.emit('close', error);
        this.removeAllListeners();
    }

    /**
     * Emits the connect event and checks if there are subscriptions defined that should be resubscribed.
     *
     * @method onConnect
     */
    async onConnect() {
        if (this.subscriptions.length > 0) {
            let subscriptionId;

            for (let subscription of this.subscriptions) {
                subscriptionId = await this.subscribe(
                    subscripton.subscribeMethod,
                    subscripton.parameters[0],
                    subscripton.parameters.slice(1)
                );

                delete this.subscriptions[subscriptionId];

                this.subscriptions[this.getSubscriptionEvent(subscription.id)].id = subscriptionId;
            }
        }

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
            let event;

            if (isArray(result)) {
                event = result[0].id;
            } else if (typeof result.id === 'undefined') {
                event = this.getSubscriptionEvent(result.params.subscription);
                result = result.params;
            } else {
                event = result.id;
            }

            this.emit(event, result);
        });
    }

    /**
     * Will parse the response and make an array out of it.
     *
     * @method parseResponse
     *
     * @param {String} data
     *
     * @returns {Array}
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
                this.subscriptions[subscriptionId] = {
                    id: subscriptionId,
                    subscribeMethod: subscribeMethod,
                    parameters: parameters
                };

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
        if (this.hasSubscription(subscriptionId)) {
            return this.send(unsubscribeMethod, [subscriptionId])
                .then(response => {
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

        this.subscriptions.keys().forEach(key => {
            super.removeAllListeners(key);
            unsubscribePromises.push(this.unsubscribe(this.subscriptions[key].id, unsubscribeMethod));
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
        return typeof this.getSubscription(subscriptionId) !== 'undefined';
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
        this.subscriptions.keys(key => {
            if(this.subscriptions[key].id === subscriptionId) {
                event = key;
            }
        });

        return event;
    }
}
