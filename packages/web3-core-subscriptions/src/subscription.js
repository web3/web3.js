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
 * @file subscription.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var errors = require('web3-core-helpers').errors;
var EventEmitter = require('eventemitter3');
var formatters = require('web3-core-helpers').formatters;

function identity(value) { //used to return the exact same replica of the value given to it as the argument
    return value;
}

function Subscription(options) {
    EventEmitter.call(this);

    this.id = null;
    this.callback = identity;
    this.arguments = null;
    this.lastBlock = null; // "from" block tracker for backfilling events on reconnection

    this.options = {
        subscription: options.subscription,
        type: options.type,
        requestManager: options.requestManager
    };
}

// INHERIT
Subscription.prototype = Object.create(EventEmitter.prototype);
Subscription.prototype.constructor = Subscription;


/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */

Subscription.prototype._extractCallback = function (args) {
    if (typeof args[args.length - 1] === 'function') {
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

    if (args.length !== subscription.params) {
        throw errors.InvalidNumberOfParams(
            args.length,
            subscription.params,
            subscription.subscriptionName
        );
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

    if (!subscription) {
        return args;
    }

    if (!subscription.inputFormatter) {
        return args;
    }

    var formattedArgs = subscription.inputFormatter.map(function (formatter, index) {
        return formatter ? formatter(args[index]) : args[index];
    });

    return formattedArgs;
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param result {Object}
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
    var params = [];
    this.callback = this._extractCallback(args) || identity;

    if (!this.subscriptionMethod) {
        this.subscriptionMethod = args.shift();

        // replace subscription with given name
        if (this.options.subscription.subscriptionName) {
            this.subscriptionMethod = this.options.subscription.subscriptionName;
        }
    }

    if (!this.arguments) {
        this.arguments = this._formatInput(args);
        this._validateArgs(this.arguments);
        args = []; // make empty after validation

    }

    // re-add subscriptionName
    params.push(this.subscriptionMethod);
    params = params.concat(this.arguments);


    if (args.length) {
        throw new Error('Only a callback is allowed as parameter on an already instantiated subscription.');
    }

    return {
        method: this.options.type + '_subscribe',
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
    this.options.requestManager.removeSubscription(this.id, callback);
    this.id = null;
    this.lastBlock = null;
    this.removeAllListeners();
};

/**
 * Subscribes and watches for changes
 *
 * @method subscribe
 * @param {String} subscription the subscription
 * @param {Object} options the options object with address topics and fromBlock
 * @return {Object}
 */
Subscription.prototype.subscribe = function() {
    var _this = this;
    var args = Array.prototype.slice.call(arguments);
    var payload = this._toPayload(args);

    if(!payload) {
        return this;
    }

    // throw error, if provider is not set
    if(!this.options.requestManager.provider) {
        setTimeout(function(){
            var err1 = new Error('No provider set.');
            _this.callback(err1, null, _this);
            _this.emit('error', err1);
        },0);

        return this;
    }

    // throw error, if provider doesnt support subscriptions
    if(!this.options.requestManager.provider.on) {
        setTimeout(function(){
            var err2 = new Error(
                'The current provider doesn\'t support subscriptions: ' +
                _this.options.requestManager.provider.constructor.name
            );
            _this.callback(err2, null, _this);
            _this.emit('error', err2);
        },0);

        return this;
    }

    // Re-subscription only: continue fetching from the last block we received.
    // a dropped connection may have resulted in gaps in the logs...
    if (this.lastBlock && !!this.options.params && typeof this.options.params === 'object'){
        payload.params[1] = this.options.params;
        payload.params[1].fromBlock = formatters.inputBlockNumberFormatter(this.lastBlock + 1);
    }

    // if id is there unsubscribe first
    if (this.id) {
        this.unsubscribe();
    }

    // store the params in the options object
    this.options.params = payload.params[1];

    // get past logs, if fromBlock is available
    if(payload.params[0] === 'logs' && !!payload.params[1] && typeof payload.params[1] === 'object' && payload.params[1].hasOwnProperty('fromBlock') && isFinite(payload.params[1].fromBlock)) {
        // send the subscription request

        // copy the params to avoid race-condition with deletion below this block
        var blockParams = Object.assign({}, payload.params[1]);

        this.options.requestManager.send({
            method: 'eth_getLogs',
            params: [blockParams]
        }, function (err, logs) {
            if(!err) {
                logs.forEach(function(log){
                    var output = _this._formatOutput(log);
                    _this.callback(null, output, _this);
                    _this.emit('data', output);
                });

                // TODO subscribe here? after the past logs?

            } else {
                setTimeout(function(){
                    _this.callback(err, null, _this);
                    _this.emit('error', err);
                },0);
            }
        });
    }

    // create subscription
    // TODO move to separate function? so that past logs can go first?

    if(typeof payload.params[1] === 'object')
        delete payload.params[1].fromBlock;

    this.options.requestManager.send(payload, function (err, result) {
        if(!err && result) {
            _this.id = result;
            _this.method = payload.params[0];
            _this.emit('connected', result);

            // call callback on notifications
            _this.options.requestManager.addSubscription(_this, function(error, result) {
                if (!error) {
                    if (!Array.isArray(result)) {
                        result = [result];
                    }

                    result.forEach(function(resultItem) {
                        var output = _this._formatOutput(resultItem);

                        // Track current block (for gaps introduced by dropped connections)
                        _this.lastBlock = !!output && typeof output === 'object' ? output.blockNumber : null;

                        if (typeof _this.options.subscription.subscriptionHandler === 'function' ) {
                            return _this.options.subscription.subscriptionHandler.call(_this, output);
                        } else {
                            _this.emit('data', output);
                        }

                        // call the callback, last so that unsubscribe there won't affect the emit above
                        _this.callback(null, output, _this);
                    });
                } else {
                    _this.callback(error, false, _this);
                    _this.emit('error', error);
                }
            });
        } else {
            setTimeout(function(){
                _this.callback(err, false, _this);
                _this.emit('error', err);
            },0);
        }
    });

    // return an object to cancel the subscription
    return this;
};

/**
 * Resubscribe
 *
 * @method resubscribe
 *
 * @returns {void}
 */
Subscription.prototype.resubscribe = function () {
    this.options.requestManager.removeSubscription(this.id); // unsubscribe
    this.id = null;

    this.subscribe(this.callback);
};

module.exports = Subscription;
