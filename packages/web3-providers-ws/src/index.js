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

var EventEmitter = require('eventemitter3');
var helpers = require('./helpers.js');
var Ws = require('@web3-js/websocket').w3cwebsocket;

/**
 * @param {string} url
 * @param {Object} options
 *
 * @constructor
 */
var WebsocketProvider = function WebsocketProvider(url, options) {
    EventEmitter.call(this);

    options = options || {};
    this.url = url;
    this._customTimeout = options.timeout || 1000 * 15;
    this.headers = options.headers || {};
    this.protocol = options.protocol || undefined;
    this.reconnectOptions = Object.assign({
            auto: false,
            delay: 5000,
            maxAttempts: false,
            onTimeout: false
        },
        options.reconnect
    );
    this.clientConfig = options.clientConfig || undefined; // Allow a custom client configuration
    this.requestOptions = options.requestOptions || undefined; // Allow a custom request options (https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#connectrequesturl-requestedprotocols-origin-headers-requestoptions)

    this.DATA = 'data';
    this.CLOSE = 'close';
    this.ERROR = 'error';
    this.CONNECT = 'connect';
    this.RECONNECT = 'reconnect';

    this.connection = null;
    this.requestQueue = new Map();
    this.responseQueue = new Map();
    this.reconnectAttempts = 0;
    this.reconnecting = false;

    // The w3cwebsocket implementation does not support Basic Auth
    // username/password in the URL. So generate the basic auth header, and
    // pass through with any additional headers supplied in constructor
    var parsedURL = helpers.parseURL(url);
    if (parsedURL.username && parsedURL.password) {
        this.headers.authorization = 'Basic ' + helpers.btoa(parsedURL.username + ':' + parsedURL.password);
    }

    // When all node core implementations that do not have the
    // WHATWG compatible URL parser go out of service this line can be removed.
    if (parsedURL.auth) {
        this.headers.authorization = 'Basic ' + helpers.btoa(parsedURL.auth);
    }

    // make property `connected` which will return the current connection status
    Object.defineProperty(this, 'connected', {
        get: function () {
            return this.connection && this.connection.readyState === this.connection.OPEN;
        },
        enumerable: true
    });

    this.connect();
};

// Inherit from EventEmitter
WebsocketProvider.prototype = EventEmitter.prototype;
WebsocketProvider.prototype.constructor = WebsocketProvider;

/**
 * Connects to the configured node
 *
 * @method connect
 *
 * @returns {void}
 */
WebsocketProvider.prototype.connect = function () {
    this.connection = new Ws(this.url, this.protocol, undefined, this.headers, this.requestOptions, this.clientConfig);
    this._addSocketListeners();
};

/**
 * Listener for the `data` event of the underlying WebSocket object
 *
 * @method _onMessage
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onMessage = function (e) {
    var _this = this;

    this._parseResponse((typeof e.data === 'string') ? e.data : '').forEach(function (result) {
        if (result.method && result.method.indexOf('_subscription') !== -1) {
            _this.emit(_this.DATA, result);

            return;
        }

        var id = result.id;

        // get the id which matches the returned id
        if (Array.isArray(result)) {
            id = result[0].id;
        }

        if (_this.responseQueue.has(id)) {
            _this.responseQueue.get(id).callback(false, result);
            _this.responseQueue.delete(id);
        }
    });
};

/**
 * Listener for the `error` event of the underlying WebSocket object
 *
 * @method _onError
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onError = function (error) {
    if (!error.code && !this.reconnecting) {
        var _this = this;

        this.emit(this.ERROR, error);

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(function (request, key) {
                request.callback(error);
                _this.requestQueue.delete(key);
            });
        }

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach(function (request, key) {
                request.callback(error);
                _this.responseQueue.delete(key);
            });
        }

        this._removeSocketListeners();
        this.removeAllListeners();
    }
};

/**
 * Listener for the `open` event of the underlying WebSocket object
 *
 * @method _onConnect
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onConnect = function () {
    this.emit(this.CONNECT);
    this.reconnectAttempts = 0;
    this.reconnecting = false;

    if (this.requestQueue.size > 0) {
        var _this = this;

        this.requestQueue.forEach(function (request, key) {
            _this.send(request.payload, request.callback);
            _this.requestQueue.delete(key);
        });
    }
};

/**
 * Listener for the `close` event of the underlying WebSocket object
 *
 * @method _onClose
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onClose = function (event) {
    var _this = this;

    if (this.reconnectOptions.auto && (![1000, 1001].includes(event.code) || event.wasClean === false)) {
        this.reconnect();

        return;
    }

    this.emit(this.CLOSE, event);

    if (this.requestQueue.size > 0) {
        this.requestQueue.forEach(function (request, key) {
            request.callback(new Error('CONNECTION ERROR: The connection got closed with close code `' + event.code + '` and the following reason string `' + event.reason + '`'));
            _this.requestQueue.delete(key);
        });
    }

    if (this.responseQueue.size > 0) {
        this.responseQueue.forEach(function (request, key) {
            request.callback(new Error('CONNECTION ERROR: The connection got closed with close code `' + event.code + '` and the following reason string `' + event.reason + '`'));
            _this.responseQueue.delete(key);
        });
    }

    this._removeSocketListeners();
    this.removeAllListeners();
};

/**
 * Will add the required socket listeners
 *
 * @method _addSocketListeners
 *
 * @returns {void}
 */
