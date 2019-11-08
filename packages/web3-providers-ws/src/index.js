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
    this._customTimeout = options.timeout || 1000 * 15;
    this.headers = options.headers || {};
    this.protocol = options.protocol || undefined;
    this.reconnectOptions = options.reconnect || false;
    this.reconnectOptions.delay = this.reconnectOptions.delay || 5000;
    this.reconnectOptions.maxAttempts = this.reconnectOptions.maxAttempts || false;
    this.reconnectOptions.onTimeout = this.reconnectOptions.onTimeout || false;
    this.clientConfig = options.clientConfig || undefined; // Allow a custom client configuration
    this.requestOptions = options.requestOptions || undefined; // Allow a custom request options (https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#connectrequesturl-requestedprotocols-origin-headers-requestoptions)

    this.DATA = 'data';
    this.CLOSE = 'close';
    this.ERROR = 'error';
    this.OPEN = 'open';
    this.RECONNECT = 'reconnect';

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
 * @method _onMessage
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onMessage = function(e) {
    var _this = this;

    this._parseResponse((typeof e.data === 'string') ? e.data : '').forEach(function(result) {
        if (result.method && result.method.indexOf('_subscription') !== -1) {
            _this.emit(this.DATA, result);

            return;
        }

        var id = result.id;

        // get the id which matches the returned id
        if (Array.isArray(result)) {
            id = result[0].id;
        }

        _this.emit(id, result);
    });
};

/**
 * Listener for the `error` event of the underlying WebSocket object
 *
 * @method _onError
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onError = function(error) {
    if (!error.code) {
        this.emit(this.ERROR, error);

        if (this.requestQueue.size > 0) {
            var _this = this;

            this.requestQueue.forEach(function(request) {
                request.callback(error);
                _this.requestQueue.delete(request);
            });
        }

        this._removeSocketListeners();
    }
};

/**
 * Listener for the `open` event of the underlying WebSocket object
 *
 * @method _onConnect
 *
 * @returns {void}
 */
WebsocketProvider.prototype._onConnect = function() {
    this.emit(this.OPEN);
    this.reconnectAttempts = 0;

    if (this.requestQueue.size > 0) {
        var _this = this;

        this.requestQueue.forEach(function(request) {
            _this.send(request.payload, request.callback);
            _this.requestQueue.delete(request);
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
WebsocketProvider.prototype._onClose = function(event) {
    if (this.reconnectOptions && (![1000, 1001].includes(event.code) || event.wasClean === false)) {
        this.reconnect();

        return;
    }

    this.emit(this.CLOSE, error);

    if (this.requestQueue.size > 0) {
        var _this = this;

        this.requestQueue.forEach(function(request) {
            request.callback(new Error('The current connection got closed before the request got executed.'));
            _this.requestQueue.delete(request);
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
WebsocketProvider.prototype._addSocketListeners = function() {
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
WebsocketProvider.prototype._removeSocketListeners = function() {
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
WebsocketProvider.prototype._parseResponse = function(data) {
    var _this = this,
        returnValues = [];

    // DE-CHUNKER
    var dechunkedData = data
        .replace(/\}[\n\r]?\{/g,'}|--|{') // }{
        .replace(/\}\][\n\r]?\[\{/g,'}]|--|[{') // }][{
        .replace(/\}[\n\r]?\[\{/g,'}|--|[{') // }[{
        .replace(/\}\][\n\r]?\{/g,'}]|--|{') // }]{
        .split('|--|');

    dechunkedData.forEach(function(data){

        // prepend the last chunk
        if(_this.lastChunk)
            data = _this.lastChunk + data;

        var result = null;

        try {
            result = JSON.parse(data);

        } catch(e) {

            _this.lastChunk = data;

            // start timeout to cancel all requests
            clearTimeout(_this.lastChunkTimeout);
            _this.lastChunkTimeout = setTimeout(function(){
                if(_this.requestOptions && _this.requestOptions.onTimeout) {
                    _this.reconnect();

                    return;
                }

                _this.emit(_this.ERROR, new Error('Connection error: Timeout exceeded'));
            }, _this._customTimeout);

            return;
        }

        // cancel timeout and set chunk to null
        clearTimeout(_this.lastChunkTimeout);
        _this.lastChunk = null;

        if(result)
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
    var _this = this;

    if (this.connection.readyState === this.connection.CONNECTING) {
        this.requestQueue.add({payload: payload, callback: callback});

        return;
    }

    if (this.connection.readyState !== this.connection.OPEN) {
        if (typeof this.connection.onerror === 'function') {
            this.connection.onerror(new Error('connection not open on send()'));
        } else {
            console.error('no error callback');
        }

        callback(new Error('connection not open on send()'));

        return;
    }

    var id = payload.id;

    if (Array.isArray(payload)) {
        id = payload[0].id;
    }

    const errorCallback = function(error) {
        _this.removeAllListeners(id);
        callback(error);
    };

    this.once(this.ERROR, errorCallback)
        .once(id, function(response) {
            _this.removeListener(_this.ERROR, errorCallback);

            callback(null, response);
        });

    try {
        this.connection.send(JSON.stringify(payload));
    } catch (error) {
        callback(error);
    }
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
    code = code || 1000;

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

    if (
        !this.reconnectOptions.maxAttempts ||
        this.reconnectAttempts < this.reconnectOptions.maxAttempts
    ) {
        setTimeout(function() {
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
