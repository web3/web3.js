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
 * @authors: Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2019
 */

'use strict';

var _ = require('underscore');
var errors = require('web3-core-helpers').errors;
var Ws = require('websocket').w3cwebsocket;
var EventEmitter = require('eventemitter3');
var helpers = require('./helpers.js');

/**
 * @param {string} url
 * @param {Object} options
 *
 * @constructor
 */
var WebsocketProvider = function WebsocketProvider(url, options) {
    options = options || {};
    this._customTimeout = options.timeout;
    this.headers = options.headers || {};
    this.protocol = options.protocol || undefined;
    this.autoReconnect = options.autoReconnect;
    this.reconnectDelay = options.reconnectDelay || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || false;

    this.DATA = 'data';
    this.CLOSE = 'close';
    this.ERROR = 'error';
    this.OPEN = 'open';

    this.reconnecting = false;
    this.connection = null;
    this.requestQueue = new Set();
    this.reconnectAttempts = 0;

    // The w3cwebsocket implementation does not support Basic Auth
    // username/password in the URL. So generate the basic auth header, and
    // pass through with any additional headers supplied in constructor
    var parsedURL = helpers.parseURL(url);
    if (parsedURL.username && parsedURL.password) {
        this.headers.authorization = 'Basic ' + helpers.btoa(parsedURL.username + ':' + parsedURL.password);
    }

    // Allow a custom client configuration
    this.clientConfig = options.clientConfig || undefined;

    // Allow a custom request options
    // https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#connectrequesturl-requestedprotocols-origin-headers-requestoptions
    this.requestOptions = options.requestOptions || undefined;

    // When all node core implementations that do not have the
    // WHATWG compatible URL parser go out of service this line can be removed.
    if (parsedURL.auth) {
        this.headers.authorization = 'Basic ' + helpers.btoa(parsedURL.auth);
    }

    // make property `connected` which will return the current connection status
    Object.defineProperty(this, 'connected', {
        get: function() {
            return this.connection && this.connection.readyState === this.connection.OPEN;
        },
        enumerable: true
    });

    this.connect();
};

// Inherit from EventEmitter
WebsocketProvider.prototype = new EventEmitter();

/**
 * Connects to the configured node
 *
 * @method connect
 *
 * @returns {void}
 */
WebsocketProvider.prototype.connect = function() {
    this.connection = new Ws(this.url, this.protocol, undefined, this.headers, this.requestOptions, this.clientConfig);
    this._addSocketListeners();
};

/**
 * Listener for the `data` event of the underlying WebSocket object
 *
 * @method onMessage
 *
 * @returns {void}
 */
WebsocketProvider.prototype.onMessage = function(e) {
    var _this = this;

    this._parseResponse((typeof e.data === 'string') ? e.data : '').forEach(function(result) {
        if (result.method && result.method.indexOf('_subscription') !== -1) {
            _this.emit('data', result);

            return;
        }

        var id = result.id;

        // get the id which matches the returned id
        if (isArray(result)) {
            id = result[0].id;
        }

        _this.emit(id, result);
    });
};

/**
 * Listener for the `error` event of the underlying WebSocket object
 *
 * @method onError
 *
 * @returns {void}
 */
WebsocketProvider.prototype.onError = function(error) {
    this.emit(this.ERROR, error);

    this._removeAllSocketListeners();
};

/**
 * Listener for the `open` event of the underlying WebSocket object
 *
 * @method onConnect
 *
 * @returns {void}
 */
WebsocketProvider.prototype.onConnect = function() {
    this.reconnecting = false;
    this.emit(this.OPEN);

    if (this.requestQueue.size > 0) {
        var _this = this;

        this.requestQueue.forEach(function(request) {
            _this.send(request.payload, request.callback);
            _this.removeListener('error', request.callback);
            _this.requestQueue.delete(request);
        });
    }
};

/**
 * Listener for the `close` event of the underlying WebSocket object
 *
 * @method onClose
 *
 * @returns {void}
 */
WebsocketProvider.prototype.onClose = function(event) {
    if (this.autoReconnect && (event.code !== 1000 || event.wasClean === false)) {
        this.reconnect();

        return;
    }

    this.emit(this.CLOSE, error);

    if (this.requestQueue.size > 0) {
        var _this = this;

        this.requestQueue.forEach(function(request) {
            request.callback(new Error('connection not open on send()'));
            _this.removeListener('error', request.callback);
            _this.requestQueue.delete(request);
        });
    }

    this._removeAllSocketListeners();
    this.removeAllListeners();
};

