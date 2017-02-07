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

"use strict";


var _ = require('underscore');
var Jsonrpc = require('./jsonrpc');
var errors = require('web3-core-helpers').errors;
var BatchManager = require('./batch');

var HttpProvider = require('./providers/httpprovider');
var IpcProvider = require('./providers/ipcprovider');
var WebsocketProvider = require('./providers/websocketprovider');

var providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider,
    WebsocketProvider: WebsocketProvider
};

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 * Singleton
 */
var RequestManager = function (provider) {
    this.setProvider(provider);
    this.subscriptions = {};

    this.providers = providers;
};

// expose providers
RequestManager.providers = providers;

/**
 * Should be used to synchronously send request
 *
 * @method send
 * @param {Object} data
 * @return {Object}
 */
RequestManager.prototype.sendSync = function (data) {
    if (!this.provider) {
        console.error(errors.InvalidProvider());
        return null;
    }

    var payload = Jsonrpc.toPayload(data.method, data.params);
    var result = this.provider.sendSync(payload);

    if (result && result.error) {
        return callback(errors.ErrorResponse(result));
    }

    if (!Jsonrpc.isValidResponse(result)) {
        throw errors.InvalidResponse(result);
    }

    return result.result;
};

/**
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object} data
 * @param {Function} callback
 */
RequestManager.prototype.send = function (data, callback) {
    callback = callback || function(){};

    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toPayload(data.method, data.params);
    this.provider.send(payload, function (err, result) {
        if(payload.id !== result.id) return callback(new Error('Wrong response id "'+ result.id +'" (expected: "'+ payload.id +'") in '+ JSON.stringify(payload)));

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
 * Should be called to asynchronously send batch request
 *
 * @method sendBatch
 * @param {Array} batch data
 * @param {Function} callback
 */
RequestManager.prototype.sendBatch = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.toBatchPayload(data);
    this.provider.send(payload, function (err, results) {
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
 * @param {String} id           the subscription id
 * @param {String} name         the subscription name
 * @param {String} type         the subscription namespace (eth, personal, etc)
 * @param {Function} callback   the callback to call for incoming notifications
 */
RequestManager.prototype.addSubscription = function (id, name, type, callback) {
    if(this.provider.on) {
        this.subscriptions[id] = {
            callback: callback,
            type: type,
            name: name
        };

    } else {
        throw new Error('This provider doesn\'t support subscriptions', this.provider);
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
    var _this = this;

    if(this.subscriptions[id]) {

        this.send({
            method: this.subscriptions[id].type + '_unsubscribe',
            params: [id]
        }, callback);

        // remove subscription
        delete _this.subscriptions[id];
    }
};

/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 * @param {Object}
 */
RequestManager.prototype.setProvider = function (p) {
    var _this = this;

    // reset the old one before changing
    if(this.provider)
        this.reset();

    this.provider = p;

    // listen to incoming notifications
    if(this.provider && this.provider.on) {
        this.provider.on('notification', function requestManagerNotification(err, result){
            if(!err) {
                if(_this.subscriptions[result.params.subscription] && _this.subscriptions[result.params.subscription].callback)
                    _this.subscriptions[result.params.subscription].callback(null, result.params.result);
            } else {

                Object.keys(_this.subscriptions).forEach(function(id){
                    if(_this.subscriptions[id].callback)
                        _this.subscriptions[id].callback(err);
                });
            }
        });
    }
};

/**
 * Should be called to reset the polling mechanism of the request manager
 *
 * @method reset
 */
RequestManager.prototype.reset = function (keepIsSyncing) {
    var _this = this;


    // uninstall all subscriptions
    Object.keys(this.subscriptions).forEach(function(id){
        if(!keepIsSyncing || _this.subscriptions[id].name !== 'syncing')
            _this.removeSubscription(id);
    });


    //  reset notification callbacks etc.
    if(this.provider.reset)
        this.provider.reset();
};

module.exports = {
    Manager: RequestManager,
    BatchManager: BatchManager
};

