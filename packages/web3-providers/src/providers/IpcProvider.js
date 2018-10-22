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

import {isArray, isFunction} from 'underscore';
import {errors} from 'web3-core-helpers';
import oboe from 'oboe';

export default class IpcProvider {
    /**
     * @param {String} path
     * @param {Net} net
     *
     * @constructor
     */
    constructor(path, net) {
        this.responseCallbacks = {};
        this.notificationCallbacks = [];
        this.path = path;
        this.connected = false;

        this.connection = net.connect({path: this.path});

        this.addDefaultEvents();

        // LISTEN FOR CONNECTION RESPONSES
        const callback = (result) => {
            let id = null;

            // get the id which matches the returned id
            if (isArray(result)) {
                result.forEach((load) => {
                    if (this.responseCallbacks[load.id]) id = load.id;
                });
            } else {
                id = result.id;
            }

            // notification
            if (!id && result.method.indexOf('_subscription') !== -1) {
                this.notificationCallbacks.forEach((callback) => {
                    if (isFunction(callback)) callback(result);
                });

                // fire the callback
            } else if (this.responseCallbacks[id]) {
                this.responseCallbacks[id](null, result);
                delete this.responseCallbacks[id];
            }
        };

        // use oboe.js for Sockets
        if (net.constructor.name === 'Socket') {
            oboe(this.connection).done(callback);
        } else {
            this.connection.on('data', (data) => {
                this._parseResponse(data.toString()).forEach(callback);
            });
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

        this.connection.on('error', () => {
            this._timeout();
        });

        this.connection.on('end', () => {
            this._timeout();
        });

        this.connection.on('timeout', () => {
            this._timeout();
        });
    }

    /**
     * Will parse the response and make an array out of it.
     * NOTE, this exists for backwards compatibility reasons.
     *
     * @method _parseResponse
     *
     * @param {String} data
     *
     * @returns {Array}
     */
    _parseResponse(data) {
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
                    this._timeout();
                    throw errors.InvalidResponse(data);
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
     * @method _addResponseCallback
     *
     * @callback callback callback(error, result)
     */
    _addResponseCallback(payload, callback) {
        const id = payload.id || payload[0].id;
        const method = payload.method || payload[0].method;

        this.responseCallbacks[id] = callback;
        this.responseCallbacks[id].method = method;
    }

    /**
     * Timeout all requests when the end/error event is fired
     *
     * @method _timeout
     */
    _timeout() {
        for (const key in this.responseCallbacks) {
            if (this.responseCallbacks.hasOwnProperty(key)) {
                this.responseCallbacks[key](errors.InvalidConnection('on IPC'));
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
     * Sends the JSON-RPC the request
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
        this._addResponseCallback(payload, callback);
    }

    /**
     * Subscribes to provider events.provider
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
            throw new TypeError('The second parameter callback must be a function.');
        }

        switch (type) {
            case 'data':
                this.notificationCallbacks.push(callback);
                break;

            // adds error, end, timeout, connect
            default:
                this.connection.on(type, callback);
                break;
        }
    }

    /**
     * Subscribes to provider events.provider
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
            throw new TypeError('The second parameter callback must be a function.');
        }

        this.connection.once(type, callback);
    }

    /**
     * Removes event listener
     *
     * @method removeListener
     *
     * @param {String} type 'data', 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    removeListener(type, callback) {
        switch (type) {
            case 'data':
                this.notificationCallbacks.forEach((cb, index) => {
                    if (cb === callback) this.notificationCallbacks.splice(index, 1);
                });
                break;

            default:
                this.connection.removeListener(type, callback);
                break;
        }
    }

    /**
     * Removes all event listeners
     *
     * @method removeAllListeners
     *
     * @param {String} type 'data', 'connect', 'error', 'end' or 'data'
     *
     * @callback callback callback(error, result)
     */
    removeAllListeners(type) {
        switch (type) {
            case 'data':
                this.notificationCallbacks = [];
                break;

            default:
                this.connection.removeAllListeners(type);
                break;
        }
    }

    /**
     * Resets the providers, clears all callbacks
     *
     * @method reset
     */
    reset() {
        this._timeout();
        this.notificationCallbacks = [];

        this.connection.removeAllListeners('error');
        this.connection.removeAllListeners('end');
        this.connection.removeAllListeners('timeout');

        this.addDefaultEvents();
    }
}
