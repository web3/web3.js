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
 * @file index.js
 * @authors: Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isArray from 'underscore-es/isArray';
import isFunction from 'underscore-es/isObject';
import oboe from 'oboe';

export default class IpcProvider {
    /**
     * TODO: Be sure the fixes of PR #1966 are also implemented for the IPCProvider.
     * @param {String} path
     * @param {Net} net
     *
     * @constructor
     */
    constructor(path, net) {
        this.responseCallbacks = {};
        this.subscriptionCallbacks = [];
        this.path = path;
        this.connected = false;
        this.connection = net.connect({path: this.path});

        this.addDefaultEvents();
        this.registerListener();
    }

    /**
     * Registers the socketListener
     *
     * @method registerListener
     */
    registerListener() {
        // use oboe.js for Sockets
        if (net.constructor.name === 'Socket') {
            oboe(this.connection).done(this.socketListener);
        } else {
            this.connection.on('data', (data) => {
                this.parseResponse(data.toString()).forEach(this.socketListener);
            });
        }
    }

    /**
     * This method is listening to the IPC socket.
     *
     * @method socketListener
     *
     * @param {any} result
     */
    socketListener(result) {
        let id = null;

        // Sets the ID which matches the returned ID
        if (isArray(result)) {
            result.forEach(load => {
                if (this.responseCallbacks[load.id]) {
                    id = load.id;
                }
            });
        } else {
            id = result.id;
        }

        // Subscriptions
        if (!id && result.method.indexOf('_subscription') !== -1) {
            this.subscriptionCallbacks.forEach((callback) => {
                if (isFunction(callback)) {
                    callback(result);
                }
            });

            return;
        }

        if (this.responseCallbacks[id]) {
            this.responseCallbacks[id](false, result);
            delete this.responseCallbacks[id];
        }
    }

    /**
     * Will add the error and end event to timeout existing calls
     *
     * @method addDefaultEvents
     */
    addDefaultEvents() {
        this.connection.on('connect', () => {
            this.connected = true;
        });

        this.connection.on('close', () => {
            this.connected = false;
        });

        this.connection.on('error', () => {// TODO: Check error types and handling
            this.timeout();
        });

        this.connection.on('end', () => {
            this.timeout();
        });

        this.connection.on('timeout', () => {
            this.timeout();
        });
    }

    /**
     * Will parse the response and make an array out of it.
     * NOTE, this exists for backwards compatibility reasons.
     *
     * @method parseResponse
     *
     * @param {String} data
     *
     * @returns {Array}
     */
    parseResponse(data) {
        const returnValues = [];

        // DE-CHUNKER
        const dechunkedData = data
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data) => {
            let result = null;

            // prepend the last chunk
            if (this.lastChunk) {
                data = this.lastChunk + data;
            }

            try {
                result = JSON.parse(data);
            } catch (error) {
                this.lastChunk = data;

                // start timeout to cancel all requests
                clearTimeout(this.lastChunkTimeout);

                this.lastChunkTimeout = setTimeout(() => {
                    this.timeout();
                    throw new Error(`Invalid response detected in IpcProvider: ${data}`);
                }, 1000 * 15);

                return;
            }

            // cancel timeout and set chunk to null
            clearTimeout(this.lastChunkTimeout);
            this.lastChunk = null;

            if (result) {
                returnValues.push(result);
            }
        });

        return returnValues;
    }

    /**
     * Get the adds a callback to the responseCallbacks object,
     * which will be called if a response matching the response Id will arrive.
     *
     * @method addResponseCallback
     *
     * @callback callback callback(error, result)
     */
    addResponseCallback(payload, callback) {
        const id = payload.id || payload[0].id;
        const method = payload.method || payload[0].method;

        this.responseCallbacks[id] = callback;
        this.responseCallbacks[id].method = method;
    }

    /**
     * TODO: Check: Why does it remove all callbacks on a timeout?
     * Timeout all requests when the end/error event is fired
     *
     * @method timeout
     */
    timeout() {
        for (const key in this.responseCallbacks) {
            if (this.responseCallbacks.hasOwnProperty(key)) {
                this.responseCallbacks[key](new Error('Timeout error in IpcProvider.'), null);
                delete this.responseCallbacks[key];
            }
        }
    }

    /**
     * Try to reconnect
     *
     * @method reconnect
     */
    reconnect() {
        this.connection.connect({path: this.path});
    }

    /**
     * Sends the JSON-RPC request
     *
     * @method send
     *
     * @param {Object} payload
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    send(payload, callback) {
        // try reconnect, when connection is gone
        if (!this.connection.writable) {
            this.connection.connect({path: this.path});
        }

        this.connection.write(JSON.stringify(payload));
        this.addResponseCallback(payload, callback);
    }

    /**
     * Registers a listener for the given event.
     *
     * @method on
     *
     * @param {String} type 'notification', 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    on(type, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('The second parameter "callback" must be of type Function.');
        }

        if (type === 'data') {
            this.subscriptionCallbacks.push(callback);

            return;
        }

        this.connection.on(type, callback);
    }

    /**
     * Register a listener for just one call.
     *
     * @method on
     *
     * @param {String} type 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    once(type, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('The second parameter "callback" must be of type Function.');
        }

        this.connection.once(type, callback);
    }

    /**
     * Removes an event listener or a subscription
     *
     * @method removeListener
     *
     * @param {String} type 'data', 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    removeListener(type, callback) {
        if (type === 'data') {
            // TODO: I don't think this is the behavior we would like to have
            this.subscriptionCallbacks.forEach((cb, index) => {
                if (cb === callback) {
                    this.subscriptionCallbacks.splice(index, 1);
                }
            });

            return;
        }

        this.connection.removeListener(type, callback);
    }

    /**
     * Removes all event listeners and subscriptions
     *
     * @method removeAllListeners
     *
     * @param {String} type 'data', 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    removeAllListeners(type, callback) {
        if (type === 'data') {
            this.subscriptionCallbacks = [];

            return;
        }

        this.connection.removeAllListeners(type, callback);
    }

    /**
     * Clears all subscriptions and callbacks.
     *
     * @method reset
     */
    reset() {
        this.subscriptionCallbacks = [];
        this.timeout();
        this.removeAllListeners('error');
        this.removeAllListeners('end');
        this.removeAllListeners('timeout');
        this.addDefaultEvents();
    }
}