/**
 * Will add the required socket listeners
 *
 * @method _addSocketListeners
 *
 * @returns {void}
 */
WebsocketProvider.prototype._addSocketListeners = function() {
    this.connection.addEventListener('message', this.onMessage.bind(this));
    this.connection.addEventListener('open', this.onConnect.bind(this));
    this.connection.addEventListener('close', this.onClose.bind(this));
    this.connection.addEventListener('error', this.onError.bind(this));
};

/**
 * Will remove all socket listeners
 *
 * @method _removeAllSocketListeners
 *
 * @returns {void}
 */
WebsocketProvider.prototype._removeAllSocketListeners = function() {
    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('open', this.onConnect);
    this.connection.removeEventListener('close', this.onClose);
    this.connection.removeEventListener('error', this.onError);
};

/**
 * Will parse the response and make an array out of it.
 *
 * @method _parseResponse
 *
 * @param {String} data
 *
 * @returns {Array}
 */
WebsocketProvider.prototype._parseResponse = function(data) {
    var _this = this,
        returnValues = [];

    // DE-CHUNKER
    var dechunkedData = data
        .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
        .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
        .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
        .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
        .split('|--|');

    dechunkedData.forEach(function(data) {

        // prepend the last chunk
        if (_this.lastChunk)
            data = _this.lastChunk + data;

        var result = null;

        try {
            result = JSON.parse(data);

        } catch (e) {

            _this.lastChunk = data;

            // start timeout to cancel all requests
            clearTimeout(_this.lastChunkTimeout);
            _this.lastChunkTimeout = setTimeout(function() {
                _this.emit('error', errors.InvalidResponse(data));
            }, 1000 * 15);

            return;
        }

        // cancel timeout and set chunk to null
        clearTimeout(_this.lastChunkTimeout);
        _this.lastChunk = null;

        if (result)
            returnValues.push(result);
    });

    return returnValues;
};

/**
 * Does check if the provider is connecting and will add it to the queue or will send it directly
 *
 * @method send
 *
 * @param {Object} payload
 * @param {Function} callback
 *
 * @returns {void}
 */
WebsocketProvider.prototype.send = function(payload, callback) {
    this.once('error', callback);

    if (this.connection.readyState === this.connection.CONNECTING) {
        this.requestQueue.add({payload: payload, callback: callback});

        return;
    }

    if (this.connection.readyState !== this.connection.OPEN) {
        this.removeListener('error', callback);

        if (typeof this.connection.onerror === 'function') {
            this.connection.onerror(new Error('connection not open on send()'));
        } else {
            console.error('no error callback');
        }

        callback(new Error('connection not open on send()'));

        return;
    }

    try {
        this.connection.send(JSON.stringify(payload));
    } catch (error) {
        this.removeListener('error', callback);

        callback(error);
        return;
    }

    var id = payload.id;

    if (isArray(payload)) {
        id = payload[0].id;
    }

    if (this._customTimeout) {
        var timeout = setTimeout(() => {
            this.removeListener('error', callback);
            this.removeAllListeners(id);

            callback(new Error('Connection error: Timeout exceeded'));
        }, this._customTimeout);
    }

    this.once(id, (response) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        this.removeListener('error', callback);

        callback(response);
    });
};

/**
 * Resets the providers, clears all callbacks
 *
 * @method reset
 *
 * @returns {void}
 */
WebsocketProvider.prototype.reset = function() {
    this.removeAllListeners();
    this._addSocketListeners();
};

/**
 * Closes the current connection with the given code and reason arguments
 *
 * @method disconnect
 *
 * @param {number} code
 * @param {string} reason
 *
 * @returns {void}
 */
WebsocketProvider.prototype.disconnect = function(code, reason) {
    if (this.connection) {
        this.connection.close(code, reason);
    }
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 *
 * @returns {boolean}
 */
WebsocketProvider.prototype.supportsSubscriptions = function() {
    return true;
};

/**
 * Removes the listeners and reconnects to the socket.
 *
 * @method reconnect
 *
 * @returns {void}
 */
WebsocketProvider.prototype.reconnect = function() {
    var _this = this;

    this.reconnecting = true;

    if (!this.maxReconnectAttempts || this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(function() {
            _this.reconnectAttempts++;
            _this._removeAllSocketListeners();
            _this.connect();
        }, this.reconnectDelay);

        return;
    }

    var error = new Error('Maximum number of reconnect attempts reached!');

    this.reconnecting = false;
    this.emit(this.ERROR, error);
};

module.exports = WebsocketProvider;
