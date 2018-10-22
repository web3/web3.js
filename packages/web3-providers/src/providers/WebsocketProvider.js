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
 * @file WebsocketProvider.js
 * @authors: Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import {isArray, isFunction} from 'underscore';
import {errors} from 'web3-core-helpers';

let Ws = null;
let _btoa = null;
let parseURL = null;
if (typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined') {
    Ws = (url, protocols) => {
        return new window.WebSocket(url, protocols);
    };
    _btoa = btoa;
    parseURL = (url) => {
        return new URL(url);
    };
} else {
    Ws = require('websocket').w3cwebsocket;
    _btoa = (str) => {
        return Buffer(str).toString('base64');
    };
    const url = require('url');
    if (url.URL) {
        // Use the new Node 6+ API for parsing URLs that supports username/password
        const NewURL = url.URL;
        parseURL = (url) => {
            return new NewURL(url);
        };
    } else {
        // Web3 supports Node.js 5, so fall back to the legacy URL API if necessary
        parseURL = require('url').parse;
    }
}

export default class WebsocketProvider {
    /**
     * Default connection ws://localhost:8546
     *
     * @param {String} url
     * @param {Object} options
     *
     * @constructor
     */
    constructor(url, options) {
        this.responseCallbacks = {};
        this.notificationCallbacks = [];
        this.path = url;

        options = options || {};
        this._customTimeout = options.timeout;

        // The w3cwebsocket implementation does not support Basic Auth
        // username/password in the URL. So generate the basic auth header, and
        // pass through with any additional headers supplied in constructor
        const parsedURL = parseURL(url);
        const headers = options.headers || {};
        const protocol = options.protocol || undefined;
        if (parsedURL.username && parsedURL.password) {
            headers.authorization = `Basic ${_btoa(`${parsedURL.username}:${parsedURL.password}`)}`;
        }

        // Allow a custom client configuration
        const clientConfig = options.clientConfig || undefined;

        // When all node core implementations that do not have the
        // WHATWG compatible URL parser go out of service this line can be removed.
        if (parsedURL.auth) {
            headers.authorization = `Basic ${_btoa(parsedURL.auth)}`;
        }
        this.connection = new Ws(url, protocol, undefined, headers, undefined, clientConfig);

        this.addDefaultEvents();

        // LISTEN FOR CONNECTION RESPONSES
        this.connection.addEventListener('message', (e) => {
            const data = typeof e.data === 'string' ? e.data : '';

            this._parseResponse(data).forEach((result) => {
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
                if (!id && result && result.method && result.method.indexOf('_subscription') !== -1) {
                    this.notificationCallbacks.forEach((callback) => {
                        if (isFunction(callback)) callback(result);
                    });

                    // fire the callback
                } else if (this.responseCallbacks[id]) {
                    this.responseCallbacks[id](null, result);
                    delete this.responseCallbacks[id];
                }
            });
        });

        // make property `connected` which will return the current connection status
        Object.defineProperty(this, 'connected', {
            get() {
                return this.connection && this.connection.readyState === this.connection.OPEN;
            },
            enumerable: true
        });
    }

    /**
     * Will add the error and end event to timeout existing calls
     *
     * @method addDefaultEvents
     */
    addDefaultEvents() {
        this.connection.addEventListener('error', () => {
            this._timeout();
        });

        this.connection.onclose = () => {
            this._timeout();

            // reset all requests and callbacks
            this.reset();
        };

        // this.connection.on('timeout', function(){
        //     this._timeout();
        // });
    }

