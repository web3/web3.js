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
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

'use strict';


var _ = require('underscore');
var errors = require('web3-core-helpers').errors;
var Jsonrpc = require('./jsonrpc.js');
var BatchManager = require('./batch.js');
var givenProvider = require('./givenProvider.js');

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 * Singleton
 *
 * @param {string|Object}provider
 * @param {Net.Socket} net
 *
 * @constructor
 */
var RequestManager = function RequestManager(provider, net) {
    this.provider = null;
    this.providers = RequestManager.providers;

    this.setProvider(provider, net);
    this.subscriptions = new Map();
};


RequestManager.givenProvider = givenProvider;

RequestManager.providers = {
    WebsocketProvider: require('web3-providers-ws'),
    HttpProvider: require('web3-providers-http'),
    IpcProvider: require('web3-providers-ipc')
};


/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 *
 * @param {Object} provider
 * @param {net.Socket} net
 *
 * @returns void
 */
RequestManager.prototype.setProvider = function (provider, net) {
    var _this = this;

    // autodetect provider
    if (provider && typeof provider === 'string' && this.providers) {

        // HTTP
        if (/^http(s)?:\/\//i.test(provider)) {
            provider = new this.providers.HttpProvider(provider);

            // WS
        } else if (/^ws(s)?:\/\//i.test(provider)) {
            provider = new this.providers.WebsocketProvider(provider);

            // IPC
        } else if (provider && typeof net === 'object' && typeof net.connect === 'function') {
            provider = new this.providers.IpcProvider(provider, net);

        } else if (provider) {
            throw new Error('Can\'t autodetect provider for "' + provider + '"');
        }
    }


    // reset the old one before changing, if still connected
    if (this.provider && this.provider.connected)
        this.clearSubscriptions();

    this.provider = provider || null;

    // listen to incoming notifications
    if (this.provider && this.provider.on) {
        this.provider.on('data', function data(result, deprecatedResult) {
            result = result || deprecatedResult; // this is for possible old providers, which may had the error first handler

            // check for result.method, to prevent old providers errors to pass as result
            if (result.method && _this.subscriptions.has(result.params.subscription)) {
                _this.subscriptions.get(result.params.subscription).callback(null, result.params.result);
            }
        });

        // resubscribe if the provider has reconnected
        this.provider.on('connect', function connect() {
            _this.subscriptions.forEach(function (subscription) {
                subscription.subscription.resubscribe();
            });
        });

        // notify all subscriptions about the error condition
        this.provider.on('error', function error(error) {
            _this.subscriptions.forEach(function (subscription) {
                subscription.callback(error);
            });
        });

        // notify all subscriptions about bad close conditions
        this.provider.on('close', function close(event) {
            if (!_this._isCleanCloseEvent(event) || _this._isIpcCloseError(event)){
                _this.subscriptions.forEach(function (subscription) {
                    subscription.callback(errors.ConnectionCloseError(event));
                    _this.subscriptions.delete(subscription.subscription.id);
                });
            }
        });

        // TODO add end, timeout??
    }
};

/**
 * TODO: This method should be implemented with a Promise instead of a callback
 *
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object} data
 * @param {Function} callback
 */
RequestManager.prototype.send = function (data, callback) {
    callback = callback || function () {
    };

    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toPayload(data.method, data.params);
    this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, function (err, result) {
        if (result && result.id && payload.id !== result.id) return callback(new Error('Wrong response id "' + result.id + '" (expected: "' + payload.id + '") in ' + JSON.stringify(payload)));

        if (err) {
            return callback(err);
        }

        if (result && result.error) {
            return callback(errors.ErrorResponse(result));
        }

        if (!Jsonrpc.isValidResponse(result)) {
            return callback(errors.InvalidResponse(result));
        }

        callback(null, result.result);
    });
};

/**
 * TODO: This method should be implemented with a Promise instead of a callback
 *
 * Should be called to asynchronously send batch request
 *
 * @method sendBatch
 * @param {Array} data - array of payload objects
 * @param {Function} callback
 */
RequestManager.prototype.sendBatch = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toBatchPayload(data);
    this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, function (err, results) {
        if (err) {
            return callback(err);
        }

        if (!_.isArray(results)) {
            return callback(errors.InvalidResponse(results));
        }

        callback(null, results);
    });
};


/**
 * Waits for notifications
 *
 * @method addSubscription
 * @param {Subscription} subscription         the subscription
 * @param {String} type         the subscription namespace (eth, personal, etc)
 * @param {Function} callback   the callback to call for incoming notifications
 */
RequestManager.prototype.addSubscription = function (subscription, callback) {
    if (this.provider.on) {
        this.subscriptions.set(
            subscription.id,
            {
                callback: callback,
                subscription: subscription
            }
        );
    } else {
        throw new Error('The provider doesn\'t support subscriptions: ' + this.provider.constructor.name);
    }
};

/**
 * Waits for notifications
 *
 * @method removeSubscription
 * @param {String} id           the subscription id
 * @param {Function} callback   fired once the subscription is removed
 */
RequestManager.prototype.removeSubscription = function (id, callback) {
    if (this.subscriptions.has(id)) {
        var type = this.subscriptions.get(id).subscription.options.type;

        // remove subscription first to avoid reentry
        this.subscriptions.delete(id);

        // then, try to actually unsubscribe
        this.send({
            method: type + '_unsubscribe',
            params: [id]
        }, callback);

        return;
    }

    if (typeof callback === 'function') {
        // call the callback if the subscription was already removed
        callback(null);
    }
};

/**
 * Should be called to reset the subscriptions
 *
 * @method reset
 */
RequestManager.prototype.clearSubscriptions = function (keepIsSyncing) {
    var _this = this;

    // uninstall all subscriptions
    if (this.subscriptions.size > 0) {
        this.subscriptions.forEach(function (value, id) {
            if (!keepIsSyncing || value.name !== 'syncing')
                _this.removeSubscription(id);
        });
    }

    //  reset notification callbacks etc.
    if (this.provider.reset)
        this.provider.reset();
};

/**
 * Evaluates WS close event
 *
 * @method _isCleanClose
 *
 * @param {CloseEvent | boolean} event WS close event or exception flag
 *
 * @returns {boolean}
 */
RequestManager.prototype._isCleanCloseEvent = function (event) {
    return typeof event === 'object' && ([1000].includes(event.code) || event.wasClean === true);
};

/**
 * Detects Ipc close error. The node.net module emits ('close', isException)
 *
 * @method _isIpcCloseError
 *
 * @param {CloseEvent | boolean} event WS close event or exception flag
 *
 * @returns {boolean}
 */
RequestManager.prototype._isIpcCloseError = function (event) {
    return typeof event === 'boolean' && event;
};

module.exports = {
    Manager: RequestManager,
    BatchManager: BatchManager
};