WebsocketProvider.prototype._addSocketListeners = function () {
    this.connection.addEventListener('message', this._onMessage.bind(this));
    this.connection.addEventListener('open', this._onConnect.bind(this));
    this.connection.addEventListener('close', this._onClose.bind(this));
    this.connection.addEventListener('error', this._onError.bind(this));
};

/**
 * Will remove all socket listeners
 *
 * @method _removeSocketListeners
 *
 * @returns {void}
 */
WebsocketProvider.prototype._removeSocketListeners = function () {
    this.connection.removeEventListener('message', this._onMessage);
    this.connection.removeEventListener('open', this._onConnect);
    this.connection.removeEventListener('close', this._onClose);
    this.connection.removeEventListener('error', this._onError);
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
WebsocketProvider.prototype._parseResponse = function (data) {
    var _this = this,
        returnValues = [];

    // DE-CHUNKER
    var dechunkedData = data
        .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
        .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
        .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
        .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
        .split('|--|');

    dechunkedData.forEach(function (data) {

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
            _this.lastChunkTimeout = setTimeout(function () {
                if (_this.reconnectOptions.auto && _this.reconnectOptions.onTimeout) {
                    _this.reconnect();

                    return;
                }

                var error = new Error('Connection error: Timeout exceeded');

                _this.emit(_this.ERROR, error);

                if (_this.requestQueue.size > 0) {
                    _this.requestQueue.forEach(function (request, key) {
                        request.callback(error);
                        _this.requestQueue.delete(key);
                    });
                }
            }, _this._customTimeout);

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
WebsocketProvider.prototype.send = function (payload, callback) {
    var _this = this;
    var id = payload.id;
    var request = {payload: payload, callback: callback};

    if (Array.isArray(payload)) {
        id = payload[0].id;
    }

    if (this.connection.readyState === this.connection.CONNECTING || this.reconnecting) {
        this.requestQueue.set(id, request);

        return;
    }

    if (this.connection.readyState !== this.connection.OPEN) {
        this.requestQueue.delete(id);

        var error = new Error('connection not open on send()');

        this.emit(this.ERROR, error);
        request.callback(error);

        return;
    }

    this.responseQueue.set(id, request);
    this.requestQueue.delete(id);

    try {
        this.connection.send(JSON.stringify(request.payload));
    } catch (error) {
        request.callback(error);
        _this.responseQueue.delete(id);
    }
};

/**
 * Resets the providers, clears all callbacks
 *
 * @method reset
 *
 * @returns {void}
 */
WebsocketProvider.prototype.reset = function () {
    this.removeAllListeners();
    this._removeSocketListeners();
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
WebsocketProvider.prototype.disconnect = function (code, reason) {
    this._removeSocketListeners();
    this.connection.close(code || 1000, reason);
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 *
 * @returns {boolean}
 */
WebsocketProvider.prototype.supportsSubscriptions = function () {
    return true;
};

/**
 * Removes the listeners and reconnects to the socket.
 *
 * @method reconnect
 *
 * @returns {void}
 */
WebsocketProvider.prototype.reconnect = function () {
    var _this = this;
    this.reconnecting = true;

    if (this.responseQueue.size > 0) {
        this.responseQueue.forEach(function (request, key) {
            request.callback(new Error('CONNECTION ERROR: Provider started to reconnect before the response got received!'));
            _this.responseQueue.delete(key);
        });
    }

    if (
        !this.reconnectOptions.maxAttempts ||
        this.reconnectAttempts < this.reconnectOptions.maxAttempts
    ) {
        setTimeout(function () {
            _this.reconnectAttempts++;
            _this._removeSocketListeners();
            _this.emit(_this.RECONNECT, _this.reconnectAttempts);
            _this.connect();
        }, this.reconnectOptions.delay);

        return;
    }

    this.emit(this.ERROR, new Error('Maximum number of reconnect attempts reached!'));
};

module.exports = WebsocketProvider;
