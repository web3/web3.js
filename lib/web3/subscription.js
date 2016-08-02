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
/** @file subscription.js
 *
 * @authors:
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');
var errors = require('./errors');
var EventEmitter = require('eventemitter3');


var Subscription = function (options) {
    var emitter = new EventEmitter();
    this.id = null;
    this.callback = null;
    this._reconnectIntervalId = null;

    this.options = {
        subscription: options.subscription,
        subscribeMethod: options.subscribeMethod,
        unsubscribeMethod: options.unsubscribeMethod,
        requestManager: options.requestManager
    };


    // attach event emitter functions
    this.emit = emitter.emit;
    this.on = emitter.on;
    this.once = emitter.once;
    this.off = emitter.off;
    this.listeners = emitter.listeners;
    this.listenerCount = emitter.listenerCount;
    this.addListener = emitter.addListener;
    this.removeListener = emitter.removeListener;
    this.removeAllListeners = emitter.removeAllListeners;
    this.setMaxListeners = emitter.setMaxListeners;
    this.getMaxListeners = emitter.getMaxListeners;
};


/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */

Subscription.prototype._extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

/**
 * Should be called to check if the number of arguments is correct
 *
 * @method validateArgs
 * @param {Array} arguments
 * @throws {Error} if it is not
 */

Subscription.prototype._validateArgs = function (args) {
    var subscription = this.options.subscription;

    if(!subscription)
        subscription = {};

    if(!subscription.params)
        subscription.params = 0;

    if (args.length !== subscription.params + 1) {
        throw errors.InvalidNumberOfParams();
    }
};

/**
 * Should be called to format input args of method
 *
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */

Subscription.prototype._formatInput = function (args) {
    var subscription = this.options.subscription;

    if (!subscription || !subscription.inputFormatter) {
        return args;
    }

    var formattedArgs = subscription.inputFormatter.map(function (formatter, index) {
        return formatter ? formatter(args[index+1]) : args[index+1];
    });
    formattedArgs.unshift(args[0]);

    return formattedArgs;
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */

Subscription.prototype._formatOutput = function (result) {
    var subscription = this.options.subscription;

    return (subscription && subscription.outputFormatter && result) ? subscription.outputFormatter(result) : result;
};

/**
 * Should create payload from given input args
 *
 * @method toPayload
 * @param {Array} args
 * @return {Object}
 */
Subscription.prototype._toPayload = function (args) {
    this.callback = this._extractCallback(args);
    var params = this._formatInput(args);
    this._validateArgs(params);

    return {
        method: this.options.subscribeMethod,
        params: params
    };
};

/**
 * Unsubscribes and clears callbacks
 *
 * @method unsubscribe
 * @return {Object}
 */
Subscription.prototype.unsubscribe = function(callback) {
    this.removeAllListeners();
    clearInterval(this._reconnectIntervalId);
    this.options.requestManager.removeSubscription(this.id, callback);
    this.id = null;
};

/**
 * Subscribes and watches for changes
 *
 * @method subscribe
 * @param {String} the subscription
 * @param {Object} the options object with address topics and fromBlock
 * @return {Object}
 */
Subscription.prototype.subscribe = function() {
    var _this = this;
    var args = arguments;
    var payload = this._toPayload(Array.prototype.slice.call(arguments));

    // throw error, if provider doesnt support subscriptions
    if(!this.options.requestManager.provider.on)
        throw new Error('The current provider doesn\'t support subscriptions', this.options.requestManager.provider);

    // store the params in the options object
    this.options.params = payload.params[1];

    // get past logs, if fromBlock is available
    if(payload.params[0] === 'logs' && utils.isObject(payload.params[1]) && payload.params[1].hasOwnProperty('fromBlock') && isFinite(payload.params[1].fromBlock)) {
        // send the subscription request
        this.options.requestManager.sendAsync({
            method: 'eth_getLogs',
            params: [payload.params[1]]
        }, function (err, logs) {
            if(!err) {
                logs.forEach(function(log){
                    var output = _this._formatOutput(log);
                    _this.callback(null, output);
                    _this.emit('data', output);
                });
            } else {
                _this.callback(err);
                _this.emit('error', err);
            }
        });
    }

    console.log('Subscribe', args);

    // create subscription
    if (_this.callback) {

        console.log(payload);

        this.options.requestManager.sendAsync(payload, function (err, result) {
            if(!err && result) {
                _this.id = result;

                // call callback on notifications
                _this.options.requestManager.addSubscription(_this.id, payload.params[0] ,'eth', function(err, result) {
                    var output = _this._formatOutput(result);

                    _this.callback(err, output, _this);
                    if (!err) {
                        if(output.removed)
                            _this.emit('changed', output);
                        else
                            _this.emit('data', output);
                    } else {
                        // unsubscribe, but keep listeners
                        _this.options.requestManager.removeSubscription(_this.id);

                        // re-subscribe, if connection fails
                        if(_this.options.requestManager.provider.once) {
                            _this._reconnectIntervalId = setInterval(function () {
                                console.log('reconnect')
                                _this.options.requestManager.provider.reconnect();
                            }, 500);

                            _this.options.requestManager.provider.once('connect', function () {
                                clearInterval(_this._reconnectIntervalId);
                                _this.subscribe.apply(_this, args);
                            });
                        }
                        _this.emit('error', err);
                    }

                });
            } else {
                _this.callback(err);
            }
        });

        // return an object to cancel the subscription
        return this;

    } else
        throw new Error('Subscriptions require a callback as the last parameter!');
};

module.exports = Subscription;