    /**
     * Will parse the response and make an array out of it.
     *
     * @method _parseResponse
     *
     * @param {String} data
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
            // prepend the last chunk
            if (this.lastChunk) data = this.lastChunk + data;

            let result = null;

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

            if (result) returnValues.push(result);
        });

        return returnValues;
    }

    /**
     * Adds a callback to the responseCallbacks object,
     * which will be called if a response matching the response Id will arrive.
     *
     * @method _addResponseCallback
     *
     * @param {Object} payload
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    _addResponseCallback(payload, callback) {
        const id = payload.id || payload[0].id;
        const method = payload.method || payload[0].method;

        this.responseCallbacks[id] = callback;
        this.responseCallbacks[id].method = method;

        // schedule triggering the error response if a custom timeout is set
        if (this._customTimeout) {
            setTimeout(() => {
                if (this.responseCallbacks[id]) {
                    this.responseCallbacks[id](errors.ConnectionTimeout(this._customTimeout));
                    delete this.responseCallbacks[id];
                }
            }, this._customTimeout);
        }
    }

    /**
     * Timeout all requests when the end/error event is fired
     *
     * @method _timeout
     */
    _timeout() {
        for (const key in this.responseCallbacks) {
            if (this.responseCallbacks.hasOwnProperty(key)) {
                this.responseCallbacks[key](errors.InvalidConnection('on WS'));
                delete this.responseCallbacks[key];
            }
        }
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
        if (this.connection.readyState === this.connection.CONNECTING) {
            setTimeout(() => {
                this.send(payload, callback);
            }, 10);
            return;
        }

        // try reconnect, when connection is gone
        // if(!this.connection.writable)
        //     this.connection.connect({url: this.url});
        if (this.connection.readyState !== this.connection.OPEN) {
            console.error('connection not open on send()');
            if (typeof this.connection.onerror === 'function') {
                this.connection.onerror(new Error('connection not open'));
            } else {
                console.error('no error callback');
            }
            callback(new Error('connection not open'));
            return;
        }

        this.connection.send(JSON.stringify(payload));
        this._addResponseCallback(payload, callback);
    }

    /**
     * Subscribes to provider events.provider
     *
     * @method on
     *
     * @param {String} type 'notifcation', 'connect', 'error', 'end' or 'data'
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    on(type, callback) {
        if (typeof callback !== 'function') throw new Error('The second parameter callback must be a function.');

        switch (type) {
            case 'data':
                this.notificationCallbacks.push(callback);
                break;

            case 'connect':
                this.connection.addEventListener('open', callback);
                break;

            case 'end':
                this.connection.onclose = callback;
                break;

            case 'error':
                this.connection.addEventListener('error', callback);
                break;

            // default:
            //     this.connection.on(type, callback);
            //     break;
        }
    }

    // TODO: add once

    /**
     * Removes event listener
     *
     * @method removeListener
     *
     * @param {String} type 'notifcation', 'connect', 'error', 'end' or 'data'
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

            // TODO remvoving connect missing

            // default:
            //     this.connection.removeListener(type, callback);
            //     break;
        }
    }

    /**
     * Removes all event listeners
     *
     * @method removeAllListeners
     *
     * @param {String} type 'notifcation', 'connect', 'error', 'end' or 'data'
     *
     * @callback callback callback(error, result)
     */
    removeAllListeners(type) {
        // TODO remvoving connect properly missing
        switch (type) {
            case 'data':
                this.notificationCallbacks = [];
                break;
            case 'connect':
                this.connection.addEventListener('open', null);
                break;
            case 'end':
                this.connection.onclose = null;
                break;
            case 'error':
                this.connection.addEventListener('error', null);
                break;
            default:
                // this.connection.removeAllListeners(type);
                break;
        }
    }

    /**
     * Resets the providers, clears all callbacks
     *
     * @method reset
     *
     * @callback callback callback(error, result)
     */
    reset() {
        this._timeout();
        this.notificationCallbacks = [];

        // this.connection.removeAllListeners('error');
        // this.connection.removeAllListeners('end');
        // this.connection.removeAllListeners('timeout');

        this.addDefaultEvents();
    }

    /**
     * Will close the socket connection
     *
     * @method disconnect
     */
    disconnect() {
        if (this.connection) {
            this.connection.close();
        }
    }
}
